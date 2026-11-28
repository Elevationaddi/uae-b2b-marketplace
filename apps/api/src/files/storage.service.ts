import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import { get as blobGet, put as blobPut } from '@vercel/blob';
import { Readable } from 'node:stream';
import type { ReadableStream as WebReadableStream } from 'node:stream/web';
import { APP_ENV } from '../infra/tokens';

/** 'private' = verification documents; 'media' = marketplace images (separate bucket). */
export type StorageArea = 'private' | 'media';

/**
 * Private object storage. Objects are never publicly addressable: every download goes through an
 * API route that checks permissions first.
 *
 * - `s3`: any S3-compatible store (local MinIO in development).
 * - `vercel-blob` (C-21): a **private** Vercel Blob store. Reads need the store token, so blob URLs
 *   are useless without the API. Areas become path prefixes (`private/`, `media/`) in one store.
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger('StorageService');
  private readonly client: S3Client | null;
  private readonly bucket: string | undefined;
  private readonly mediaBucket: string | undefined;

  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {
    this.bucket = env.STORAGE_BUCKET;
    this.mediaBucket =
      env.STORAGE_MEDIA_BUCKET ?? (env.STORAGE_BUCKET ? `${env.STORAGE_BUCKET}-media` : undefined);
    this.client =
      env.STORAGE_ENDPOINT && env.STORAGE_BUCKET
        ? new S3Client({
            endpoint: env.STORAGE_ENDPOINT,
            region: env.STORAGE_REGION,
            forcePathStyle: true,
            credentials: {
              accessKeyId: env.STORAGE_ACCESS_KEY ?? 'unset',
              secretAccessKey: env.STORAGE_SECRET_KEY ?? 'unset',
            },
          })
        : null;
  }

  private get blob(): boolean {
    return this.env.STORAGE_DRIVER === 'vercel-blob';
  }

  private blobOptions() {
    return {
      access: 'private' as const,
      ...(this.env.BLOB_READ_WRITE_TOKEN ? { token: this.env.BLOB_READ_WRITE_TOKEN } : {}),
      ...(this.env.BLOB_STORE_ID ? { storeId: this.env.BLOB_STORE_ID } : {}),
    };
  }

  get configured(): boolean {
    return this.blob
      ? !!(this.env.BLOB_READ_WRITE_TOKEN || this.env.BLOB_STORE_ID)
      : this.client !== null;
  }

  async onModuleInit(): Promise<void> {
    // Local development convenience only; production buckets are provisioned with infrastructure.
    if (this.blob || !this.client || this.env.isProduction) return;
    for (const bucket of [this.bucket, this.mediaBucket]) {
      try {
        await this.client.send(new HeadBucketCommand({ Bucket: bucket }));
      } catch {
        try {
          await this.client.send(new CreateBucketCommand({ Bucket: bucket }));
          this.logger.log(`created development bucket ${bucket}`);
        } catch (err) {
          this.logger.warn(`storage bucket unavailable: ${(err as Error).message}`);
        }
      }
    }
  }

  private bucketFor(kind: StorageArea): string | undefined {
    return kind === 'media' ? this.mediaBucket : this.bucket;
  }

  private require(): S3Client {
    if (!this.client) throw new Error('storage not configured');
    return this.client;
  }

  async put(
    key: string,
    body: Buffer,
    mime: string,
    sha256: string,
    area: StorageArea = 'private',
  ): Promise<void> {
    if (this.blob) {
      await blobPut(`${area}/${key}`, body, {
        ...this.blobOptions(),
        contentType: mime,
        // Keys are random and never reused; refuse to overwrite rather than replace silently.
        addRandomSuffix: false,
        allowOverwrite: false,
      });
      return;
    }
    await this.require().send(
      new PutObjectCommand({
        Bucket: this.bucketFor(area),
        Key: key,
        Body: body,
        ContentType: mime,
        Metadata: { sha256 },
      }),
    );
  }

  async get(key: string, area: StorageArea = 'private'): Promise<Readable> {
    if (this.blob) {
      const r = await blobGet(`${area}/${key}`, { ...this.blobOptions(), useCache: false });
      if (!r || r.statusCode !== 200 || !r.stream) throw new Error('object not found');
      return Readable.fromWeb(r.stream as unknown as WebReadableStream<Uint8Array>);
    }
    const res = await this.require().send(
      new GetObjectCommand({ Bucket: this.bucketFor(area), Key: key }),
    );
    return res.Body as Readable;
  }
}
