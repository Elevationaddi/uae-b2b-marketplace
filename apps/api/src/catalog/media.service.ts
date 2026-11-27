import { Injectable } from '@nestjs/common';
import type { FilePurpose, Prisma } from '@app/db';
import { randomUUID } from 'node:crypto';
import sharp, { type OutputInfo } from 'sharp';
import { ApiError } from '../common/api-error';
import { sha256 } from '../common/crypto';
import { RateLimitService } from '../common/rate-limit.service';
import { ScannerService, sanitizeFilename, sniffMime } from '../files/scanner.service';
import { StorageService } from '../files/storage.service';

export type UploadedFile = { buffer: Buffer; originalname: string; size: number };

const MAX_EDGE = 2400;
const MAX_INPUT_PIXELS = 50_000_000;

/**
 * Marketplace image pipeline (docs/10-security.md "Product images only publicly served if approved
 * and sanitized"): magic-byte allowlist (PNG/JPEG/WebP), malware scan of the original bytes,
 * decode + re-encode with sharp (drops EXIF/GPS/ICC metadata, applies orientation, bounds the
 * size), then storage in the separate media bucket. Infected uploads are rejected and audited by
 * the caller; nothing is stored for them.
 */
@Injectable()
export class MediaService {
  constructor(
    private readonly storage: StorageService,
    private readonly scanner: ScannerService,
    private readonly limits: RateLimitService,
  ) {}

  async ingestImage(
    input: {
      file: UploadedFile | undefined;
      userId: string;
      companyId: string | null;
      purpose: FilePurpose;
    },
    create: (data: Prisma.FileUncheckedCreateInput) => Promise<{ id: string }>,
  ): Promise<{ fileId: string; width: number; height: number }> {
    const { file } = input;
    await this.limits.consume('upload_user', input.userId);
    if (!file || file.size === 0)
      throw new ApiError('VALIDATION_FAILED', 'file.required', { file: 'required' });
    if (!this.scanner.enabled || !this.storage.configured)
      throw new ApiError('PROVIDER_UNAVAILABLE', 'file.scanning_unavailable');
    const sniffed = sniffMime(file.buffer) ?? sniffWebp(file.buffer);
    if (sniffed !== 'image/png' && sniffed !== 'image/jpeg' && sniffed !== 'image/webp')
      throw new ApiError('VALIDATION_FAILED', 'file.image_type_not_allowed', { file: 'image_type' });
    const scan = await this.scanner.scan(file.buffer);
    if (scan !== 'CLEAN')
      throw new ApiError('VALIDATION_FAILED', 'file.infected', { file: 'infected' });

    let out: { data: Buffer; info: OutputInfo };
    try {
      const pipeline = sharp(file.buffer, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error' })
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });
      out = await (sniffed === 'image/png'
        ? pipeline.png({ compressionLevel: 9 })
        : sniffed === 'image/webp'
          ? pipeline.webp({ quality: 85 })
          : pipeline.jpeg({ quality: 85, mozjpeg: true })
      ).toBuffer({ resolveWithObject: true });
    } catch {
      throw new ApiError('VALIDATION_FAILED', 'file.image_unreadable', { file: 'image_unreadable' });
    }
    if (out.info.width < 200 || out.info.height < 200)
      throw new ApiError('VALIDATION_FAILED', 'file.image_too_small', { file: 'image_too_small' });
    const digest = sha256(out.data);
    const objectKey = `${input.purpose.toLowerCase()}/${input.companyId ?? 'platform'}/${randomUUID()}`;
    await this.storage.put(objectKey, out.data, sniffed, digest, 'media');
    const created = await create({
      ownerCompanyId: input.companyId,
      uploaderId: input.userId,
      objectKey,
      originalName: sanitizeFilename(file.originalname),
      mime: sniffed,
      bytes: out.data.length,
      sha256: digest,
      scanState: 'CLEAN',
      visibility: 'MEDIA',
      purpose: input.purpose,
      width: out.info.width,
      height: out.info.height,
    });
    return { fileId: created.id, width: out.info.width, height: out.info.height };
  }
}

function sniffWebp(buf: Buffer): 'image/webp' | null {
  return buf.length >= 12 &&
    buf.subarray(0, 4).toString('latin1') === 'RIFF' &&
    buf.subarray(8, 12).toString('latin1') === 'WEBP'
    ? 'image/webp'
    : null;
}
