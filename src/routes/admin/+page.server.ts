import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ADMIN_PASSWORD, SESSION_SECRET } from '$env/static/private';
import { verifySessionToken } from '$lib/server/auth';
import { loadSharedMessages, saveSharedMessages } from '$lib/server/messageStore';
import {
  loadAmbientBackgrounds,
  loadBackgroundMusic,
  loadBuildingPhoto,
  saveBackgroundMusic,
  saveAmbientBackgrounds,
  saveBuildingPhoto
} from '$lib/server/ambientStore';
import {
  applyCreate,
  applyUpdate,
  applyDelete,
  applyTogglePin,
  applyToggleVisibility,
  sanitizeRichText,
  validateMessageFields,
  type MessageFields
} from '$lib/server/adminActions';
import { processAudioUpload, processUpload } from '$lib/server/upload';
import { randomUUID } from 'node:crypto';
import type { AmbientBackground, MessageTextSize, Weekday } from '$lib/types';

function requireAuth(cookies: import('@sveltejs/kit').Cookies, platform?: App.Platform): void {
  const token = cookies.get('admin_session');
	const password = platform?.env.ADMIN_PASSWORD ?? ADMIN_PASSWORD;
	const secret = platform?.env.SESSION_SECRET ?? SESSION_SECRET;
  if (!token || !verifySessionToken(token, password, secret)) {
    redirect(303, '/admin/login');
  }
}

async function parseFields(
  data: FormData,
  bucket?: R2Bucket,
  fallbackImages?: MessageFields['images']
): Promise<MessageFields | { error: string }> {
  const style = (data.get('style') as MessageFields['style']) ?? 'plain';
  const requestedTextSize = data.get('textSize');
  const textSize: MessageTextSize = requestedTextSize === 'small' || requestedTextSize === 'large'
    ? requestedTextSize
    : 'normal';
  const fields: MessageFields = {
    text: sanitizeRichText((data.get('text') as string) ?? ''),
    style,
    textSize,
    pinned: data.get('pinned') === 'on',
    enabled: data.get('enabled') === 'on'
  };

  if (style !== 'plain') {
    const curatedRef = data.get('curatedRef') as string | null;
    const file = data.get('image') as File | null;
    if (curatedRef) {
      fields.images = [{ id: randomUUID(), source: 'curated', ref: curatedRef }];
    } else if (file && file.size > 0) {
      try {
        fields.images = [await processUpload(file, bucket)];
      } catch (e) {
        return { error: (e as Error).message };
      }
    } else if (fallbackImages?.length) {
      fields.images = fallbackImages;
    }
  }

  const expiresAtRaw = data.get('expiresAt') as string | null;
  const activeDaysRaw = data.getAll('activeDays') as string[];
  const activeFromRaw = data.get('activeFrom') as string | null;
  const activeUntilRaw = data.get('activeUntil') as string | null;

  if (expiresAtRaw) fields.expiresAt = new Date(expiresAtRaw).toISOString();
  if (activeDaysRaw.length) fields.activeDays = activeDaysRaw as Weekday[];
  if (activeFromRaw) fields.activeFrom = activeFromRaw;
  if (activeUntilRaw) fields.activeUntil = activeUntilRaw;

  return fields;
}

export const load: PageServerLoad = async ({ cookies, url, platform }) => {
  requireAuth(cookies, platform);
  const [messages, ambientBackgrounds, buildingPhoto, backgroundMusic] = await Promise.all([
    loadSharedMessages(platform?.env.DB),
    loadAmbientBackgrounds(platform?.env.DB),
    loadBuildingPhoto(platform?.env.DB),
    loadBackgroundMusic(platform?.env.DB)
  ]);
  const editId = url.searchParams.get('edit');
  const editMessage = editId ? (messages.find((m) => m.id === editId) ?? null) : null;
  return { messages, editMessage, ambientBackgrounds, buildingPhoto, backgroundMusic };
};

