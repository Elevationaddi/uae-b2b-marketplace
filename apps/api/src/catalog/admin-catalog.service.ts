import { Inject, Injectable } from '@nestjs/common';
import type {
  adminProductsQuery,
  adminStorefrontsQuery,
  attributeCreateRequest,
  attributeUpdateRequest,
  catalogDecisionRequest,
  catalogQueueQuery,
  categoryCreateRequest,
  categoryUpdateRequest,
  featuredCreateRequest,
  restrictedTermCreateRequest,
  restrictedTermUpdateRequest,
} from '@app/contracts';
import {
  Prisma,
  enqueueEmail,
  isLicenceExpired,
  toIsoDate,
  writeAudit,
  type PrismaClient,
  type User,
} from '@app/db';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import { NEWEST_FIRST, beforeCursor, decodeCursor, page } from '../common/pagination';
import type { RequestMeta } from '../common/request-context';
import { PRISMA } from '../infra/tokens';
import { assertUuid, sellerEligibility } from './access';
import {
  isPublicProduct,
  isUniqueViolation,
  lockProduct,
  moderationEvent,
  refreshListingStats,
} from './listing';
import {
  PRODUCT_INCLUDE,
  baseProductDetail,
  mapEvent,
  mapSku,
  mapStorefront,
  mapVersion,
  mediaUrl,
  type ProductWithRefs,
  type VersionWithRefs,
} from './mappers';
import { MediaService, type UploadedFile } from './media.service';

type Tx = Prisma.TransactionClient;
const ADMIN = { kind: 'admin' } as const;

const COMPARED_FIELDS: [string, string][] = [
  ['titleEn', 'title_en'],
  ['titleAr', 'title_ar'],
  ['descriptionEn', 'description_en'],
  ['descriptionAr', 'description_ar'],
  ['categoryId', 'category_id'],
  ['mode', 'mode'],
  ['attributes', 'attributes'],
  ['specifications', 'specifications'],
  ['materials', 'materials'],
  ['dimensions', 'dimensions'],
  ['countryOfOrigin', 'country_of_origin'],
  ['leadTimeMinDays', 'lead_time_min_days'],
  ['leadTimeMaxDays', 'lead_time_max_days'],
  ['fulfilmentDays', 'fulfilment_days'],
  ['customManufacturing', 'custom_manufacturing'],
  ['privateLabel', 'private_label'],
  ['whiteLabel', 'white_label'],
  ['samplesAvailable', 'samples_available'],
  ['sampleNote', 'sample_note'],
  ['certifications', 'certifications'],
  ['videoUrl', 'video_url'],
];

/**
 * Admin catalog: moderation queue and decisions, listing enforcement, storefront oversight,
 * categories/attributes, restricted terms and featured placements (docs/04-admin.md). Every
 * mutation is audited. Admins never edit a seller's content, price, stock or commitments: they can
 * only approve/reject, suspend/restore/remove with a reason, and hide/restore storefronts.
 */
