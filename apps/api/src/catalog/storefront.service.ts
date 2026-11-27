import { Inject, Injectable } from '@nestjs/common';
import type {
  StorefrontResponse,
  storefrontMediaFields,
  storefrontUpdateRequest,
} from '@app/contracts';
import { Prisma, writeAudit, type PrismaClient, type User } from '@app/db';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { PRISMA } from '../infra/tokens';
import { assertUuid, loadSellerContext, requireSeller, type SellerContext } from './access';
import { mapStorefront } from './mappers';
import { MediaService, type UploadedFile } from './media.service';

type Tx = Prisma.TransactionClient;
const MAX_GALLERY = 20;
const SINGLE_KINDS = new Set(['LOGO', 'COVER']);

const FIELD_MAP: Record<string, string> = {
  business_type: 'businessType',
  description_en: 'descriptionEn',
  description_ar: 'descriptionAr',
  year_established: 'yearEstablished',
  city: 'city',
  specialization_en: 'specializationEn',
  specialization_ar: 'specializationAr',
  capabilities_en: 'capabilitiesEn',
  capabilities_ar: 'capabilitiesAr',
  production_capacity: 'productionCapacity',
  customization_services: 'customizationServices',
  private_label: 'privateLabel',
  white_label: 'whiteLabel',
  samples_available: 'samplesAvailable',
  fulfilment_en: 'fulfilmentEn',
  fulfilment_ar: 'fulfilmentAr',
  certifications: 'certifications',
};

/**
 * Seller storefront (docs/03-seller.md). One per seller workspace. Publication is immediate for an
 * eligible seller (no pre-moderation; admins can hide it with a reason) - recorded as a deviation
 * awaiting founder confirmation in IMPLEMENTATION_STATUS. Visibility to buyers additionally
 * requires seller eligibility, enforced by the marketplace_suppliers view.
 */