export const actions: Actions = {
  logout: async ({ cookies }) => {
    cookies.delete('admin_session', { path: '/admin' });
    redirect(303, '/admin/login');
  },

  create: async ({ request, cookies, platform }) => {
    requireAuth(cookies, platform);
    const data = await request.formData();
    const result = await parseFields(data, platform?.env.UPLOADS);
    if ('error' in result) return fail(400, result);
    const fields = result;

    const error = validateMessageFields(fields);
    if (error) return fail(400, { error });

    await saveSharedMessages(applyCreate(await loadSharedMessages(platform?.env.DB), fields), platform?.env.DB);
    redirect(303, '/admin');
  },

  update: async ({ request, cookies, platform }) => {
    requireAuth(cookies, platform);
    const data = await request.formData();
    const id = data.get('id') as string;

    if (!id) return fail(400, { error: 'מזהה הודעה חסר' });

    const existing = (await loadSharedMessages(platform?.env.DB)).find((message) => message.id === id);
    const result = await parseFields(data, platform?.env.UPLOADS, existing?.images);
    if ('error' in result) return fail(400, result);
    const fields = result;

    const error = validateMessageFields(fields);
    if (error) return fail(400, { error });

    await saveSharedMessages(applyUpdate(await loadSharedMessages(platform?.env.DB), id, fields), platform?.env.DB);
    redirect(303, '/admin');
  },

  delete: async ({ request, cookies, platform }) => {
    requireAuth(cookies, platform);
    const data = await request.formData();
    const id = data.get('id') as string;
    if (!id) return fail(400, { error: 'מזהה חסר' });
    await saveSharedMessages(applyDelete(await loadSharedMessages(platform?.env.DB), id), platform?.env.DB);
    redirect(303, '/admin');
  },

  togglePin: async ({ request, cookies, platform }) => {
    requireAuth(cookies, platform);
    const data = await request.formData();
    const id = data.get('id') as string;
    if (!id) return fail(400, { error: 'מזהה חסר' });
    await saveSharedMessages(applyTogglePin(await loadSharedMessages(platform?.env.DB), id), platform?.env.DB);
    redirect(303, '/admin');
  },

  toggleVisibility: async ({ request, cookies, platform }) => {
    requireAuth(cookies, platform);
    const data = await request.formData();
    const id = data.get('id') as string;
    if (!id) return fail(400, { error: 'מזהה חסר' });
    await saveSharedMessages(applyToggleVisibility(await loadSharedMessages(platform?.env.DB), id), platform?.env.DB);
    redirect(303, '/admin');
  },

  replaceAmbientBackground: async ({ request, cookies, platform }) => {
    requireAuth(cookies, platform);
    const data = await request.formData();
    const slot = Number(data.get('slot'));
    const file = data.get('image') as File | null;
    const label = ((data.get('label') as string | null) ?? '').trim();

    if (!Number.isInteger(slot) || slot < 0 || slot > 2) {
      return fail(400, { error: 'מיקום תמונה אינו תקין.' });
    }
    if (!file || file.size === 0) {
      return fail(400, { error: 'יש לבחור תמונה להעלאה.' });
    }

    try {
      const upload = await processUpload(file, platform?.env.UPLOADS);
      const backgrounds = await loadAmbientBackgrounds(platform?.env.DB);
      const next: AmbientBackground[] = [...backgrounds];
      next[slot] = {
        id: upload.id,
        label: label || `תמונת אווירה ${slot + 1}`,
        src: `/uploads/${upload.ref}`
      };
      await saveAmbientBackgrounds(next, platform?.env.DB);
    } catch (e) {
      return fail(400, { error: (e as Error).message });
    }

    redirect(303, '/admin');
  },

  replaceBuildingPhoto: async ({ request, cookies, platform }) => {
    requireAuth(cookies, platform);
    const data = await request.formData();
    const file = data.get('image') as File | null;
    const label = ((data.get('label') as string | null) ?? '').trim();

    if (!file || file.size === 0) {
      return fail(400, { error: 'יש לבחור תמונת בניין להעלאה.' });
    }

    try {
      const upload = await processUpload(file, platform?.env.UPLOADS);
      await saveBuildingPhoto(
        { id: upload.id, label: label || 'תמונת הבניין', src: `/uploads/${upload.ref}` },
        platform?.env.DB
      );
    } catch (e) {
      return fail(400, { error: (e as Error).message });
    }

    redirect(303, '/admin');
  },

  replaceBackgroundMusic: async ({ request, cookies, platform }) => {
    requireAuth(cookies, platform);
    const data = await request.formData();
    const file = data.get('music') as File | null;
    const label = ((data.get('label') as string | null) ?? '').trim();
    if (!file || file.size === 0) return fail(400, { error: 'יש לבחור קובץ MP3.' });
    try {
      const filename = await processAudioUpload(file, platform?.env.UPLOADS);
      await saveBackgroundMusic(
        { id: randomUUID(), label: label || file.name.replace(/\.mp3$/i, ''), src: `/uploads/${filename}` },
        platform?.env.DB
      );
    } catch (e) {
      return fail(400, { error: (e as Error).message });
    }
    redirect(303, '/admin');
  }
};
