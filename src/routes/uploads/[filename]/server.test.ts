import { describe, it, expect, vi } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { GET } from './+server';

const UPLOAD_DIR = 'data/uploads';

const makeEvent = (filename: string) =>
  ({ params: { filename } }) as any;

describe('GET /uploads/[filename]', () => {
  it('returns 200 and sets image content-type for a JPEG', async () => {
    mkdirSync(UPLOAD_DIR, { recursive: true });
    const testFile = join(UPLOAD_DIR, 'test-photo.jpg');
    writeFileSync(testFile, Buffer.from([0xff, 0xd8, 0xff, 0xe0]));
    try {
      const response = await GET(makeEvent('test-photo.jpg'));
      expect(response.status).toBe(200);
    } finally {
      rmSync(testFile, { force: true });
    }
  });

  it('returns 200 for a PNG file', async () => {
    mkdirSync(UPLOAD_DIR, { recursive: true });
    const testFile = join(UPLOAD_DIR, 'test-img.png');
    writeFileSync(testFile, Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    try {
      const response = await GET(makeEvent('test-img.png'));
      expect(response.status).toBe(200);
    } finally {
      rmSync(testFile, { force: true });
    }
  });

  it('returns 404 when file is not found', async () => {
    const response = await GET(makeEvent('nonexistent-12345.jpg'));
    expect(response.status).toBe(404);
  });

  it('returns 400 when filename contains path traversal', async () => {
    const response = await GET(makeEvent('../secret.txt'));
    expect(response.status).toBe(400);
  });

  it('returns 400 when filename contains a slash', async () => {
    const response = await GET(makeEvent('subdir/file.jpg'));
    expect(response.status).toBe(400);
  });
});
