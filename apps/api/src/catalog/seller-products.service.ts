import { Inject, Injectable } from '@nestjs/common';
import {
  validateSkuPricing,
  type PricingRequest,
  type ProductUpdateRequest,
  type SellerProductDetail,
  type SellerProductSummary,
  type productCreateRequest,
  type sellerProductsQuery,
  type skuCreateRequest,
  type skuUpdateRequest,
} from '@app/contracts';
import { Prisma, writeAudit, type PrismaClient, type Product, type User } from '@app/db';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import { NEWEST_FIRST, beforeCursor, decodeCursor, page } from '../common/pagination';
import type { RequestMeta } from '../common/request-context';
import { PRISMA } from '../infra/tokens';
import {
  loadSellerContext,
  requireSeller,
  sellerCan,
  assertUuid,
  type SellerContext,
} from './access';
import {
  CONTENT_FIELDS,
  SNAKE,
  assertSelectableCategory,
  contentOf,
  ensureDraft,
  isPublicProduct,
  isUniqueViolation,
  lockProduct,
  moderationEvent,
  refreshListingStats,
  screenContent,
  validateForSubmission,
} from './listing';
import {
  PRODUCT_INCLUDE,
  available,
  baseProductDetail,
  mediaUrl,
  type ProductWithRefs,
} from './mappers';
import { MediaService, type UploadedFile } from './media.service';

type Tx = Prisma.TransactionClient;
const LOCKED: Product['status'][] = ['SUSPENDED', 'REMOVED'];
const MAX_MEDIA = 12;

function audit(
  tx: Tx,
  user: User,
  ctx: SellerContext,
  action: string,
  productId: string,
  meta: RequestMeta,
  details?: Record<string, unknown>,
) {
  return writeAudit(tx, {
    actorId: user.id,
    actorType: 'user',
    action,
    resourceType: 'product',
    resourceId: productId,
    companyId: ctx.company.id,
    details: details ?? null,
    requestId: meta.requestId,
    ip: meta.ip,
  });
}

const PAST = {
  archive: 'archived',
  unpublish: 'unpublished',
  republish: 'republished',
  restore: 'restored',
} as const;

