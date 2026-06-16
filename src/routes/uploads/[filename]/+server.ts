import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import type { RequestHandler } from './$types';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

export const GET: RequestHandler = async ({ params }) => {
  const { filename } = params;

  if (filename.includes('..') || filename.includes('/')) {
    return new Response('Invalid filename', { status: 400 });
  }

  try {
    const buffer = await readFile(`data/uploads/${filename}`);
    const ext = extname(filename).toLowerCase();
    const contentType = MIME[ext] ?? 'application/octet-stream';
    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