@Injectable()
export class StorefrontService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly media: MediaService,
  ) {}

  private ctx(user: User, ws: string) {
    return loadSellerContext(this.prisma, user.id, ws);
  }

  private async ensure(tx: Tx, ctx: SellerContext) {
    const existing = await tx.storefront.findUnique({
      where: { sellerWorkspaceId: ctx.workspace.id },
    });
    if (existing) return existing;
    try {
      return await tx.storefront.create({
        data: { sellerWorkspaceId: ctx.workspace.id, companyId: ctx.company.id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        return tx.storefront.findUniqueOrThrow({ where: { sellerWorkspaceId: ctx.workspace.id } });
      throw e;
    }
  }

  private async view(ctx: SellerContext): Promise<StorefrontResponse> {
    const s = await this.prisma.storefront.findUnique({
      where: { sellerWorkspaceId: ctx.workspace.id },
      include: { media: true },
    });
    const scope = { kind: 'seller' as const, workspaceId: ctx.workspace.id };
    if (!s) {
      // Not yet created: return an honest empty draft (no row is written on read).
      return {
        id: '00000000-0000-0000-0000-000000000000',
        workspace_id: ctx.workspace.id,
        company_name: ctx.company.displayName,
        status: 'DRAFT',
        public: false,
        admin_hidden: false,
        admin_hidden_reason: null,
        business_type: null,
        description_en: null,
        description_ar: null,
        year_established: null,
        city: null,
        specialization_en: null,
        specialization_ar: null,
        capabilities_en: null,
        capabilities_ar: null,
        production_capacity: null,
        customization_services: false,
        private_label: false,
        white_label: false,
        samples_available: false,
        fulfilment_en: null,
        fulfilment_ar: null,
        certifications: [],
        media: [],
        version: 0,
        published_at: null,
      };
    }
    const pub = await this.prisma.$queryRaw<{ n: bigint }[]>`
      SELECT count(*)::bigint AS n FROM marketplace_suppliers WHERE id = ${s.id}::uuid`;
    return mapStorefront(s, ctx.company.displayName, scope, Number(pub[0]?.n ?? 0) > 0);
  }

  async get(user: User, ws: string) {
    const ctx = await this.ctx(user, ws);
    requireSeller(ctx, 'seller.catalog.read');
    return this.view(ctx);
  }

  async update(
    user: User,
    ws: string,
    body: z.infer<typeof storefrontUpdateRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireSeller(ctx, 'seller.catalog.edit');
    await this.prisma.$transaction(async (tx) => {
      const s = await this.ensure(tx, ctx);
      if (body.expected_version !== undefined && body.expected_version !== s.version)
        throw new ApiError('CONFLICT', 'common.stale_version');
      const data: Record<string, unknown> = {};
      const changed: string[] = [];
      for (const [k, v] of Object.entries(body)) {
        if (k === 'expected_version' || v === undefined) continue;
        const col = FIELD_MAP[k];
        if (!col) continue;
        data[col] = k === 'certifications' ? (v as Prisma.InputJsonValue) : v;
        changed.push(k);
      }
      const r = await tx.storefront.updateMany({
        where: { id: s.id, version: s.version },
        data: { ...(data as Prisma.StorefrontUpdateManyMutationInput), version: { increment: 1 } },
      });
      if (r.count === 0) throw new ApiError('CONFLICT', 'common.stale_version');
      await this.audit(tx, user, ctx, 'storefront.updated', s.id, meta, { fields: changed });
    });
    return this.view(ctx);
  }

  async publish(user: User, ws: string, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireSeller(ctx, 'seller.catalog.edit');
    await this.prisma.$transaction(async (tx) => {
      const s = await this.ensure(tx, ctx);
      const errors: Record<string, string> = {};
      if (!s.businessType) errors.business_type = 'required';
      if (!s.descriptionEn || s.descriptionEn.trim().length < 20)
        errors.description_en = 'min_description';
      if (!s.city) errors.city = 'required';
      if (Object.keys(errors).length)
        throw new ApiError('VALIDATION_FAILED', 'catalog.storefront_incomplete', errors);
      await tx.storefront.update({
        where: { id: s.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: s.publishedAt ?? new Date(),
          version: { increment: 1 },
        },
      });
      await tx.moderationEvent.create({
        data: {
          storefrontId: s.id,
          actorId: user.id,
          actorType: 'user',
          action: 'publish',
          fromState: s.status,
          toState: 'PUBLISHED',
        },
      });
      await this.audit(tx, user, ctx, 'storefront.published', s.id, meta);
    });
    return this.view(ctx);
  }

  async unpublish(user: User, ws: string, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    // Taking a storefront offline is never trading-gated: an ineligible seller can still hide it.
    requireSeller(ctx, 'seller.catalog.read');
    if (!['OWNER', 'SALES'].includes(ctx.membership.role))
      throw new ApiError('FORBIDDEN', 'common.forbidden');
    await this.prisma.$transaction(async (tx) => {
      const s = await tx.storefront.findUnique({ where: { sellerWorkspaceId: ctx.workspace.id } });
      if (!s || s.status !== 'PUBLISHED')
        throw new ApiError('CONFLICT', 'catalog.invalid_transition');
      await tx.storefront.update({
        where: { id: s.id },
        data: { status: 'DRAFT', version: { increment: 1 } },
      });
      await tx.moderationEvent.create({
        data: {
          storefrontId: s.id,
          actorId: user.id,
          actorType: 'user',
          action: 'unpublish',
          fromState: 'PUBLISHED',
          toState: 'DRAFT',
        },
      });
      await this.audit(tx, user, ctx, 'storefront.unpublished', s.id, meta);
    });
    return this.view(ctx);
  }

  async addMedia(
    user: User,
    ws: string,
    file: UploadedFile | undefined,
    fields: z.infer<typeof storefrontMediaFields>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireSeller(ctx, 'seller.catalog.edit');
    const { fileId } = await this.media.ingestImage(
      { file, userId: user.id, companyId: ctx.company.id, purpose: 'STOREFRONT_IMAGE' },
      (data) => this.prisma.file.create({ data, select: { id: true } }),
    );
    await this.prisma.$transaction(async (tx) => {
      const s = await this.ensure(tx, ctx);
      await tx.$queryRaw`SELECT id FROM storefronts WHERE id = ${s.id}::uuid FOR UPDATE`;
      if (SINGLE_KINDS.has(fields.kind)) {
        await tx.storefrontMedia.deleteMany({ where: { storefrontId: s.id, kind: fields.kind } });
      } else {
        const n = await tx.storefrontMedia.count({
          where: { storefrontId: s.id, kind: { notIn: ['LOGO', 'COVER'] } },
        });
        if (n >= MAX_GALLERY)
          throw new ApiError('CONFLICT', 'catalog.media_limit', { file: 'media_limit' });
      }
      const pos = await tx.storefrontMedia.count({
        where: { storefrontId: s.id, kind: fields.kind },
      });
      await tx.storefrontMedia.create({
        data: {
          storefrontId: s.id,
          fileId,
          kind: fields.kind,
          position: pos,
          captionEn: fields.caption_en ?? null,
          captionAr: fields.caption_ar ?? null,
        },
      });
      await tx.storefront.update({ where: { id: s.id }, data: { version: { increment: 1 } } });
      await this.audit(tx, user, ctx, 'storefront.media_added', s.id, meta, {
        file_id: fileId,
        kind: fields.kind,
      });
    });
    return this.view(ctx);
  }

  async removeMedia(user: User, ws: string, mediaId: string, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireSeller(ctx, 'seller.catalog.edit');
    assertUuid(mediaId);
    await this.prisma.$transaction(async (tx) => {
      const m = await tx.storefrontMedia.findFirst({
        where: { id: mediaId, storefront: { sellerWorkspaceId: ctx.workspace.id } },
      });
      if (!m) throw new ApiError('NOT_FOUND', 'common.not_found');
      await tx.storefrontMedia.delete({ where: { id: m.id } });
      await tx.storefront.update({
        where: { id: m.storefrontId },
        data: { version: { increment: 1 } },
      });
      await this.audit(tx, user, ctx, 'storefront.media_removed', m.storefrontId, meta, {
        file_id: m.fileId,
      });
    });
    return this.view(ctx);
  }

  private audit(
    tx: Tx,
    user: User,
    ctx: SellerContext,
    action: string,
    id: string,
    meta: RequestMeta,
    details?: Record<string, unknown>,
  ) {
    return writeAudit(tx, {
      actorId: user.id,
      actorType: 'user',
      action,
      resourceType: 'storefront',
      resourceId: id,
      companyId: ctx.company.id,
      details: details ?? null,
      requestId: meta.requestId,
      ip: meta.ip,
    });
  }
}
