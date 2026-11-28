/**
 * Vercel Blob driver (C-21): objects go to a private store under an area prefix and are read
 * back with the store token only. The SDK is mocked; no network call is made.
 */
import { parseEnv } from '@app/config';
import { Readable } from 'node:stream';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StorageService } from './storage.service';

const calls: { put: unknown[][]; get: unknown[][] } = { put: [], get: [] };
vi.mock('@vercel/blob', () => ({
  put: vi.fn(async (...args: unknown[]) => {
    calls.put.push(args);
    return { url: 'https://store.private.blob.vercel-storage.com/x' };
  }),
  get: vi.fn(async (...args: unknown[]) => {
    calls.get.push(args);
    return String(args[0]).endsWith('missing')
      ? null
      : { statusCode: 200, stream: new Blob(['hello']).stream() };
  }),
}));

const env = parseEnv({
  ...process.env,
  NODE_ENV: 'test',
  STORAGE_DRIVER: 'vercel-blob',
  BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_test_token_1234',
});

describe('Vercel Blob storage driver (C-21)', () => {
  beforeEach(() => {
    calls.put = [];
    calls.get = [];
  });

  it('writes private objects under the area prefix, never overwriting', async () => {
    const s = new StorageService(env);
    expect(s.configured).toBe(true);
    await s.put('docs/abc.pdf', Buffer.from('%PDF-1.4'), 'application/pdf', 'f00', 'private');
    const [path, , opts] = calls.put[0] as [string, Buffer, Record<string, unknown>];
    expect(path).toBe('private/docs/abc.pdf');
    expect(opts).toMatchObject({
      access: 'private',
      token: 'vercel_blob_rw_test_token_1234',
      contentType: 'application/pdf',
      addRandomSuffix: false,
      allowOverwrite: false,
    });
    await s.put('img/1.png', Buffer.from('x'), 'image/png', 'f01', 'media');
    expect(calls.put[1]![0]).toBe('media/img/1.png');
  });

  it('streams objects back and fails for missing ones', async () => {
    const s = new StorageService(env);
    const stream = await s.get('docs/abc.pdf');
    expect(stream).toBeInstanceOf(Readable);
    const chunks: Buffer[] = [];
    for await (const c of stream) chunks.push(Buffer.from(c));
    expect(Buffer.concat(chunks).toString()).toBe('hello');
    expect(calls.get[0]![1]).toMatchObject({ access: 'private', useCache: false });
    await expect(s.get('docs/missing')).rejects.toThrow(/not found/);
  });

  it('needs no S3 bucket and skips local bucket creation', async () => {
    const s = new StorageService(env);
    await expect(s.onModuleInit()).resolves.toBeUndefined();
  });
});
