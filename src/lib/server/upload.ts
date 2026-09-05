import { writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { mkdirSync } from 'node:fs';
import type { ImageRef } from '../types';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;
const MAX_AUDIO_SIZE = 100 * 1024 * 1024;
const UPLOAD_DIR = 'data/uploads';

export function validateUpload(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'סוג קובץ לא נתמך. השתמש ב-JPEG, PNG, או WebP.';
  }
  if (file.size > MAX_SIZE) {
    return 'הקובץ גדול מדי. הגודל המקסימלי הוא 10MB.';
  }
  return null;
}

export function validateAudioUpload(file: File): string | null {
	if (file.type !== 'audio/mpeg' && !file.name.toLowerCase().endsWith('.mp3')) {
		return 'סוג קובץ לא נתמך. יש להעלות קובץ MP3.';
	}
	if (file.size > MAX_AUDIO_SIZE) return 'קובץ המוזיקה גדול מדי. הגודל המקסימלי הוא 100MB.';
	return null;
}

export function generateFilename(file: File): string {
  const ext = extname(file.name) || '.jpg';
  return `${randomUUID()}${ext}`;
}

export async function processUpload(file: File, bucket?: R2Bucket): Promise<ImageRef> {
  const error = validateUpload(file);
  if (error) throw new Error(error);

  const filename = generateFilename(file);
	if (bucket) {
		await bucket.put(`uploads/${filename}`, await file.arrayBuffer(), {
			httpMetadata: {
				contentType: file.type,
				cacheControl: 'public, max-age=31536000, immutable'
			}
		});
		return { id: randomUUID(), source: 'upload', ref: filename };
	}

  mkdirSync(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(`${UPLOAD_DIR}/${filename}`, buffer);

  return { id: randomUUID(), source: 'upload', ref: filename };
}

export async function processAudioUpload(file: File, bucket?: R2Bucket): Promise<string> {
	const error = validateAudioUpload(file);
	if (error) throw new Error(error);
	const filename = generateFilename(file);
	if (bucket) {
		await bucket.put(`uploads/${filename}`, await file.arrayBuffer(), {
			httpMetadata: { contentType: 'audio/mpeg', cacheControl: 'public, max-age=31536000, immutable' }
		});
		return filename;
	}
	mkdirSync(UPLOAD_DIR, { recursive: true });
	await writeFile(`${UPLOAD_DIR}/${filename}`, Buffer.from(await file.arrayBuffer()));
	return filename;
}
