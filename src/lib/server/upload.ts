import { writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { mkdirSync } from 'node:fs';
import type { ImageRef } from '../types';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;
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

export function generateFilename(file: File): string {
  const ext = extname(file.name) || '.jpg';
  return `${randomUUID()}${ext}`;
}

export async function processUpload(file: File): Promise<ImageRef> {
  const error = validateUpload(file);
  if (error) throw new Error(error);

  const filename = generateFilename(file);
  mkdirSync(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(`${UPLOAD_DIR}/${filename}`, buffer);

  return { id: randomUUID(), source: 'upload', ref: filename };
}