@Injectable()
export class SellerProductsService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly media: MediaService,
  ) {}

  context(user: User, workspaceId: string) {
    return loadSellerContext(this.prisma, user.id, workspaceId);
  }

  /** Product of this seller workspace or 404 (cross-tenant ids are indistinguishable from missing). */
  private async owned(tx: Tx | PrismaClient, ctx: SellerContext, productId: string) {
    assertUuid(productId);
    const p = await tx.product.findFirst({
      where: { id: productId, sellerWorkspaceId: ctx.workspace.id },
    });
    if (!p) throw new ApiError('NOT_FOUND', 'common.not_found');
    return p;
  }

  private async bump(tx: Tx, productId: string, expected: number) {
    const r = await tx.product.updateMany({
      where: { id: productId, version: expected },
      data: { version: { increment: 1 } },
    });
    if (r.count === 0) throw new ApiError('CONFLICT', 'common.stale_version');
  }

  // ------------------------------------------------------------------ read

  async overview(user: User, workspaceId: string) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.read');
    const ws = ctx.workspace.id;
    const [statusCounts, workingCounts, storefront, publicCount, skus, decisions] =
      await Promise.all([
        this.prisma.product.groupBy({
          by: ['status'],
          where: { sellerWorkspaceId: ws },
          _count: { _all: true },
        }),
        this.prisma.productVersion.groupBy({
          by: ['state'],
          where: { workingFor: { sellerWorkspaceId: ws } },
          _count: { _all: true },
        }),
        this.prisma.storefront.findUnique({ where: { sellerWorkspaceId: ws } }),
        this.prisma.$queryRaw<{ n: number }[]>`
          SELECT count(*)::int AS n FROM marketplace_products WHERE seller_workspace_id = ${ws}::uuid`,
        this.prisma.sku.findMany({
          where: { sellerWorkspaceId: ws, active: true, product: { status: { not: 'REMOVED' } } },
          include: {
            inventory: true,
            product: {
              select: {
                workingVersion: { select: { mode: true } },
                publishedVersion: { select: { mode: true } },
              },
            },
          },
        }),
        this.prisma.productVersion.findMany({
          where: {
            product: { sellerWorkspaceId: ws },
            decidedAt: { not: null },
            state: { in: ['APPROVED', 'REJECTED', 'CHANGES_REQUESTED'] },
          },
          orderBy: { decidedAt: 'desc' },
          take: 5,
        }),
      ]);
    const byStatus = (s: string) => statusCounts.find((c) => c.status === s)?._count._all ?? 0;
    const byState = (s: string) => workingCounts.find((c) => c.state === s)?._count._all ?? 0;
    const storefrontPublic = storefront
      ? ((
          await this.prisma.$queryRaw<{ n: number }[]>`
            SELECT count(*)::int AS n FROM marketplace_suppliers WHERE id = ${storefront.id}::uuid`
        )[0]?.n ?? 0) > 0
      : false;
    let low = 0;
    let out = 0;
    for (const s of skus) {
      const mode = s.product.publishedVersion?.mode ?? s.product.workingVersion?.mode;
      if (mode === 'MADE_TO_ORDER') continue;
      const a = available(s.inventory);
      if (a <= 0) out += 1;
      else if (s.lowStockThreshold > 0 && a <= s.lowStockThreshold) low += 1;
    }
    return {
      storefront: {
        exists: !!storefront,
        status: storefront?.status ?? null,
        public: storefrontPublic,
        admin_hidden: !!storefront?.adminHiddenAt,
      },
      products: {
        total: statusCounts.reduce((n, c) => n + c._count._all, 0),
        draft: byState('DRAFT'),
        pending: byState('PENDING_REVIEW'),
        published: byStatus('PUBLISHED'),
        public: publicCount[0]?.n ?? 0,
        rejected: byState('REJECTED') + byState('CHANGES_REQUESTED'),
        suspended: byStatus('SUSPENDED') + byStatus('REMOVED'),
        archived: byStatus('ARCHIVED') + byStatus('UNPUBLISHED'),
      },
      inventory: { skus: skus.length, low_stock: low, out_of_stock: out },
      eligibility: { can_list: ctx.eligible, reason: ctx.ineligibleReason },
      recent_decisions: decisions.map((d) => ({
        product_id: d.productId,
        title_en: d.titleEn,
        title_ar: d.titleAr,
        state: d.state,
        reason: d.decisionReason,
        decided_at: d.decidedAt!.toISOString(),
      })),
    };
  }

  async list(user: User, workspaceId: string, q: z.infer<typeof sellerProductsQuery>) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.read');
    const tabs: Record<string, Prisma.ProductWhereInput> = {
      all: {},
      draft: { workingVersion: { state: 'DRAFT' }, status: { notIn: ['REMOVED', 'ARCHIVED'] } },
      pending: { workingVersion: { state: 'PENDING_REVIEW' } },
      published: { status: 'PUBLISHED' },
      rejected: {
        workingVersion: { state: { in: ['REJECTED', 'CHANGES_REQUESTED'] } },
        status: { notIn: ['REMOVED'] },
      },
      suspended: { status: { in: ['SUSPENDED', 'REMOVED'] } },
      archived: { status: { in: ['ARCHIVED', 'UNPUBLISHED'] } },
    };
    const tabWhere = tabs[q.tab] ?? {};
    const search: Prisma.ProductWhereInput = q.q
      ? {
          OR: [
            { workingVersion: { titleEn: { contains: q.q, mode: 'insensitive' } } },
            { publishedVersion: { titleEn: { contains: q.q, mode: 'insensitive' } } },
            { workingVersion: { titleAr: { contains: q.q } } },
            { publishedVersion: { titleAr: { contains: q.q } } },
            { skus: { some: { code: { contains: q.q, mode: 'insensitive' } } } },
          ],
        }
      : {};
    const rows = await this.prisma.product.findMany({
      where: {
        sellerWorkspaceId: ctx.workspace.id,
        ...tabWhere,
        AND: [search, beforeCursor(decodeCursor(q.cursor))],
      },
      include: {
        workingVersion: {
          include: { category: true, media: { orderBy: { position: 'asc' }, take: 1 } },
        },
        publishedVersion: {
          include: { category: true, media: { orderBy: { position: 'asc' }, take: 1 } },
        },
        skus: { where: { active: true }, include: { inventory: true } },
      },
      orderBy: NEWEST_FIRST,
      take: q.limit + 1,
    });
    const { items, nextCursor } = page(rows, q.limit);
    const publicIds = new Set(
      items.length
        ? (
            await this.prisma.$queryRaw<{ id: string }[]>`
              SELECT id FROM marketplace_products WHERE id = ANY(${items.map((p) => p.id)}::uuid[])`
          ).map((r) => r.id)
        : [],
    );
    const scope = { kind: 'seller' as const, workspaceId: ctx.workspace.id };
    const data: SellerProductSummary[] = items.map((p) => {
      const v = p.workingVersion ?? p.publishedVersion!;
      const thumb = (p.publishedVersion ?? p.workingVersion)?.media[0] ?? v.media[0];
      return {
        id: p.id,
        status: p.status,
        price_type: p.priceType,
        title_en: v.titleEn,
        title_ar: v.titleAr,
        category_name_en: v.category.nameEn,
        category_name_ar: v.category.nameAr,
        thumbnail_url: thumb ? mediaUrl(scope, thumb.fileId) : null,
        working_state: p.workingVersion?.state ?? null,
        has_published_version: p.publishedVersionId !== null,
        public: publicIds.has(p.id),
        sku_count: p.skus.length,
        min_price_fils: p.minPriceFils?.toString() ?? null,
        min_moq: p.minMoq,
        low_stock_skus: p.skus.filter(
          (s) => s.lowStockThreshold > 0 && available(s.inventory) <= s.lowStockThreshold,
        ).length,
        decision_reason: p.workingVersion?.decisionReason ?? null,
        updated_at: p.updatedAt.toISOString(),
      };
    });
    return { data, meta: { next_cursor: nextCursor } };
  }

  async detail(user: User, workspaceId: string, productId: string): Promise<SellerProductDetail> {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.read');
    await this.owned(this.prisma, ctx, productId);
    return this.load(ctx, productId);
  }

  private async load(ctx: SellerContext, productId: string): Promise<SellerProductDetail> {
    const p = (await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      include: PRODUCT_INCLUDE,
    })) as ProductWithRefs;
    const [history, versions, isPublic] = await Promise.all([
      this.prisma.moderationEvent.findMany({
        where: { productId },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 50,
      }),
      this.prisma.productVersion.findMany({
        where: { productId },
        select: { id: true, version: true },
      }),
      isPublicProduct(this.prisma as unknown as Tx, productId),
    ]);
    const fileIds = [...(p.publishedVersion?.media ?? []), ...(p.workingVersion?.media ?? [])].map(
      (m) => m.fileId,
    );
    const files = fileIds.length
      ? await this.prisma.file.findMany({
          where: { id: { in: fileIds } },
          select: { id: true, width: true, height: true },
        })
      : [];
    const dims = new Map(files.map((f) => [f.id, { width: f.width, height: f.height }]));
    const base = baseProductDetail(
      p,
      { kind: 'seller', workspaceId: ctx.workspace.id },
      history,
      isPublic,
      new Map(versions.map((v) => [v.id, v.version])),
      dims,
    );
    const canEdit = sellerCan(ctx, 'seller.catalog.edit');
    const live = !LOCKED.includes(p.status) && p.status !== 'ARCHIVED';
    const w = p.workingVersion;
    return {
      ...base,
      actions: {
        edit: canEdit && live && w?.state !== 'PENDING_REVIEW',
        submit: canEdit && live && w?.state === 'DRAFT',
        withdraw: canEdit && live && w?.state === 'PENDING_REVIEW',
        archive: canEdit && live,
        unpublish: canEdit && p.status === 'PUBLISHED',
        republish: canEdit && p.status === 'UNPUBLISHED' && p.publishedVersionId !== null,
        restore: canEdit && p.status === 'ARCHIVED',
        duplicate: canEdit && p.status !== 'REMOVED',
        price: canEdit && live,
        adjust_stock: sellerCan(ctx, 'seller.inventory.ship') && p.status !== 'REMOVED',
      },
    };
  }

  // ------------------------------------------------------------------ create / edit

  async create(
    user: User,
    workspaceId: string,
    input: z.infer<typeof productCreateRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    try {
      const id = await this.prisma.$transaction(async (tx) => {
        await assertSelectableCategory(tx, input.category_id);
        const product = await tx.product.create({
          data: {
            sellerWorkspaceId: ctx.workspace.id,
            companyId: ctx.company.id,
            createdById: user.id,
            priceType: 'FIXED',
          },
        });
        const v = await tx.productVersion.create({
          data: {
            productId: product.id,
            version: 1,
            titleEn: input.title_en,
            titleAr: input.title_ar,
            categoryId: input.category_id,
            mode: input.mode,
            createdById: user.id,
          },
        });
        await tx.product.update({ where: { id: product.id }, data: { workingVersionId: v.id } });
        const sku = await tx.sku.create({
          data: {
            productId: product.id,
            sellerWorkspaceId: ctx.workspace.id,
            code: input.sku_code,
            unit: input.unit,
          },
        });
        await tx.inventory.create({ data: { skuId: sku.id } });
        await moderationEvent(tx, {
          productId: product.id,
          productVersionId: v.id,
          actorId: user.id,
          actorType: 'user',
          action: 'created',
          toState: 'DRAFT',
        });
        await audit(tx, user, ctx, 'product.created', product.id, meta, {
          category_id: input.category_id,
        });
        return product.id;
      });
      return this.load(ctx, id);
    } catch (err) {
      if (isUniqueViolation(err))
        throw new ApiError('CONFLICT', 'catalog.sku_exists', { sku_code: 'exists' });
      throw err;
    }
  }

  private async editable(tx: Tx, ctx: SellerContext, productId: string) {
    const p = await this.owned(tx, ctx, productId);
    await lockProduct(tx, productId);
    if (LOCKED.includes(p.status) || p.status === 'ARCHIVED')
      throw new ApiError('CONFLICT', 'catalog.product_locked');
    return p;
  }

  async update(
    user: User,
    workspaceId: string,
    productId: string,
    input: ProductUpdateRequest,
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    const { expected_version, ...fields } = input;
    await this.prisma.$transaction(async (tx) => {
      await this.editable(tx, ctx, productId);
      await this.bump(tx, productId, expected_version);
      if (fields.category_id) await assertSelectableCategory(tx, fields.category_id);
      const draft = await ensureDraft(tx, productId, user.id);
      const data: Record<string, unknown> = {};
      for (const f of CONTENT_FIELDS) {
        const key = SNAKE[f] as keyof typeof fields;
        if (fields[key] !== undefined) data[f] = fields[key];
      }
      // Moving to another category drops attributes that belong to the old one.
      if (fields.category_id && fields.category_id !== draft.categoryId && !fields.attributes)
        data.attributes = {};
      await tx.productVersion.update({
        where: { id: draft.id },
        data: data as Prisma.ProductVersionUpdateInput,
      });
      await audit(tx, user, ctx, 'product.content_updated', productId, meta, {
        version: draft.version,
        fields: Object.keys(fields),
      });
    });
    return this.load(ctx, productId);
  }

  // ------------------------------------------------------------------ media

  async addMedia(
    user: User,
    workspaceId: string,
    productId: string,
    file: UploadedFile | undefined,
    fields: { alt_en?: string | null; alt_ar?: string | null },
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    const p = await this.owned(this.prisma, ctx, productId);
    if (LOCKED.includes(p.status) || p.status === 'ARCHIVED')
      throw new ApiError('CONFLICT', 'catalog.product_locked');
    const { fileId } = await this.media.ingestImage(
      { file, userId: user.id, companyId: ctx.company.id, purpose: 'PRODUCT_IMAGE' },
      (data) => this.prisma.file.create({ data, select: { id: true } }),
    );
    await this.prisma.$transaction(async (tx) => {
      await this.editable(tx, ctx, productId);
      const draft = await ensureDraft(tx, productId, user.id);
      const count = await tx.productMedia.count({ where: { productVersionId: draft.id } });
      if (count >= MAX_MEDIA)
        throw new ApiError('CONFLICT', 'catalog.media_limit', { file: 'media_limit' });
      await tx.productMedia.create({
        data: {
          productVersionId: draft.id,
          fileId,
          position: count,
          altEn: fields.alt_en ?? null,
          altAr: fields.alt_ar ?? null,
        },
      });
      await tx.product.update({ where: { id: productId }, data: { version: { increment: 1 } } });
      await audit(tx, user, ctx, 'product.media_added', productId, meta, { file_id: fileId });
    });
    return this.load(ctx, productId);
  }

  async removeMedia(
    user: User,
    workspaceId: string,
    productId: string,
    fileId: string,
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    assertUuid(fileId);
    await this.prisma.$transaction(async (tx) => {
      await this.editable(tx, ctx, productId);
      const draft = await ensureDraft(tx, productId, user.id);
      const m = await tx.productMedia.findFirst({ where: { productVersionId: draft.id, fileId } });
      if (!m) throw new ApiError('NOT_FOUND', 'common.not_found');
      await tx.productMedia.delete({ where: { id: m.id } });
      const rest = await tx.productMedia.findMany({
        where: { productVersionId: draft.id },
        orderBy: { position: 'asc' },
      });
      for (const [i, r] of rest.entries())
        if (r.position !== i)
          await tx.productMedia.update({ where: { id: r.id }, data: { position: i } });
      await tx.product.update({ where: { id: productId }, data: { version: { increment: 1 } } });
      await audit(tx, user, ctx, 'product.media_removed', productId, meta, { file_id: fileId });
    });
    return this.load(ctx, productId);
  }

  async reorderMedia(
    user: User,
    workspaceId: string,
    productId: string,
    input: { file_ids: string[]; expected_version: number },
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    await this.prisma.$transaction(async (tx) => {
      await this.editable(tx, ctx, productId);
      await this.bump(tx, productId, input.expected_version);
      const draft = await ensureDraft(tx, productId, user.id);
      const media = await tx.productMedia.findMany({ where: { productVersionId: draft.id } });
      const current = new Set(media.map((m) => m.fileId));
      if (
        input.file_ids.length !== media.length ||
        new Set(input.file_ids).size !== input.file_ids.length ||
        input.file_ids.some((f) => !current.has(f))
      )
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
          file_ids: 'mismatch',
        });
      // Positions are unique per version through a DEFERRABLE constraint, checked at commit.
      for (const [i, fid] of input.file_ids.entries()) {
        const m = media.find((x) => x.fileId === fid)!;
        if (m.position !== i)
          await tx.productMedia.update({ where: { id: m.id }, data: { position: i } });
      }
      await audit(tx, user, ctx, 'product.media_reordered', productId, meta);
    });
    return this.load(ctx, productId);
  }

  // ------------------------------------------------------------------ variants and pricing

  async addSku(
    user: User,
    workspaceId: string,
    productId: string,
    input: z.infer<typeof skuCreateRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    try {
      await this.prisma.$transaction(async (tx) => {
        await this.editable(tx, ctx, productId);
        // A new variant is a material change: it needs a draft and stays pending until approved.
        await ensureDraft(tx, productId, user.id);
        const count = await tx.sku.count({ where: { productId } });
        if (count >= 100) throw new ApiError('CONFLICT', 'catalog.sku_limit');
        const sku = await tx.sku.create({
          data: {
            productId,
            sellerWorkspaceId: ctx.workspace.id,
            code: input.code,
            variantAttributes: input.variant_attributes,
            unit: input.unit,
          },
        });
        await tx.inventory.create({ data: { skuId: sku.id } });
        await tx.product.update({ where: { id: productId }, data: { version: { increment: 1 } } });
        await audit(tx, user, ctx, 'product.sku_added', productId, meta, {
          sku_id: sku.id,
          code: sku.code,
        });
      });
    } catch (err) {
      if (isUniqueViolation(err))
        throw new ApiError('CONFLICT', 'catalog.sku_exists', { code: 'exists' });
      throw err;
    }
    return this.load(ctx, productId);
  }

  async updateSku(
    user: User,
    workspaceId: string,
    productId: string,
    skuId: string,
    input: z.infer<typeof skuUpdateRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    assertUuid(skuId);
    try {
      await this.prisma.$transaction(async (tx) => {
        await this.editable(tx, ctx, productId);
        const sku = await tx.sku.findFirst({ where: { id: skuId, productId } });
        if (!sku) throw new ApiError('NOT_FOUND', 'common.not_found');
        const identity =
          input.code !== undefined ||
          input.variant_attributes !== undefined ||
          input.unit !== undefined;
        if (identity && sku.approvedAt)
          throw new ApiError('CONFLICT', 'catalog.sku_identity_locked');
        await tx.sku.update({
          where: { id: skuId },
          data: {
            ...(input.code !== undefined && { code: input.code }),
            ...(input.variant_attributes !== undefined && {
              variantAttributes: input.variant_attributes,
            }),
            ...(input.unit !== undefined && { unit: input.unit }),
            ...(input.active !== undefined && { active: input.active }),
          },
        });
        await tx.product.update({ where: { id: productId }, data: { version: { increment: 1 } } });
        await refreshListingStats(tx, productId);
        await audit(tx, user, ctx, 'product.sku_updated', productId, meta, {
          sku_id: skuId,
          fields: Object.keys(input),
        });
      });
    } catch (err) {
      if (isUniqueViolation(err))
        throw new ApiError('CONFLICT', 'catalog.sku_exists', { code: 'exists' });
      throw err;
    }
    return this.load(ctx, productId);
  }

  async deleteSku(
    user: User,
    workspaceId: string,
    productId: string,
    skuId: string,
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    assertUuid(skuId);
    await this.prisma.$transaction(async (tx) => {
      await this.editable(tx, ctx, productId);
      const sku = await tx.sku.findFirst({ where: { id: skuId, productId } });
      if (!sku) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (sku.approvedAt) throw new ApiError('CONFLICT', 'catalog.sku_approved_deactivate');
      if ((await tx.sku.count({ where: { productId } })) <= 1)
        throw new ApiError('CONFLICT', 'catalog.sku_last');
      if (await tx.stockMovement.count({ where: { skuId } }))
        throw new ApiError('CONFLICT', 'catalog.sku_has_stock_history');
      await tx.priceTier.deleteMany({ where: { skuId } });
      await tx.inventory.deleteMany({ where: { skuId } });
      await tx.sku.delete({ where: { id: skuId } });
      await tx.product.update({ where: { id: productId }, data: { version: { increment: 1 } } });
      await refreshListingStats(tx, productId);
      await audit(tx, user, ctx, 'product.sku_deleted', productId, meta, {
        sku_id: skuId,
        code: sku.code,
      });
    });
    return this.load(ctx, productId);
  }

  /**
   * Live wholesale pricing (A11): validated server-side (T07), applied immediately without
   * review, and audited with before/after values.
   */
  async setPricing(
    user: User,
    workspaceId: string,
    productId: string,
    input: PricingRequest,
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    await this.prisma.$transaction(async (tx) => {
      const p = await this.editable(tx, ctx, productId);
      const skus = await tx.sku.findMany({
        where: { productId },
        include: { tiers: { orderBy: { minQty: 'asc' } } },
      });
      const byId = new Map(skus.map((s) => [s.id, s]));
      const errors: Record<string, string> = {};
      const seen = new Set<string>();
      input.skus.forEach((s, i) => {
        if (!byId.has(s.sku_id) || seen.has(s.sku_id)) errors[`skus.${i}.sku_id`] = 'invalid';
        seen.add(s.sku_id);
        for (const [k, v] of Object.entries(validateSkuPricing(input.price_type, s)))
          errors[`skus.${i}.${k}`] = v;
      });
      if (input.price_type !== p.priceType) {
        // Changing the pricing model must cover every active variant.
        const missing = skus.filter((s) => s.active && !seen.has(s.id));
        if (missing.length) errors.skus = 'all_active_required';
      }
      if (Object.keys(errors).length)
        throw new ApiError('VALIDATION_FAILED', 'catalog.pricing_invalid', errors);
      await this.bump(tx, productId, input.expected_version);
      const before = input.skus.map((s) => {
        const cur = byId.get(s.sku_id)!;
        return {
          sku: cur.code,
          moq: cur.moq,
          increment: cur.orderIncrement,
          tiers: cur.tiers.map((t) => [t.minQty, t.unitPriceFils.toString()]),
        };
      });
      for (const s of input.skus) {
        await tx.sku.update({
          where: { id: s.sku_id },
          data: { moq: s.moq, orderIncrement: s.order_increment },
        });
        await tx.priceTier.deleteMany({ where: { skuId: s.sku_id } });
        if (s.tiers.length)
          await tx.priceTier.createMany({
            data: s.tiers.map((t) => ({
              skuId: s.sku_id,
              minQty: t.min_qty,
              unitPriceFils: BigInt(t.unit_price_fils),
            })),
          });
      }
      await tx.product.update({ where: { id: productId }, data: { priceType: input.price_type } });
      await refreshListingStats(tx, productId);
      await audit(tx, user, ctx, 'product.pricing_updated', productId, meta, {
        price_type: { from: p.priceType, to: input.price_type },
        before,
        after: input.skus.map((s) => ({
          sku: byId.get(s.sku_id)!.code,
          moq: s.moq,
          increment: s.order_increment,
          tiers: s.tiers.map((t) => [t.min_qty, t.unit_price_fils]),
        })),
      });
    });
    return this.load(ctx, productId);
  }

  // ------------------------------------------------------------------ lifecycle

  async submit(
    user: User,
    workspaceId: string,
    productId: string,
    expected: number,
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    await this.prisma.$transaction(async (tx) => {
      const p = await this.editable(tx, ctx, productId);
      const draft = p.workingVersionId
        ? await tx.productVersion.findUnique({ where: { id: p.workingVersionId } })
        : null;
      if (!draft || draft.state !== 'DRAFT')
        throw new ApiError('CONFLICT', 'catalog.nothing_to_submit');
      const errors = await validateForSubmission(tx, productId, draft, p.priceType);
      if (Object.keys(errors).length)
        throw new ApiError('VALIDATION_FAILED', 'catalog.submission_incomplete', errors);
      const cat = await tx.category.findUniqueOrThrow({
        where: { id: draft.categoryId },
        include: { parent: true },
      });
      const restriction =
        cat.restriction === 'REVIEW_REQUIRED' || cat.parent?.restriction === 'REVIEW_REQUIRED'
          ? 'REVIEW_REQUIRED'
          : 'OPEN';
      const screening = await screenContent(tx, draft, cat.parentId, restriction);
      if (screening.blocked.length) {
        const fe: Record<string, string> = {};
        for (const b of screening.blocked) fe[b.field] = 'restricted_term';
        await audit(tx, user, ctx, 'product.submission_blocked', productId, meta, {
          terms: screening.blocked.map((b) => b.term),
        });
        throw new ApiError('VALIDATION_FAILED', 'catalog.restricted_term', fe);
      }
      await this.bump(tx, productId, expected);
      await tx.productVersion.update({
        where: { id: draft.id },
        data: {
          state: 'PENDING_REVIEW',
          submittedAt: new Date(),
          submittedById: user.id,
          autoFlags: screening.flags,
          decidedAt: null,
          decidedById: null,
          decisionReason: null,
        },
      });
      await moderationEvent(tx, {
        productId,
        productVersionId: draft.id,
        actorId: user.id,
        actorType: 'user',
        action: 'submitted',
        fromState: 'DRAFT',
        toState: 'PENDING_REVIEW',
      });
      await audit(tx, user, ctx, 'product.submitted', productId, meta, {
        version: draft.version,
        flags: screening.flags.map((f) => f.kind),
      });
    });
    return this.load(ctx, productId);
  }

  async withdraw(
    user: User,
    workspaceId: string,
    productId: string,
    expected: number,
    meta: RequestMeta,
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    await this.prisma.$transaction(async (tx) => {
      const p = await this.editable(tx, ctx, productId);
      const w = p.workingVersionId
        ? await tx.productVersion.findUnique({ where: { id: p.workingVersionId } })
        : null;
      if (w?.state !== 'PENDING_REVIEW') throw new ApiError('CONFLICT', 'catalog.not_pending');
      await this.bump(tx, productId, expected);
      await tx.productVersion.update({
        where: { id: w.id },
        data: { state: 'DRAFT', submittedAt: null, submittedById: null, autoFlags: [] },
      });
      await moderationEvent(tx, {
        productId,
        productVersionId: w.id,
        actorId: user.id,
        actorType: 'user',
        action: 'withdrawn',
        fromState: 'PENDING_REVIEW',
        toState: 'DRAFT',
      });
      await audit(tx, user, ctx, 'product.withdrawn', productId, meta, { version: w.version });
    });
    return this.load(ctx, productId);
  }

  private async transition(
    user: User,
    workspaceId: string,
    productId: string,
    expected: number,
    meta: RequestMeta,
    action: 'archive' | 'unpublish' | 'republish' | 'restore',
  ) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    await this.prisma.$transaction(async (tx) => {
      const p = await this.owned(tx, ctx, productId);
      await lockProduct(tx, productId);
      let to: Product['status'];
      if (action === 'archive') {
        if (LOCKED.includes(p.status) || p.status === 'ARCHIVED')
          throw new ApiError('CONFLICT', 'catalog.invalid_transition');
        to = 'ARCHIVED';
        // An archived listing has nothing under review.
        if (p.workingVersionId) {
          const w = await tx.productVersion.findUnique({ where: { id: p.workingVersionId } });
          if (w?.state === 'PENDING_REVIEW')
            await tx.productVersion.update({
              where: { id: w.id },
              data: { state: 'DRAFT', submittedAt: null, submittedById: null },
            });
        }
      } else if (action === 'unpublish') {
        if (p.status !== 'PUBLISHED') throw new ApiError('CONFLICT', 'catalog.invalid_transition');
        to = 'UNPUBLISHED';
      } else if (action === 'republish') {
        if (p.status !== 'UNPUBLISHED' || !p.publishedVersionId)
          throw new ApiError('CONFLICT', 'catalog.invalid_transition');
        to = 'PUBLISHED';
      } else {
        if (p.status !== 'ARCHIVED') throw new ApiError('CONFLICT', 'catalog.invalid_transition');
        to = p.publishedVersionId ? 'UNPUBLISHED' : 'DRAFT';
      }
      await this.bump(tx, productId, expected);
      await tx.product.update({
        where: { id: productId },
        data: { status: to, ...(to === 'PUBLISHED' ? { publishedAt: new Date() } : {}) },
      });
      await moderationEvent(tx, {
        productId,
        actorId: user.id,
        actorType: 'user',
        action,
        fromState: p.status,
        toState: to,
      });
      await audit(tx, user, ctx, `product.${PAST[action]}`, productId, meta, {
        from: p.status,
        to,
      });
    });
    return this.load(ctx, productId);
  }

  archive(u: User, w: string, p: string, v: number, m: RequestMeta) {
    return this.transition(u, w, p, v, m, 'archive');
  }
  unpublish(u: User, w: string, p: string, v: number, m: RequestMeta) {
    return this.transition(u, w, p, v, m, 'unpublish');
  }
  republish(u: User, w: string, p: string, v: number, m: RequestMeta) {
    return this.transition(u, w, p, v, m, 'republish');
  }
  restore(u: User, w: string, p: string, v: number, m: RequestMeta) {
    return this.transition(u, w, p, v, m, 'restore');
  }

  async duplicate(user: User, workspaceId: string, productId: string, meta: RequestMeta) {
    const ctx = await this.context(user, workspaceId);
    requireSeller(ctx, 'seller.catalog.edit');
    const newId = await this.prisma.$transaction(async (tx) => {
      const src = await this.owned(tx, ctx, productId);
      if (src.status === 'REMOVED') throw new ApiError('CONFLICT', 'catalog.product_locked');
      const sourceVersion = await tx.productVersion.findUniqueOrThrow({
        where: { id: (src.workingVersionId ?? src.publishedVersionId)! },
        include: { media: true },
      });
      const product = await tx.product.create({
        data: {
          sellerWorkspaceId: ctx.workspace.id,
          companyId: ctx.company.id,
          createdById: user.id,
          priceType: src.priceType,
        },
      });
      const copyTitle = (t: string) => (t.length + 7 <= 150 ? `${t} (copy)` : t);
      const v = await tx.productVersion.create({
        data: {
          ...contentOf(sourceVersion),
          titleEn: copyTitle(sourceVersion.titleEn),
          productId: product.id,
          version: 1,
          state: 'DRAFT',
          createdById: user.id,
        },
      });
      if (sourceVersion.media.length)
        await tx.productMedia.createMany({
          data: sourceVersion.media.map((m) => ({
            productVersionId: v.id,
            fileId: m.fileId,
            position: m.position,
            altEn: m.altEn,
            altAr: m.altAr,
          })),
        });
      await tx.product.update({ where: { id: product.id }, data: { workingVersionId: v.id } });
      const skus = await tx.sku.findMany({
        where: { productId, active: true },
        include: { tiers: true },
      });
      for (const s of skus) {
        let code = `${s.code}-COPY`.slice(0, 40);
        for (
          let n = 2;
          await tx.sku.findFirst({ where: { sellerWorkspaceId: ctx.workspace.id, code } });
          n++
        )
          code = `${s.code.slice(0, 32)}-COPY${n}`;
        const ns = await tx.sku.create({
          data: {
            productId: product.id,
            sellerWorkspaceId: ctx.workspace.id,
            code,
            variantAttributes: s.variantAttributes ?? {},
            unit: s.unit,
            moq: s.moq,
            orderIncrement: s.orderIncrement,
            lowStockThreshold: s.lowStockThreshold,
          },
        });
        await tx.inventory.create({ data: { skuId: ns.id } });
        if (s.tiers.length)
          await tx.priceTier.createMany({
            data: s.tiers.map((t) => ({
              skuId: ns.id,
              minQty: t.minQty,
              unitPriceFils: t.unitPriceFils,
            })),
          });
      }
      await refreshListingStats(tx, product.id);
      await moderationEvent(tx, {
        productId: product.id,
        productVersionId: v.id,
        actorId: user.id,
        actorType: 'user',
        action: 'duplicated',
        toState: 'DRAFT',
        reason: null,
      });
      await audit(tx, user, ctx, 'product.duplicated', product.id, meta, {
        source_product_id: productId,
      });
      return product.id;
    });
    return this.load(ctx, newId);
  }
}
