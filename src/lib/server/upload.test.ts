import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateUpload, generateFilename, processUpload } from './upload';

const makeFile = (name: string, type: string, size: number): File => {
  const content = new Uint8Array(size);
  const file = new File([content], name, { type });
  // Polyfill arrayBuffer if missing in test environment
  if (typeof file.arrayBuffer !== 'function') {
    Object.defineProperty(file, 'arrayBuffer', {
      value: () => Promise.resolve(content.buffer)
    });
  }
  return file;
};

describe('validateUpload', () => {
  it('returns null for a valid JPEG', () => {
    expect(validateUpload(makeFile('photo.jpg', 'image/jpeg', 100))).toBeNull();
  });

  it('returns null for PNG', () => {
    expect(validateUpload(makeFile('img.png', 'image/png', 100))).toBeNull();
  });

  it('returns null for WebP', () => {
    expect(validateUpload(makeFile('img.webp', 'image/webp', 100))).toBeNull();
  });

  it('returns error for unsupported type', () => {
    expect(validateUpload(makeFile('doc.pdf', 'application/pdf', 100))).toBeTruthy();
  });

  it('returns error when file exceeds 10 MB', () => {
    const tooBig = makeFile('big.jpg', 'image/jpeg', 11 * 1024 * 1024);
    expect(validateUpload(tooBig)).toBeTruthy();
  });
});

describe('generateFilename', () => {
  it('returns a uuid-based name with the original extension', () => {
    const name = generateFilename(makeFile('photo.jpg', 'image/jpeg', 0));
    expect(name).toMatch(/^[0-9a-f-]{36}\.jpg$/);
  });

  it('defaults to .jpg when file has no extension', () => {
    const name = generateFilename(makeFile('photo', 'image/jpeg', 0));
    expect(name).toMatch(/\.jpg$/);
  });
});

const mockWriteFile = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();
  return { ...actual, writeFile: mockWriteFile };
});

describe('processUpload', () => {
  afterEach(() => vi.restoreAllMocks());

  it('writes the file and returns a valid ImageRef', async () => {
    const file = makeFile('img.png', 'image/png', 50);
    const ref = await processUpload(file);

    expect(ref.source).toBe('upload');
    expect(ref.ref).toMatch(/\.png$/);
    expect(ref.id).toBeTruthy();
  });

  it('throws when the file type is invalid', async () => {
    const file = makeFile('bad.gif', 'image/gif', 50);
    await expect(processUpload(file)).rejects.toThrow();
  });
});
