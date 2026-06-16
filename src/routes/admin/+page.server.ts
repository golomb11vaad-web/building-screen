import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ADMIN_PASSWORD, SESSION_SECRET } from '$env/static/private';
import { verifySessionToken } from '$lib/server/auth';
import { loadMessages, saveMessages } from '$lib/server/messageStore';
import {
  applyCreate,
  applyUpdate,
  applyDelete,
  applyTogglePin,
  validateMessageFields,
  type MessageFields
} from '$lib/server/adminActions';
import { processUpload } from '$lib/server/upload';
import { randomUUID } from 'node:crypto';
import type { Weekday } from '$lib/types';

function requireAuth(cookies: import('@sveltejs/kit').Cookies): void {
  const token = cookies.get('admin_session');
  if (!token || !verifySessionToken(token, ADMIN_PASSWORD, SESSION_SECRET)) {
    redirect(303, '/admin/login');
  }
}

async function parseFields(data: FormData): Promise<MessageFields | { error: string }> {
  const style = (data.get('style') as MessageFields['style']) ?? 'plain';
  const fields: MessageFields = {
    text: (data.get('text') as string) ?? '',
    style,
    pinned: data.get('pinned') === 'on'
  };

  if (style !== 'plain') {
    const curatedRef = data.get('curatedRef') as string | null;
    const file = data.get('image') as File | null;
    if (curatedRef) {
      fields.images = [{ id: randomUUID(), source: 'curated', ref: curatedRef }];
    } else if (file && file.size > 0) {
      try {
        fields.images = [await processUpload(file)];
      } catch (e) {
        return { error: (e as Error).message };
      }
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

export const load: PageServerLoad = ({ cookies, url }) => {
  requireAuth(cookies);
  const messages = loadMessages();
  const editId = url.searchParams.get('edit');
  const editMessage = editId ? (messages.find((m) => m.id === editId) ?? null) : null;
  return { messages, editMessage };
};

export const actions: Actions = {
  logout: async ({ cookies }) => {
    cookies.delete('admin_session', { path: '/admin' });
    redirect(303, '/admin/login');
  },

  create: async ({ request, cookies }) => {
    requireAuth(cookies);
    const data = await request.formData();
    const result = await parseFields(data);
    if ('error' in result) return fail(400, result);
    const fields = result;

    const error = validateMessageFields(fields);
    if (error) return fail(400, { error });

    saveMessages(applyCreate(loadMessages(), fields));
    redirect(303, '/admin');
  },

  update: async ({ request, cookies }) => {
    requireAuth(cookies);
    const data = await request.formData();
    const id = data.get('id') as string;

    if (!id) return fail(400, { error: 'מזהה הודעה חסר' });

    const result = await parseFields(data);
    if ('error' in result) return fail(400, result);
    const fields = result;

    const error = validateMessageFields(fields);
    if (error) return fail(400, { error });

    saveMessages(applyUpdate(loadMessages(), id, fields));
    redirect(303, '/admin');
  },

  delete: async ({ request, cookies }) => {
    requireAuth(cookies);
    const data = await request.formData();
    const id = data.get('id') as string;
    if (!id) return fail(400, { error: 'מזהה חסר' });
    saveMessages(applyDelete(loadMessages(), id));
    redirect(303, '/admin');
  },

  togglePin: async ({ request, cookies }) => {
    requireAuth(cookies);
    const data = await request.formData();
    const id = data.get('id') as string;
    if (!id) return fail(400, { error: 'מזהה חסר' });
    saveMessages(applyTogglePin(loadMessages(), id));
    redirect(303, '/admin');
  }
};