@Injectable()
export class AdminCatalogService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly media: MediaService,
  ) {}

  private audit(
    tx: Tx,
    admin: User,
    action: string,
    type: string,
    id: string,
    companyId: string | null,
    meta: RequestMeta,
    details?: Record<string, unknown>,
  ) {
    return writeAudit(tx, {
      actorId: admin.id,
      actorType: 'admin',
      action,
      resourceType: type,
      resourceId: id,
      companyId,
      details: details ?? null,
      requestId: meta.requestId,
      ip: meta.ip,
    });
  }

  // ------------------------------------------------------------------ overview

  async overview() {
    const [pendingNew, pendingUpd, flagged, pub, suspended, sup, hidden, cats, blocked, oldest] =
      await Promise.all([
        this.prisma.productVersion.count({
          where: { state: 'PENDING_REVIEW', product: { publishedVersionId: null } },
        }),
        this.prisma.productVersion.count({
          where: { state: 'PENDING_REVIEW', product: { publishedVersionId: { not: null } } },
        }),
        this.prisma.productVersion.count({
          where: { state: 'PENDING_REVIEW', NOT: { autoFlags: { equals: [] } } },
        }),
        this.prisma.$queryRaw<{ n: number }[]>`SELECT count(*)::int AS n FROM marketplace_products`,
        this.prisma.product.count({ where: { status: 'SUSPENDED' } }),
        this.prisma.$queryRaw<
          { n: number }[]
        >`SELECT count(*)::int AS n FROM marketplace_suppliers`,
        this.prisma.storefront.count({ where: { adminHiddenAt: { not: null } } }),
        this.prisma.category.count({ where: { archivedAt: null } }),
        this.prisma.category.count({ where: { archivedAt: null, restriction: 'BLOCKED' } }),
        this.prisma.productVersion.findFirst({
          where: { state: 'PENDING_REVIEW' },
          orderBy: { submittedAt: 'asc' },
        }),
      ]);
    return {
      pending_reviews: pendingNew,
      pending_updates: pendingUpd,
      flagged_pending: flagged,
      public_products: pub[0]?.n ?? 0,
      suspended_products: suspended,
      public_suppliers: sup[0]?.n ?? 0,
      hidden_storefronts: hidden,
      categories: cats,
      blocked_categories: blocked,
      oldest_pending_at: oldest?.submittedAt?.toISOString() ?? null,
    };
  }

  // ------------------------------------------------------------------ moderation queue

  async queue(q: z.infer<typeof catalogQueueQuery>) {
    const state = q.state ?? 'PENDING_REVIEW';
    const pending = state === 'PENDING_REVIEW';
    // Pending: oldest first (FIFO). Decided: newest decisions first. Offset-free keyset on id+time.
    const cursor = decodeCursor(q.cursor);
    const rows = await this.prisma.productVersion.findMany({
      where: {
        state,
        ...(q.q
          ? {
              OR: [
                { titleEn: { contains: q.q, mode: 'insensitive' } },
                { titleAr: { contains: q.q } },
                { product: { company: { displayName: { contains: q.q, mode: 'insensitive' } } } },
              ],
            }
          : {}),
        ...(cursor
          ? pending
            ? {
                OR: [
                  { createdAt: { gt: cursor.createdAt } },
                  { createdAt: cursor.createdAt, id: { gt: cursor.id } },
                ],
              }
            : beforeCursor(cursor)
          : {}),
      },
      include: { product: { include: { company: true } }, category: true },
      orderBy: pending ? [{ createdAt: 'asc' }, { id: 'asc' }] : NEWEST_FIRST,
      take: q.limit + 1,
    });
    const { items, nextCursor } = page(rows, q.limit);
    return {
      data: items.map((v) => ({
        version_id: v.id,
        product_id: v.productId,
        version: v.version,
        state: v.state,
        title_en: v.titleEn,
        title_ar: v.titleAr,
        company: { id: v.product.company.id, display_name: v.product.company.displayName },
        category: {
          id: v.category.id,
          name_en: v.category.nameEn,
          name_ar: v.category.nameAr,
          restriction: v.category.restriction,
        },
        is_update: v.product.publishedVersionId !== null && v.product.publishedVersionId !== v.id,
        auto_flags: (Array.isArray(v.autoFlags)
          ? (v.autoFlags as Record<string, unknown>[])
          : []
        ).map((f) => ({
          kind: String(f.kind ?? ''),
          term: String(f.term ?? ''),
          field: String(f.field ?? ''),
        })),
        submitted_at: v.submittedAt?.toISOString() ?? null,
        decided_at: v.decidedAt?.toISOString() ?? null,
      })),
      meta: { next_cursor: nextCursor },
    };
  }

  private async dims(versions: (VersionWithRefs | null | undefined)[]) {
    const ids = versions.flatMap((v) => v?.media.map((m) => m.fileId) ?? []);
    const files = ids.length
      ? await this.prisma.file.findMany({
          where: { id: { in: ids } },
          select: { id: true, width: true, height: true },
        })
      : [];
    return new Map(files.map((f) => [f.id, { width: f.width, height: f.height }]));
  }

  async review(versionId: string) {
    assertUuid(versionId);
    const v = (await this.prisma.productVersion.findUnique({
      where: { id: versionId },
      include: { media: { orderBy: { position: 'asc' } }, category: { include: { parent: true } } },
    })) as VersionWithRefs | null;
    if (!v) throw new ApiError('NOT_FOUND', 'common.not_found');
    const p = (await this.prisma.product.findUniqueOrThrow({
      where: { id: v.productId },
      include: { ...PRODUCT_INCLUDE, company: true },
    })) as ProductWithRefs & {
      company: {
        id: string;
        displayName: string;
        status: string;
        licenceExpiry: Date;
        emirate: string;
      };
    };
    const published =
      p.publishedVersion && p.publishedVersion.id !== v.id ? p.publishedVersion : null;
    const [history, versions, storefront, dims] = await Promise.all([
      this.prisma.moderationEvent.findMany({
        where: { productId: p.id },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 50,
      }),
      this.prisma.productVersion.findMany({
        where: { productId: p.id },
        select: { id: true, version: true },
      }),
      this.prisma.storefront.findUnique({ where: { sellerWorkspaceId: p.sellerWorkspaceId } }),
      this.dims([v, published]),
    ]);
    const changed: string[] = [];
    if (published) {
      for (const [k, snake] of COMPARED_FIELDS) {
        const a = (v as unknown as Record<string, unknown>)[k];
        const b = (published as unknown as Record<string, unknown>)[k];
        if (JSON.stringify(a ?? null) !== JSON.stringify(b ?? null)) changed.push(snake);
      }
      const ma = v.media.map((m) => m.fileId).join(',');
      const mb = published.media.map((m) => m.fileId).join(',');
      if (ma !== mb) changed.push('media');
    }
    const vn = new Map(versions.map((x) => [x.id, x.version]));
    return {
      version: mapVersion(v, ADMIN, dims),
      published_version: published ? mapVersion(published, ADMIN, dims) : null,
      changed_fields: changed,
      product: {
        id: p.id,
        status: p.status,
        price_type: p.priceType,
        workspace_id: p.sellerWorkspaceId,
      },
      skus: p.skus.map(mapSku),
      company: {
        id: p.company.id,
        display_name: p.company.displayName,
        status: p.company.status,
        licence_expiry: toIsoDate(p.company.licenceExpiry),
        licence_expired: isLicenceExpired(p.company.licenceExpiry),
        emirate: p.company.emirate as 'DUBAI',
      },
      storefront: storefront
        ? { id: storefront.id, status: storefront.status, business_type: storefront.businessType }
        : null,
      category_requirements_en: v.category.requirementsEn,
      category_requirements_ar: v.category.requirementsAr,
      history: history.map((e) => mapEvent(e, vn)),
    };
  }

  async decide(
    admin: User,
    versionId: string,
    body: z.infer<typeof catalogDecisionRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(versionId);
    await this.prisma.$transaction(async (tx) => {
      const pre = await tx.productVersion.findUnique({ where: { id: versionId } });
      if (!pre) throw new ApiError('NOT_FOUND', 'common.not_found');
      await lockProduct(tx, pre.productId);
      const v = await tx.productVersion.findUniqueOrThrow({ where: { id: versionId } });
      if (v.state !== body.expected_state) throw new ApiError('CONFLICT', 'common.stale_version');
      if (v.state !== 'PENDING_REVIEW')
        throw new ApiError('CONFLICT', 'catalog.invalid_transition');
      const p = await tx.product.findUniqueOrThrow({
        where: { id: v.productId },
        include: { workspace: true, company: true },
      });
      if (p.workingVersionId !== v.id) throw new ApiError('CONFLICT', 'catalog.invalid_transition');
      const now = new Date();
      if (body.decision === 'APPROVED') {
        const elig = sellerEligibility(p.workspace, p.company);
        if (!elig.eligible)
          throw new ApiError('CONFLICT', elig.reason ?? 'catalog.seller_not_eligible');
        const cat = await tx.category.findUniqueOrThrow({
          where: { id: v.categoryId },
          include: { parent: true },
        });
        if (
          cat.restriction === 'BLOCKED' ||
          cat.archivedAt ||
          cat.parent?.restriction === 'BLOCKED'
        )
          throw new ApiError('CONFLICT', 'catalog.category_unavailable');
        if (p.publishedVersionId) {
          await tx.productVersion.update({
            where: { id: p.publishedVersionId },
            data: { state: 'SUPERSEDED' },
          });
        }
        await tx.productVersion.update({
          where: { id: v.id },
          data: {
            state: 'APPROVED',
            decidedAt: now,
            decidedById: admin.id,
            decisionReason: body.reason ?? null,
          },
        });
        const first = p.publishedVersionId === null;
        await tx.product.update({
          where: { id: p.id },
          data: {
            publishedVersionId: v.id,
            workingVersionId: null,
            ...(p.status === 'DRAFT' ? { status: 'PUBLISHED', publishedAt: now } : {}),
            ...(first ? { firstPublishedAt: now } : {}),
            statusReason: null,
            version: { increment: 1 },
          },
        });
        await tx.sku.updateMany({
          where: { productId: p.id, approvedAt: null },
          data: { approvedAt: now },
        });
        await refreshListingStats(tx, p.id);
      } else {
        await tx.productVersion.update({
          where: { id: v.id },
          data: {
            state: body.decision,
            decidedAt: now,
            decidedById: admin.id,
            decisionReason: body.reason ?? null,
          },
        });
        await tx.product.update({ where: { id: p.id }, data: { version: { increment: 1 } } });
      }
      await moderationEvent(tx, {
        productId: p.id,
        productVersionId: v.id,
        actorId: admin.id,
        actorType: 'admin',
        action: `review.${body.decision.toLowerCase()}`,
        fromState: 'PENDING_REVIEW',
        toState: body.decision,
        reason: body.reason ?? null,
      });
      await this.audit(
        tx,
        admin,
        `catalog.review_${body.decision.toLowerCase()}`,
        'product_version',
        v.id,
        p.companyId,
        meta,
        {
          product_id: p.id,
          version: v.version,
          reason: body.reason ?? null,
        },
      );
      const recipient = await tx.user.findUnique({
        where: { id: v.submittedById ?? v.createdById },
      });
      if (recipient)
        await enqueueEmail(tx, {
          template: 'catalog_decision',
          to: recipient.email,
          locale: recipient.locale,
          vars: {
            product: v.titleEn,
            decision: body.decision,
            reason: body.reason ?? '',
            company: p.company.displayName,
          },
        });
    });
    return this.review(versionId);
  }

  // ------------------------------------------------------------------ products (enforcement)

  async products(q: z.infer<typeof adminProductsQuery>) {
    const cursor = decodeCursor(q.cursor);
    const rows = await this.prisma.product.findMany({
      where: {
        ...(q.status ? { status: q.status } : {}),
        ...(q.company_id ? { companyId: q.company_id } : {}),
        ...(q.q
          ? {
              OR: [
                { workingVersion: { titleEn: { contains: q.q, mode: 'insensitive' } } },
                { publishedVersion: { titleEn: { contains: q.q, mode: 'insensitive' } } },
                { publishedVersion: { titleAr: { contains: q.q } } },
                { company: { displayName: { contains: q.q, mode: 'insensitive' } } },
                { skus: { some: { code: { contains: q.q, mode: 'insensitive' } } } },
              ],
            }
          : {}),
        ...beforeCursor(cursor),
      },
      include: {
        company: true,
        publishedVersion: { include: { category: true } },
        workingVersion: { include: { category: true } },
      },
      orderBy: NEWEST_FIRST,
      take: q.limit + 1,
    });
    const { items, nextCursor } = page(rows, q.limit);
    const ids = items.map((p) => p.id);
    const pub = ids.length
      ? await this.prisma.$queryRaw<{ id: string }[]>`
          SELECT id FROM marketplace_products WHERE id IN (${Prisma.join(ids.map((i) => Prisma.sql`${i}::uuid`))})`
      : [];
    const pubSet = new Set(pub.map((r) => r.id));
    return {
      data: items.map((p) => {
        const v = p.publishedVersion ?? p.workingVersion;
        return {
          id: p.id,
          status: p.status,
          title_en: v?.titleEn ?? '',
          title_ar: v?.titleAr ?? null,
          company: { id: p.company.id, display_name: p.company.displayName },
          category_name_en: v?.category.nameEn ?? '',
          public: pubSet.has(p.id),
          working_state: p.workingVersion?.state ?? null,
          updated_at: p.updatedAt.toISOString(),
        };
      }),
      meta: { next_cursor: nextCursor },
    };
  }

  async product(id: string) {
    assertUuid(id);
    const p = (await this.prisma.product.findUnique({
      where: { id },
      include: { ...PRODUCT_INCLUDE, company: true },
    })) as
      | (ProductWithRefs & { company: { id: string; displayName: string; status: string } })
      | null;
    if (!p) throw new ApiError('NOT_FOUND', 'common.not_found');
    const [history, versions, isPublic, dims] = await Promise.all([
      this.prisma.moderationEvent.findMany({
        where: { productId: id },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 50,
      }),
      this.prisma.productVersion.findMany({
        where: { productId: id },
        select: { id: true, version: true },
      }),
      isPublicProduct(this.prisma as unknown as Tx, id),
      this.dims([p.publishedVersion, p.workingVersion]),
    ]);
    return {
      ...baseProductDetail(
        p,
        ADMIN,
        history,
        isPublic,
        new Map(versions.map((v) => [v.id, v.version])),
        dims,
      ),
      company: { id: p.company.id, display_name: p.company.displayName, status: p.company.status },
      actions: {
        suspend: ['PUBLISHED', 'UNPUBLISHED', 'DRAFT', 'ARCHIVED'].includes(p.status),
        restore: p.status === 'SUSPENDED',
        remove: p.status !== 'REMOVED',
      },
    };
  }

  async enforce(
    admin: User,
    id: string,
    action: 'suspend' | 'restore' | 'remove',
    reason: string,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      const exists = await tx.product.findUnique({ where: { id }, select: { id: true } });
      if (!exists) throw new ApiError('NOT_FOUND', 'common.not_found');
      await lockProduct(tx, id);
      const p = await tx.product.findUniqueOrThrow({ where: { id }, include: { company: true } });
      let data: Prisma.ProductUpdateInput;
      if (action === 'suspend') {
        if (p.status === 'SUSPENDED' || p.status === 'REMOVED')
          throw new ApiError('CONFLICT', 'catalog.invalid_transition');
        data = { status: 'SUSPENDED', statusBeforeSuspension: p.status, statusReason: reason };
      } else if (action === 'restore') {
        if (p.status !== 'SUSPENDED') throw new ApiError('CONFLICT', 'catalog.invalid_transition');
        data = {
          status: p.statusBeforeSuspension ?? 'UNPUBLISHED',
          statusBeforeSuspension: null,
          statusReason: null,
        };
      } else {
        if (p.status === 'REMOVED') throw new ApiError('CONFLICT', 'catalog.invalid_transition');
        data = { status: 'REMOVED', statusReason: reason };
      }
      await tx.product.update({ where: { id }, data: { ...data, version: { increment: 1 } } });
      const to = (data.status as string) ?? p.status;
      await moderationEvent(tx, {
        productId: id,
        actorId: admin.id,
        actorType: 'admin',
        action,
        fromState: p.status,
        toState: to,
        reason,
      });
      await this.audit(
        tx,
        admin,
        `catalog.product_${action === 'suspend' ? 'suspended' : action === 'restore' ? 'restored' : 'removed'}`,
        'product',
        id,
        p.companyId,
        meta,
        {
          from: p.status,
          to,
          reason,
        },
      );
      const creator = await tx.user.findUnique({ where: { id: p.createdById } });
      const v = await tx.productVersion.findFirst({
        where: {
          id: { in: [p.publishedVersionId, p.workingVersionId].filter((x): x is string => !!x) },
        },
      });
      if (creator)
        await enqueueEmail(tx, {
          template: 'listing_enforcement',
          to: creator.email,
          locale: creator.locale,
          vars: { product: v?.titleEn ?? '', action, reason, company: p.company.displayName },
        });
    });
    return this.product(id);
  }

  // ------------------------------------------------------------------ storefronts

  async storefronts(q: z.infer<typeof adminStorefrontsQuery>) {
    const cursor = decodeCursor(q.cursor);
    const rows = await this.prisma.storefront.findMany({
      where: {
        ...(q.hidden === true
          ? { adminHiddenAt: { not: null } }
          : q.hidden === false
            ? { adminHiddenAt: null }
            : {}),
        ...(q.q
          ? { workspace: { company: { displayName: { contains: q.q, mode: 'insensitive' } } } }
          : {}),
        ...beforeCursor(cursor),
      },
      include: { workspace: { include: { company: true } } },
      orderBy: NEWEST_FIRST,
      take: q.limit + 1,
    });
    const { items, nextCursor } = page(rows, q.limit);
    const ids = items.map((s) => s.id);
    const [pub, counts] = ids.length
      ? await Promise.all([
          this.prisma.$queryRaw<{ id: string }[]>`
            SELECT id FROM marketplace_suppliers WHERE id IN (${Prisma.join(ids.map((i) => Prisma.sql`${i}::uuid`))})`,
          this.prisma.product.groupBy({
            by: ['sellerWorkspaceId'],
            where: {
              sellerWorkspaceId: { in: items.map((s) => s.sellerWorkspaceId) },
              status: 'PUBLISHED',
            },
            _count: { _all: true },
          }),
        ])
      : [[], []];
    const pubSet = new Set(pub.map((r) => r.id));
    const countBy = new Map(counts.map((c) => [c.sellerWorkspaceId, c._count._all]));
    return {
      data: items.map((s) => ({
        id: s.id,
        company: {
          id: s.workspace.company.id,
          display_name: s.workspace.company.displayName,
          status: s.workspace.company.status,
        },
        status: s.status,
        business_type: s.businessType,
        public: pubSet.has(s.id),
        admin_hidden: s.adminHiddenAt !== null,
        admin_hidden_reason: s.adminHiddenReason,
        product_count: countBy.get(s.sellerWorkspaceId) ?? 0,
        updated_at: s.updatedAt.toISOString(),
      })),
      meta: { next_cursor: nextCursor },
    };
  }

  async storefront(id: string) {
    assertUuid(id);
    const s = await this.prisma.storefront.findUnique({
      where: { id },
      include: { media: true, workspace: { include: { company: true } } },
    });
    if (!s) throw new ApiError('NOT_FOUND', 'common.not_found');
    const pub = await this.prisma.$queryRaw<
      { n: number }[]
    >`SELECT count(*)::int AS n FROM marketplace_suppliers WHERE id = ${id}::uuid`;
    return mapStorefront(s, s.workspace.company.displayName, ADMIN, (pub[0]?.n ?? 0) > 0);
  }

  async storefrontEnforce(
    admin: User,
    id: string,
    action: 'hide' | 'restore',
    reason: string,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      const s = await tx.storefront.findUnique({
        where: { id },
        include: { workspace: { include: { company: true } } },
      });
      if (!s) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (action === 'hide' && s.adminHiddenAt)
        throw new ApiError('CONFLICT', 'catalog.invalid_transition');
      if (action === 'restore' && !s.adminHiddenAt)
        throw new ApiError('CONFLICT', 'catalog.invalid_transition');
      await tx.storefront.update({
        where: { id },
        data:
          action === 'hide'
            ? { adminHiddenAt: new Date(), adminHiddenReason: reason, version: { increment: 1 } }
            : { adminHiddenAt: null, adminHiddenReason: null, version: { increment: 1 } },
      });
      await moderationEvent(tx, {
        storefrontId: id,
        actorId: admin.id,
        actorType: 'admin',
        action: action === 'hide' ? 'storefront.hide' : 'storefront.restore',
        reason,
      });
      await this.audit(
        tx,
        admin,
        action === 'hide' ? 'storefront.hidden' : 'storefront.restored',
        'storefront',
        id,
        s.companyId,
        meta,
        { reason },
      );
      await enqueueEmail(tx, {
        template: 'storefront_enforcement',
        to: s.workspace.company.contactEmail,
        locale: 'en',
        vars: { company: s.workspace.company.displayName, action, reason },
      });
    });
    return this.storefront(id);
  }

  // ------------------------------------------------------------------ categories

  private async categoryItems(where: Prisma.CategoryWhereInput) {
    const cats = await this.prisma.category.findMany({
      where,
      include: { _count: { select: { attributes: true } } },
      orderBy: [{ position: 'asc' }, { nameEn: 'asc' }],
    });
    const counts = await this.prisma.$queryRaw<{ category_id: string; n: number }[]>`
      SELECT v.category_id, count(*)::int AS n FROM products p
        JOIN product_versions v ON v.id = COALESCE(p.published_version_id, p.working_version_id)
       WHERE p.status <> 'REMOVED' GROUP BY 1`;
    const pubCounts = await this.prisma.$queryRaw<
      { category_id: string; parent_category_id: string | null; n: number }[]
    >`
      SELECT category_id, parent_category_id, count(*)::int AS n FROM marketplace_products GROUP BY 1, 2`;
    const listing = new Map(counts.map((c) => [c.category_id, c.n]));
    const pub = new Map<string, number>();
    for (const r of pubCounts) {
      pub.set(r.category_id, (pub.get(r.category_id) ?? 0) + r.n);
      if (r.parent_category_id)
        pub.set(r.parent_category_id, (pub.get(r.parent_category_id) ?? 0) + r.n);
    }
    return cats.map((c) => ({
      id: c.id,
      parent_id: c.parentId,
      slug: c.slug,
      name_en: c.nameEn,
      name_ar: c.nameAr,
      description_en: c.descriptionEn,
      description_ar: c.descriptionAr,
      image_url: c.imageFileId ? mediaUrl(ADMIN, c.imageFileId) : null,
      priority: c.priority,
      restriction: c.restriction,
      requirements_en: c.requirementsEn,
      requirements_ar: c.requirementsAr,
      position: c.position,
      product_count: pub.get(c.id) ?? 0,
      visible: c.visible,
      archived_at: c.archivedAt?.toISOString() ?? null,
      version: c.version,
      listing_count: listing.get(c.id) ?? 0,
      attribute_count: c._count.attributes,
    }));
  }

  async categories() {
    return this.categoryItems({});
  }

  async category(id: string) {
    assertUuid(id);
    const c = await this.prisma.category.findUnique({ where: { id }, include: { parent: true } });
    if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
    const [self] = await this.categoryItems({ id });
    const children = await this.categoryItems({ parentId: id });
    const attrs = await this.prisma.categoryAttribute.findMany({
      where: { categoryId: id },
      orderBy: [{ position: 'asc' }, { key: 'asc' }],
    });
    return {
      ...self!,
      parent: c.parent
        ? { id: c.parent.id, name_en: c.parent.nameEn, name_ar: c.parent.nameAr }
        : null,
      children,
      attributes: attrs.map((a) => this.attr(a)),
    };
  }

  private attr(a: Prisma.CategoryAttributeGetPayload<object>) {
    return {
      id: a.id,
      category_id: a.categoryId,
      key: a.key,
      label_en: a.labelEn,
      label_ar: a.labelAr,
      type: a.type,
      options: Array.isArray(a.options)
        ? (a.options as { value: string; label_en: string; label_ar: string }[])
        : [],
      unit: a.unit,
      required: a.required,
      filterable: a.filterable,
      position: a.position,
      active: a.active,
    };
  }

  async createCategory(
    admin: User,
    body: z.infer<typeof categoryCreateRequest>,
    meta: RequestMeta,
  ) {
    let id = '';
    try {
      await this.prisma.$transaction(async (tx) => {
        if (body.parent_id) {
          const parent = await tx.category.findUnique({ where: { id: body.parent_id } });
          if (!parent || parent.parentId || parent.archivedAt)
            throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
              parent_id: 'invalid',
            });
        }
        const c = await tx.category.create({
          data: {
            parentId: body.parent_id ?? null,
            slug: body.slug,
            nameEn: body.name_en,
            nameAr: body.name_ar,
            descriptionEn: body.description_en,
            descriptionAr: body.description_ar,
            position: body.position,
            visible: body.visible,
            priority: body.priority,
            restriction: body.restriction,
            requirementsEn: body.requirements_en,
            requirementsAr: body.requirements_ar,
          },
        });
        id = c.id;
        await this.audit(tx, admin, 'category.created', 'category', c.id, null, meta, {
          slug: body.slug,
          reason: body.reason,
        });
      });
    } catch (e) {
      if (isUniqueViolation(e))
        throw new ApiError('CONFLICT', 'catalog.slug_taken', { slug: 'taken' });
      throw e;
    }
    return this.category(id);
  }

  async updateCategory(
    admin: User,
    id: string,
    body: z.infer<typeof categoryUpdateRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      const c = await tx.category.findUnique({ where: { id } });
      if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
      const sensitive = body.restriction !== undefined && body.restriction !== c.restriction;
      const hiding =
        (body.visible === false && c.visible) || (body.archived === true && !c.archivedAt);
      if ((sensitive || hiding) && (!body.reason || body.reason.length < 5))
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
          reason: 'reason_required',
        });
      const data: Prisma.CategoryUpdateManyMutationInput = {
        ...(body.name_en !== undefined ? { nameEn: body.name_en } : {}),
        ...(body.name_ar !== undefined ? { nameAr: body.name_ar } : {}),
        ...(body.description_en !== undefined ? { descriptionEn: body.description_en } : {}),
        ...(body.description_ar !== undefined ? { descriptionAr: body.description_ar } : {}),
        ...(body.position !== undefined ? { position: body.position } : {}),
        ...(body.visible !== undefined ? { visible: body.visible } : {}),
        ...(body.priority !== undefined ? { priority: body.priority } : {}),
        ...(body.restriction !== undefined ? { restriction: body.restriction } : {}),
        ...(body.requirements_en !== undefined ? { requirementsEn: body.requirements_en } : {}),
        ...(body.requirements_ar !== undefined ? { requirementsAr: body.requirements_ar } : {}),
        ...(body.archived !== undefined
          ? { archivedAt: body.archived ? (c.archivedAt ?? new Date()) : null }
          : {}),
        version: { increment: 1 },
      };
      const r = await tx.category.updateMany({
        where: { id, version: body.expected_version },
        data,
      });
      if (r.count === 0) throw new ApiError('CONFLICT', 'common.stale_version');
      const { expected_version: _ev, reason, ...changes } = body;
      void _ev;
      await this.audit(tx, admin, 'category.updated', 'category', id, null, meta, {
        changes,
        reason: reason ?? null,
      });
    });
    return this.category(id);
  }

  async setCategoryImage(
    admin: User,
    id: string,
    file: UploadedFile | undefined,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    const c = await this.prisma.category.findUnique({ where: { id } });
    if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
    const { fileId } = await this.media.ingestImage(
      { file, userId: admin.id, companyId: null, purpose: 'CATEGORY_IMAGE' },
      (data) => this.prisma.file.create({ data, select: { id: true } }),
    );
    await this.prisma.$transaction(async (tx) => {
      await tx.category.update({
        where: { id },
        data: { imageFileId: fileId, version: { increment: 1 } },
      });
      await this.audit(tx, admin, 'category.image_set', 'category', id, null, meta, {
        file_id: fileId,
      });
    });
    return this.category(id);
  }

  async createAttribute(
    admin: User,
    categoryId: string,
    body: z.infer<typeof attributeCreateRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(categoryId);
    const c = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
    try {
      await this.prisma.$transaction(async (tx) => {
        const a = await tx.categoryAttribute.create({
          data: {
            categoryId,
            key: body.key,
            labelEn: body.label_en,
            labelAr: body.label_ar,
            type: body.type,
            options: body.options,
            unit: body.unit,
            required: body.required,
            filterable: body.filterable,
            position: body.position,
          },
        });
        await this.audit(
          tx,
          admin,
          'category.attribute_created',
          'category_attribute',
          a.id,
          null,
          meta,
          { category_id: categoryId, key: body.key },
        );
      });
    } catch (e) {
      if (isUniqueViolation(e))
        throw new ApiError('CONFLICT', 'catalog.attribute_exists', { key: 'taken' });
      throw e;
    }
    return this.category(categoryId);
  }

  async updateAttribute(
    admin: User,
    id: string,
    body: z.infer<typeof attributeUpdateRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    const a = await this.prisma.categoryAttribute.findUnique({ where: { id } });
    if (!a) throw new ApiError('NOT_FOUND', 'common.not_found');
    if (body.options && a.type !== 'SELECT')
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
        options: 'select_only',
      });
    await this.prisma.$transaction(async (tx) => {
      await tx.categoryAttribute.update({
        where: { id },
        data: {
          ...(body.label_en !== undefined ? { labelEn: body.label_en } : {}),
          ...(body.label_ar !== undefined ? { labelAr: body.label_ar } : {}),
          ...(body.options !== undefined ? { options: body.options } : {}),
          ...(body.unit !== undefined ? { unit: body.unit } : {}),
          ...(body.required !== undefined ? { required: body.required } : {}),
          ...(body.filterable !== undefined ? { filterable: body.filterable } : {}),
          ...(body.position !== undefined ? { position: body.position } : {}),
          ...(body.active !== undefined ? { active: body.active } : {}),
        },
      });
      await this.audit(
        tx,
        admin,
        'category.attribute_updated',
        'category_attribute',
        id,
        null,
        meta,
        { changes: body },
      );
    });
    return this.category(a.categoryId);
  }

  // ------------------------------------------------------------------ restricted terms

  async restrictedTerms() {
    const rows = await this.prisma.restrictedTerm.findMany({
      orderBy: [{ active: 'desc' }, { term: 'asc' }],
    });
    const catIds = rows.map((r) => r.categoryId).filter((x): x is string => !!x);
    const cats = new Map(
      (catIds.length
        ? await this.prisma.category.findMany({ where: { id: { in: catIds } } })
        : []
      ).map((c) => [c.id, c]),
    );
    return rows.map((r) => {
      const c = r.categoryId ? cats.get(r.categoryId) : undefined;
      return {
        id: r.id,
        term: r.term,
        action: r.action,
        category: c ? { id: c.id, name_en: c.nameEn, name_ar: c.nameAr } : null,
        note: r.note,
        active: r.active,
        created_at: r.createdAt.toISOString(),
      };
    });
  }

  async createRestrictedTerm(
    admin: User,
    body: z.infer<typeof restrictedTermCreateRequest>,
    meta: RequestMeta,
  ) {
    if (body.category_id) {
      const c = await this.prisma.category.findUnique({ where: { id: body.category_id } });
      if (!c)
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
          category_id: 'invalid',
        });
    }
    await this.prisma.$transaction(async (tx) => {
      const n = await tx.$queryRaw<{ v: string }[]>`SELECT mkt_normalize(${body.term}) AS v`;
      const normalized = n[0]?.v ?? '';
      if (normalized.length < 2)
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', { term: 'min' });
      const t = await tx.restrictedTerm.create({
        data: {
          term: body.term,
          normalized,
          action: body.action,
          categoryId: body.category_id ?? null,
          note: body.note,
          createdById: admin.id,
        },
      });
      await this.audit(tx, admin, 'restricted_term.created', 'restricted_term', t.id, null, meta, {
        term: body.term,
        action: body.action,
      });
    });
    return this.restrictedTerms();
  }

  async updateRestrictedTerm(
    admin: User,
    id: string,
    body: z.infer<typeof restrictedTermUpdateRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    const t = await this.prisma.restrictedTerm.findUnique({ where: { id } });
    if (!t) throw new ApiError('NOT_FOUND', 'common.not_found');
    await this.prisma.$transaction(async (tx) => {
      await tx.restrictedTerm.update({
        where: { id },
        data: {
          ...(body.action !== undefined ? { action: body.action } : {}),
          ...(body.note !== undefined ? { note: body.note } : {}),
          ...(body.active !== undefined ? { active: body.active } : {}),
        },
      });
      await this.audit(tx, admin, 'restricted_term.updated', 'restricted_term', id, null, meta, {
        before: { action: t.action, active: t.active },
        changes: body,
      });
    });
    return this.restrictedTerms();
  }

  // ------------------------------------------------------------------ featured

  async featured() {
    const rows = await this.prisma.featuredListing.findMany({
      where: { removedAt: null },
      orderBy: [{ kind: 'asc' }, { position: 'asc' }, { createdAt: 'asc' }],
    });
    const pIds = rows.filter((r) => r.productId).map((r) => r.productId!);
    const sIds = rows.filter((r) => r.storefrontId).map((r) => r.storefrontId!);
    const [pubP, pubS, products, sfs] = await Promise.all([
      pIds.length
        ? this.prisma.$queryRaw<
            { id: string }[]
          >`SELECT id FROM marketplace_products WHERE id IN (${Prisma.join(pIds.map((i) => Prisma.sql`${i}::uuid`))})`
        : [],
      sIds.length
        ? this.prisma.$queryRaw<
            { id: string }[]
          >`SELECT id FROM marketplace_suppliers WHERE id IN (${Prisma.join(sIds.map((i) => Prisma.sql`${i}::uuid`))})`
        : [],
      this.prisma.product.findMany({
        where: { id: { in: pIds } },
        include: { publishedVersion: true, workingVersion: true },
      }),
      this.prisma.storefront.findMany({
        where: { id: { in: sIds } },
        include: { workspace: { include: { company: true } } },
      }),
    ]);
    const pubSet = new Set([...pubP, ...pubS].map((r) => r.id));
    const titles = new Map<string, string>([
      ...products.map(
        (p) => [p.id, (p.publishedVersion ?? p.workingVersion)?.titleEn ?? ''] as [string, string],
      ),
      ...sfs.map((s) => [s.id, s.workspace.company.displayName] as [string, string]),
    ]);
    const now = Date.now();
    return rows.map((r) => {
      const target = (r.productId ?? r.storefrontId)!;
      return {
        id: r.id,
        kind: r.kind,
        target_id: target,
        title: titles.get(target) ?? '',
        position: r.position,
        starts_at: r.startsAt?.toISOString() ?? null,
        ends_at: r.endsAt?.toISOString() ?? null,
        reason: r.reason,
        eligible: pubSet.has(target),
        active_now:
          (!r.startsAt || r.startsAt.getTime() <= now) && (!r.endsAt || r.endsAt.getTime() > now),
        created_at: r.createdAt.toISOString(),
      };
    });
  }

  async addFeatured(admin: User, body: z.infer<typeof featuredCreateRequest>, meta: RequestMeta) {
    const view =
      body.kind === 'PRODUCT'
        ? Prisma.sql`marketplace_products`
        : Prisma.sql`marketplace_suppliers`;
    const r = await this.prisma.$queryRaw<
      { n: number }[]
    >`SELECT count(*)::int AS n FROM ${view} WHERE id = ${body.target_id}::uuid`;
    if ((r[0]?.n ?? 0) === 0)
      throw new ApiError('VALIDATION_FAILED', 'catalog.featured_not_public', {
        target_id: 'not_public',
      });
    await this.prisma.$transaction(async (tx) => {
      const dup = await tx.featuredListing.findFirst({
        where: {
          removedAt: null,
          ...(body.kind === 'PRODUCT'
            ? { productId: body.target_id }
            : { storefrontId: body.target_id }),
        },
      });
      if (dup) throw new ApiError('CONFLICT', 'catalog.already_featured');
      const f = await tx.featuredListing.create({
        data: {
          kind: body.kind,
          productId: body.kind === 'PRODUCT' ? body.target_id : null,
          storefrontId: body.kind === 'SUPPLIER' ? body.target_id : null,
          position: body.position,
          startsAt: body.starts_at ? new Date(body.starts_at) : null,
          endsAt: body.ends_at ? new Date(body.ends_at) : null,
          reason: body.reason,
          createdById: admin.id,
        },
      });
      await this.audit(tx, admin, 'featured.added', 'featured_listing', f.id, null, meta, {
        kind: body.kind,
        target_id: body.target_id,
        reason: body.reason,
      });
    });
    return this.featured();
  }

  async removeFeatured(admin: User, id: string, meta: RequestMeta) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      const f = await tx.featuredListing.findUnique({ where: { id } });
      if (!f || f.removedAt) throw new ApiError('NOT_FOUND', 'common.not_found');
      await tx.featuredListing.update({ where: { id }, data: { removedAt: new Date() } });
      await this.audit(tx, admin, 'featured.removed', 'featured_listing', id, null, meta);
    });
    return this.featured();
  }
}
