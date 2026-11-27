import { Inject, Injectable } from '@nestjs/common';
import type { PrismaClient } from '@app/db';
import type { Readable } from 'node:stream';
import { ApiError } from '../common/api-error';
import { StorageService } from '../files/storage.service';
import { PRISMA } from '../infra/tokens';
import { assertUuid, loadSellerContext, requireSeller } from './access';

export interface MediaStream {
  stream: Readable;
  mime: string;
  bytes: number;
  cache: string;
}

/**
 * Serves marketplace images from the separate media bucket. Private verification documents are
 * never served here (visibility must be MEDIA). Every request re-checks access:
 *  - public: the file is attached to currently public content (approved product version of a
 *    listing in marketplace_products, storefront media of a supplier in marketplace_suppliers, or
 *    the image of a visible category). Anything else is 404, so unpublished drafts never leak.
 *  - seller: the file belongs to the caller's seller company.
 *  - admin: any marketplace image (admin.catalog.read, checked by the guard).
 */
@Injectable()
export class MediaAccessService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly storage: StorageService,
  ) {}

  private async open(fileId: string, cache: string): Promise<MediaStream> {
    const f = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!f || f.visibility !== 'MEDIA' || f.scanState !== 'CLEAN') throw new ApiError('NOT_FOUND', 'common.not_found');
    return { stream: await this.storage.get(f.objectKey, 'media'), mime: f.mime, bytes: f.bytes, cache };
  }

  async public(fileId: string) {
    assertUuid(fileId);
    const r = await this.prisma.$queryRaw<{ n: number }[]>`
      SELECT (
        (SELECT count(*) FROM product_media pm JOIN marketplace_products mp ON mp.version_id = pm.product_version_id
          WHERE pm.file_id = ${fileId}::uuid)
      + (SELECT count(*) FROM storefront_media sm JOIN marketplace_suppliers ms ON ms.id = sm.storefront_id
          WHERE sm.file_id = ${fileId}::uuid)
      + (SELECT count(*) FROM categories c LEFT JOIN categories p ON p.id = c.parent_id
          WHERE c.image_file_id = ${fileId}::uuid AND c.visible AND c.archived_at IS NULL AND c.restriction <> 'BLOCKED'
            AND (p.id IS NULL OR (p.visible AND p.archived_at IS NULL)))
      )::int AS n`;
    if ((r[0]?.n ?? 0) === 0) throw new ApiError('NOT_FOUND', 'common.not_found');
    // Short shared cache: a suspended listing's images stop being served within minutes.
    return this.open(fileId, 'public, max-age=300');
  }

  async seller(userId: string, workspaceId: string, fileId: string) {
    const ctx = await loadSellerContext(this.prisma, userId, workspaceId);
    requireSeller(ctx, 'seller.catalog.read');
    assertUuid(fileId);
    const f = await this.prisma.file.findFirst({
      where: { id: fileId, ownerCompanyId: ctx.company.id, visibility: 'MEDIA' },
      select: { id: true },
    });
    if (!f) throw new ApiError('NOT_FOUND', 'common.not_found');
    return this.open(fileId, 'private, max-age=300');
  }

  async admin(fileId: string) {
    assertUuid(fileId);
    return this.open(fileId, 'private, no-store');
  }
}
