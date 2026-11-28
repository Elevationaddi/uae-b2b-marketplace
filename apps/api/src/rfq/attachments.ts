import { Inject, Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import type { FilePurpose, Prisma, PrismaClient } from '@app/db';
import type { Readable } from 'node:stream';
import { ApiError } from '../common/api-error';
import { RateLimitService } from '../common/rate-limit.service';
import { ScannerService, sanitizeFilename, sniffMime } from '../files/scanner.service';
import { StorageService } from '../files/storage.service';
import { PRISMA } from '../infra/tokens';

export type Upload = { buffer: Buffer; originalname: string; mimetype: string; size: number };

/**
 * Private attachments for RFQs and quotes (docs/10-security.md): magic-byte type check, malware
 * scan before storage, randomized keys in the private bucket, never a public URL. Downloads are
 * streamed only after the caller's scope check, and audited.
 */
@Injectable()
export class AttachmentService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly storage: StorageService,
    private readonly scanner: ScannerService,
    private readonly limits: RateLimitService,
  ) {}

  /** Validate, scan and store; returns data for a File row (create it in the caller's tx). */
  async prepare(
    userId: string,
    companyId: string,
    file: Upload | undefined,
    purpose: FilePurpose,
    prefix: string,
  ): Promise<Prisma.FileUncheckedCreateInput> {
    await this.limits.consume('upload_user', userId);
    if (!file || file.size === 0)
      throw new ApiError('VALIDATION_FAILED', 'file.required', { file: 'required' });
    if (!this.scanner.enabled || !this.storage.configured)
      throw new ApiError('PROVIDER_UNAVAILABLE', 'file.scanning_unavailable');
    const mime = sniffMime(file.buffer);
    if (!mime) throw new ApiError('VALIDATION_FAILED', 'file.type_not_allowed', { file: 'type' });
    const sha256 = createHash('sha256').update(file.buffer).digest('hex');
    const scan = await this.scanner.scan(file.buffer);
    const objectKey = `${prefix}/${randomUUID()}`;
    // Infected files are recorded for the audit trail but never stored.
    if (scan === 'CLEAN') await this.storage.put(objectKey, file.buffer, mime, sha256);
    return {
      ownerCompanyId: companyId,
      uploaderId: userId,
      objectKey,
      originalName: sanitizeFilename(file.originalname),
      mime,
      bytes: file.size,
      sha256,
      scanState: scan,
      visibility: 'PRIVATE',
      purpose,
    };
  }

  async stream(fileId: string): Promise<{ stream: Readable; mime: string; name: string }> {
    const f = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!f) throw new ApiError('NOT_FOUND', 'common.not_found');
    if (f.scanState !== 'CLEAN') throw new ApiError('CONFLICT', 'file.not_clean');
    return { stream: await this.storage.get(f.objectKey), mime: f.mime, name: f.originalName };
  }
}
