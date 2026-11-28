import { Inject, Injectable } from '@nestjs/common';
import {
  RFQ_LIMITS,
  type inviteCandidateQuery,
  type quoteAcceptRequest,
  type quoteVersionActionRequest,
  type rfqCancelRequest,
  type rfqCreateRequest,
  type rfqListQuery,
  type rfqUpdateRequest,
} from '@app/contracts';
import type { AppEnv } from '@app/config';
import { Prisma, todayUtc, writeAudit, type PrismaClient, type User } from '@app/db';
import type { z } from 'zod';
import { decodeOffset, encodeOffset, likeEscape } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { APP_ENV, PRISMA } from '../infra/tokens';
import {
  BUYER_ACTING_ROLES,
  SELLER_ACTING_ROLES,
  can,
  loadWorkspaceContext,
  requireCap,
  type WorkspaceContext,
} from './access';
import { AttachmentService, type Upload } from './attachments';
import { CommerceConfig } from '../commerce/commerce-common';
import { createQuoteCheckout } from '../commerce/checkout.service';
import { notify, workspaceRecipients } from './notify';
import {
  QUOTE_INCLUDE,
  RFQ_INCLUDE,
  dateOnly,
  isPublicSeller,
  lockRfq,
  mapEvent,
  mapFile,
  mapQuote,
  mapSummary,
  nextRfqNumber,
  poolSellerWorkspaces,
  rfqEvent,
  sellerParty,
  type RfqFull,
} from './rfq-common';

const PAGE = 20;
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
type CreateBody = z.infer<typeof rfqCreateRequest>;

/**
 * Buyer side of RFQs (docs/02-buyer.md): drafts, publish, cancel, attachments, quote comparison
 * and the single award (T21, T22). Only approved trading buyer workspaces may request quotations
 * (A12); every route re-resolves the caller's membership (404 for other tenants).
 */
@Injectable()
export class RfqService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly attachments: AttachmentService,
    private readonly commerce: CommerceConfig,
  ) {}

  private ctx(user: User, ws: string) {
    return loadWorkspaceContext(this.prisma, user.id, ws, 'BUYER');
  }

  private async own(ctx: WorkspaceContext, id: string): Promise<RfqFull> {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const r = await this.prisma.rfq.findFirst({
      where: { id, buyerWorkspaceId: ctx.workspace.id },
      include: RFQ_INCLUDE,
    });
    if (!r) throw new ApiError('NOT_FOUND', 'common.not_found');
    return r;
  }

  // ---------------------------------------------------------------- validation

  private async validateCategory(categoryId: string) {
    const c = await this.prisma.category.findFirst({
      where: { id: categoryId, visible: true, archivedAt: null, restriction: { not: 'BLOCKED' } },
      include: { parent: true },
    });
    if (
      !c ||
      (c.parent && (!c.parent.visible || c.parent.archivedAt || c.parent.restriction === 'BLOCKED'))
    )
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
        category_id: 'invalid',
      });
  }

  private validateDates(b: { deadline: string; target_date: string }, now = new Date()) {
    const errs: Record<string, string> = {};
    const deadline = new Date(b.deadline);
    const target = dateOnly(b.target_date);
    if (deadline.getTime() < now.getTime() + RFQ_LIMITS.minDeadlineMinutes * MINUTE)
      errs.deadline = 'future';
    else if (deadline.getTime() > now.getTime() + RFQ_LIMITS.maxDeadlineDays * DAY)
      errs.deadline = 'max';
    if (target.getTime() <= todayUtc(now).getTime()) errs.target_date = 'future';
    else if (dateOnly(b.deadline.slice(0, 10)).getTime() > target.getTime())
      errs.target_date = 'after_deadline';
    if (Object.keys(errs).length)
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', errs);
  }

  /** Map storefront ids to eligible seller workspaces (public, other company). */
  private async resolveInvitees(ctx: WorkspaceContext, storefrontIds: string[]) {
    const ids = [...new Set(storefrontIds)];
    if (ids.length === 0) return [];
    const rows = await this.prisma.$queryRaw<
      { id: string; seller_workspace_id: string; company_id: string }[]
    >`
      SELECT id, seller_workspace_id, company_id FROM marketplace_suppliers
       WHERE id = ANY(${ids}::uuid[])`;
    if (rows.length !== ids.length || rows.some((r) => r.company_id === ctx.company.id))
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
        invitee_storefront_ids: 'invalid',
      });
    return rows.map((r) => r.seller_workspace_id);
  }

  // ---------------------------------------------------------------- reads

  async list(user: User, ws: string, q: z.infer<typeof rfqListQuery>) {
    const ctx = await this.ctx(user, ws);
    const offset = decodeOffset(q.cursor);
    const rows = await this.prisma.rfq.findMany({
      where: { buyerWorkspaceId: ctx.workspace.id, ...(q.state ? { state: q.state } : {}) },
      include: { category: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const counts = await this.quoteCounts(rows.map((r) => r.id));
    return {
      items: rows.slice(0, PAGE).map((r) => mapSummary(r, counts.get(r.id) ?? 0)),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  private async quoteCounts(ids: string[]) {
    if (ids.length === 0) return new Map<string, number>();
    const g = await this.prisma.quote.groupBy({
      by: ['rfqId'],
      where: { rfqId: { in: ids }, state: { not: 'DRAFT' } },
      _count: { _all: true },
    });
    return new Map(g.map((x) => [x.rfqId, x._count._all]));
  }

  async detail(user: User, ws: string, id: string) {
    const ctx = await this.ctx(user, ws);
    return this.view(ctx, await this.own(ctx, id));
  }

  private async view(ctx: WorkspaceContext, r: RfqFull) {
    const [quotes, events] = await Promise.all([
      this.prisma.quote.findMany({
        where: { rfqId: r.id, state: { not: 'DRAFT' } },
        include: QUOTE_INCLUDE,
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.rfqEvent.findMany({
        where: { rfqId: r.id },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      }),
    ]);
    const purchase = can(ctx, 'buyer.purchase');
    const checkout = await this.prisma.checkout.findUnique({
      where: { rfqId: r.id },
      include: { orders: { select: { id: true, state: true } } },
    });
    return {
      award_order:
        checkout && checkout.orders[0]
          ? {
              checkout_id: checkout.id,
              order_id: checkout.orders[0].id,
              checkout_state: checkout.state,
              order_state: checkout.orders[0].state,
            }
          : null,
      ...mapSummary(r, quotes.length),
      version: r.version,
      specs: r.specs,
      budget_fils: r.budgetFils?.toString() ?? null,
      cancel_reason: r.cancelReason,
      awarded_at: r.awardedAt?.toISOString() ?? null,
      accepted_quote_version_id: r.acceptedQuoteVersionId,
      payment_due_at: r.paymentDueAt?.toISOString() ?? null,
      admin_hidden: !!r.adminHiddenAt,
      buyer: {
        workspace_id: r.buyerWorkspaceId,
        company_name: r.buyerWorkspace.company.displayName,
        emirate: r.buyerWorkspace.company.emirate,
      },
      invitees: r.invites.map((i) => sellerParty(i.sellerWorkspace)),
      files: r.files.map((f) => mapFile(f.file)),
      events: events.map(mapEvent),
      quotes: quotes.map((q) => mapQuote(q, events)),
      can: {
        edit: purchase && r.state === 'DRAFT',
        publish: purchase && r.state === 'DRAFT' && !r.adminHiddenAt,
        cancel: purchase && (r.state === 'DRAFT' || r.state === 'OPEN'),
        quote: false,
        message: can(ctx, 'messaging') && r.state !== 'DRAFT',
      },
      quote_blocked_reason: null,
    };
  }

  /** Public storefronts of trading-eligible sellers the buyer may invite. */
  async inviteCandidates(user: User, ws: string, q: z.infer<typeof inviteCandidateQuery>) {
    const ctx = await this.ctx(user, ws);
    const term = q.q ? `%${likeEscape(q.q.toLowerCase())}%` : null;
    const rows = await this.prisma.$queryRaw<
      {
        id: string;
        seller_workspace_id: string;
        company_name: string;
        emirate: string;
        business_type: string | null;
      }[]
    >`
      SELECT s.id, s.seller_workspace_id, s.company_name, s.emirate::text AS emirate, s.business_type::text AS business_type
        FROM marketplace_suppliers s
       WHERE s.company_id <> ${ctx.company.id}::uuid
         AND (${term}::text IS NULL OR s.company_search LIKE mkt_normalize(${term}::text))
         AND (${q.category_id ?? null}::uuid IS NULL OR EXISTS (
               SELECT 1 FROM marketplace_products mp JOIN categories rc ON rc.id = ${q.category_id ?? null}::uuid
                WHERE mp.seller_workspace_id = s.seller_workspace_id
                  AND COALESCE(mp.parent_category_id, mp.category_id) = COALESCE(rc.parent_id, rc.id)))
       ORDER BY s.company_name ASC, s.id ASC
       LIMIT 50`;
    return rows.map((r) => ({
      workspace_id: r.seller_workspace_id,
      storefront_id: r.id,
      company_name: r.company_name,
      emirate: r.emirate,
      business_type: r.business_type,
    }));
  }

  // ---------------------------------------------------------------- writes

  async create(user: User, ws: string, b: CreateBody, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'buyer.purchase');
    await this.validateCategory(b.category_id);
    this.validateDates(b);
    const sellers = await this.resolveInvitees(ctx, b.invitee_storefront_ids);
    const open = await this.prisma.rfq.count({
      where: { buyerWorkspaceId: ctx.workspace.id, state: { in: ['DRAFT', 'OPEN'] } },
    });
    if (open >= RFQ_LIMITS.maxOpenPerWorkspace) throw new ApiError('CONFLICT', 'rfq.open_limit');
    const id = await this.prisma.$transaction(async (tx) => {
      const r = await tx.rfq.create({
        data: {
          number: await nextRfqNumber(tx),
          buyerWorkspaceId: ctx.workspace.id,
          buyerCompanyId: ctx.company.id,
          createdById: user.id,
          title: b.title,
          categoryId: b.category_id,
          specs: b.specs,
          quantity: b.quantity,
          unit: b.unit,
          targetDate: dateOnly(b.target_date),
          emirate: b.emirate,
          budgetFils: b.budget_fils ? BigInt(b.budget_fils) : null,
          deadline: new Date(b.deadline),
          visibility: b.visibility,
          invites: { create: sellers.map((s) => ({ sellerWorkspaceId: s })) },
        },
      });
      await rfqEvent(tx, {
        rfqId: r.id,
        kind: 'rfq.created',
        actorSide: 'BUYER',
        actorId: user.id,
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'rfq.created',
        resourceType: 'rfq',
        resourceId: r.id,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return r.id;
    });
    return this.view(ctx, await this.own(ctx, id));
  }

  async update(
    user: User,
    ws: string,
    id: string,
    b: z.infer<typeof rfqUpdateRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'buyer.purchase');
    const r = await this.own(ctx, id);
    if (r.state !== 'DRAFT') throw new ApiError('CONFLICT', 'rfq.not_editable');
    if (r.version !== b.expected_version) throw new ApiError('CONFLICT', 'common.stale');
    if (b.category_id) await this.validateCategory(b.category_id);
    if (b.deadline || b.target_date)
      this.validateDates({
        deadline: b.deadline ?? r.deadline.toISOString(),
        target_date: b.target_date ?? r.targetDate.toISOString().slice(0, 10),
      });
    const sellers =
      b.invitee_storefront_ids !== undefined
        ? await this.resolveInvitees(ctx, b.invitee_storefront_ids)
        : null;
    await this.prisma.$transaction(async (tx) => {
      const n = await tx.rfq.updateMany({
        where: { id: r.id, version: b.expected_version, state: 'DRAFT' },
        data: {
          ...(b.title !== undefined && { title: b.title }),
          ...(b.category_id !== undefined && { categoryId: b.category_id }),
          ...(b.specs !== undefined && { specs: b.specs }),
          ...(b.quantity !== undefined && { quantity: b.quantity }),
          ...(b.unit !== undefined && { unit: b.unit }),
          ...(b.target_date !== undefined && { targetDate: dateOnly(b.target_date) }),
          ...(b.emirate !== undefined && { emirate: b.emirate }),
          ...(b.budget_fils !== undefined && {
            budgetFils: b.budget_fils ? BigInt(b.budget_fils) : null,
          }),
          ...(b.deadline !== undefined && { deadline: new Date(b.deadline) }),
          ...(b.visibility !== undefined && { visibility: b.visibility }),
          version: { increment: 1 },
        },
      });
      if (n.count !== 1) throw new ApiError('CONFLICT', 'common.stale');
      if (sellers) {
        await tx.rfqInvite.deleteMany({ where: { rfqId: r.id } });
        await tx.rfqInvite.createMany({
          data: sellers.map((s) => ({ rfqId: r.id, sellerWorkspaceId: s })),
        });
      }
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'rfq.updated',
        resourceType: 'rfq',
        resourceId: r.id,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.view(ctx, await this.own(ctx, id));
  }

  async publish(user: User, ws: string, id: string, expected: number, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'buyer.purchase');
    const r = await this.own(ctx, id);
    if (r.state !== 'DRAFT') throw new ApiError('CONFLICT', 'rfq.not_draft');
    if (r.version !== expected) throw new ApiError('CONFLICT', 'common.stale');
    if (r.adminHiddenAt) throw new ApiError('CONFLICT', 'rfq.hidden');
    await this.validateCategory(r.categoryId);
    this.validateDates({
      deadline: r.deadline.toISOString(),
      target_date: r.targetDate.toISOString().slice(0, 10),
    });
    if (r.visibility === 'INVITE' && r.invites.length === 0)
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
        invitee_storefront_ids: 'required',
      });
    for (const i of r.invites)
      if (!(await isPublicSeller(this.prisma, i.sellerWorkspaceId)))
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
          invitee_storefront_ids: 'invalid',
        });
    if (r.files.some((f) => f.file.scanState !== 'CLEAN'))
      throw new ApiError('CONFLICT', 'rfq.files_not_clean');
    await this.prisma.$transaction(async (tx) => {
      const n = await tx.rfq.updateMany({
        where: { id: r.id, version: expected, state: 'DRAFT' },
        data: { state: 'OPEN', publishedAt: new Date(), version: { increment: 1 } },
      });
      if (n.count !== 1) throw new ApiError('CONFLICT', 'common.stale');
      await rfqEvent(tx, {
        rfqId: r.id,
        kind: 'rfq.published',
        actorSide: 'BUYER',
        actorId: user.id,
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'rfq.published',
        resourceType: 'rfq',
        resourceId: r.id,
        companyId: ctx.company.id,
        details: { visibility: r.visibility, invitees: r.invites.length },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      const payload = { rfq_id: r.id, rfq_number: r.number, title: r.title };
      const invited = new Set(r.invites.map((i) => i.sellerWorkspaceId));
      for (const s of invited) {
        const users = await workspaceRecipients(tx, s, SELLER_ACTING_ROLES);
        await notify(tx, users, 'rfq.invited', payload, {
          path: `/app/seller/${s}/rfqs/${r.id}`,
          webOrigin: this.env.WEB_ORIGIN,
        });
      }
      if (r.visibility === 'POOL') {
        for (const s of await poolSellerWorkspaces(tx, r.categoryId, ctx.company.id)) {
          if (invited.has(s)) continue;
          const users = await workspaceRecipients(tx, s, SELLER_ACTING_ROLES);
          await notify(tx, users, 'rfq.matched', payload, {
            path: `/app/seller/${s}/rfqs/${r.id}`,
            webOrigin: this.env.WEB_ORIGIN,
          });
        }
      }
    });
    return this.view(ctx, await this.own(ctx, id));
  }

  async cancel(
    user: User,
    ws: string,
    id: string,
    b: z.infer<typeof rfqCancelRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'buyer.purchase');
    const r = await this.own(ctx, id);
    await this.prisma.$transaction(async (tx) => {
      await lockRfq(tx, r.id);
      const cur = await tx.rfq.findUniqueOrThrow({ where: { id: r.id } });
      if (cur.state !== 'DRAFT' && cur.state !== 'OPEN')
        throw new ApiError('CONFLICT', 'rfq.not_cancellable');
      if (cur.version !== b.expected_version) throw new ApiError('CONFLICT', 'common.stale');
      await tx.rfq.update({
        where: { id: r.id },
        data: {
          state: 'CANCELLED',
          closedAt: new Date(),
          cancelReason: b.reason ?? null,
          version: { increment: 1 },
        },
      });
      const open = await tx.quote.findMany({
        where: { rfqId: r.id, state: 'SUBMITTED' },
        select: { id: true, currentVersionId: true, sellerWorkspaceId: true },
      });
      for (const q of open) {
        await tx.quote.update({
          where: { id: q.id },
          data: { state: 'DECLINED', version: { increment: 1 } },
        });
        if (q.currentVersionId)
          await tx.quoteVersion.update({
            where: { id: q.currentVersionId },
            data: { state: 'DECLINED' },
          });
      }
      await rfqEvent(tx, {
        rfqId: r.id,
        kind: 'rfq.cancelled',
        actorSide: 'BUYER',
        actorId: user.id,
        reason: b.reason ?? null,
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'rfq.cancelled',
        resourceType: 'rfq',
        resourceId: r.id,
        companyId: ctx.company.id,
        reason: b.reason ?? null,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      const sellers = await tx.quote.findMany({
        where: { rfqId: r.id, state: { not: 'DRAFT' } },
        select: { sellerWorkspaceId: true },
      });
      for (const s of sellers) {
        await notify(
          tx,
          await workspaceRecipients(tx, s.sellerWorkspaceId, SELLER_ACTING_ROLES),
          'rfq.cancelled',
          { rfq_id: r.id, rfq_number: r.number, title: r.title },
          {
            path: `/app/seller/${s.sellerWorkspaceId}/rfqs/${r.id}`,
            webOrigin: this.env.WEB_ORIGIN,
          },
        );
      }
    });
    return this.view(ctx, await this.own(ctx, id));
  }

  // ---------------------------------------------------------------- attachments

  async addFile(user: User, ws: string, id: string, file: Upload | undefined, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'buyer.purchase');
    const r = await this.own(ctx, id);
    if (r.state !== 'DRAFT') throw new ApiError('CONFLICT', 'rfq.not_editable');
    if (r.files.length >= RFQ_LIMITS.maxFiles) throw new ApiError('CONFLICT', 'rfq.file_limit');
    const data = await this.attachments.prepare(
      user.id,
      ctx.company.id,
      file,
      'RFQ_ATTACHMENT',
      `rfqs/${r.id}`,
    );
    await this.prisma.$transaction(async (tx) => {
      const f = await tx.file.create({ data });
      if (f.scanState === 'CLEAN') await tx.rfqFile.create({ data: { rfqId: r.id, fileId: f.id } });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: f.scanState === 'CLEAN' ? 'rfq.file_added' : 'rfq.file_quarantined',
        resourceType: 'file',
        resourceId: f.id,
        companyId: ctx.company.id,
        details: { rfq_id: r.id, mime: f.mime, bytes: f.bytes },
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    if (data.scanState === 'INFECTED')
      throw new ApiError('VALIDATION_FAILED', 'file.infected', { file: 'infected' });
    return this.view(ctx, await this.own(ctx, id));
  }

  async removeFile(user: User, ws: string, id: string, fileId: string, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'buyer.purchase');
    const r = await this.own(ctx, id);
    if (r.state !== 'DRAFT') throw new ApiError('CONFLICT', 'rfq.not_editable');
    const link = r.files.find((f) => f.fileId === fileId);
    if (!link) throw new ApiError('NOT_FOUND', 'common.not_found');
    await this.prisma.$transaction(async (tx) => {
      await tx.rfqFile.delete({ where: { id: link.id } });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'rfq.file_removed',
        resourceType: 'file',
        resourceId: fileId,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.view(ctx, await this.own(ctx, id));
  }

  /** Buyer download of an RFQ or quote attachment on one of its RFQs. */
  async download(user: User, ws: string, rfqId: string, fileId: string, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    const r = await this.own(ctx, rfqId);
    const onRfq = r.files.some((f) => f.fileId === fileId);
    const onQuote =
      !onRfq &&
      (await this.prisma.quoteFile.count({
        where: {
          fileId,
          quoteVersion: { state: { not: 'DRAFT' }, quote: { rfqId: r.id } },
        },
      })) > 0;
    if (!onRfq && !onQuote) throw new ApiError('NOT_FOUND', 'common.not_found');
    const out = await this.attachments.stream(fileId);
    await writeAudit(this.prisma, {
      actorId: user.id,
      actorType: 'user',
      action: 'rfq.file_downloaded',
      resourceType: 'file',
      resourceId: fileId,
      companyId: ctx.company.id,
      requestId: meta.requestId,
      ip: meta.ip,
    });
    return out;
  }

  // ---------------------------------------------------------------- quote decisions

  private async buyerQuote(ctx: WorkspaceContext, quoteId: string) {
    if (!/^[0-9a-f-]{36}$/i.test(quoteId)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const q = await this.prisma.quote.findFirst({
      where: { id: quoteId, state: { not: 'DRAFT' }, rfq: { buyerWorkspaceId: ctx.workspace.id } },
      include: { rfq: true, currentVersion: true, sellerWorkspace: { include: { company: true } } },
    });
    if (!q) throw new ApiError('NOT_FOUND', 'common.not_found');
    return q;
  }

  async requestRevision(
    user: User,
    ws: string,
    quoteId: string,
    b: z.infer<typeof quoteVersionActionRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'buyer.purchase');
    const q = await this.buyerQuote(ctx, quoteId);
    if (q.rfq.state !== 'OPEN') throw new ApiError('CONFLICT', 'rfq.not_open');
    if (q.state !== 'SUBMITTED' || q.currentVersionId !== b.version_id)
      throw new ApiError('CONFLICT', 'quote.superseded');
    await this.prisma.$transaction(async (tx) => {
      await rfqEvent(tx, {
        rfqId: q.rfqId,
        quoteId: q.id,
        quoteVersionId: b.version_id,
        kind: 'quote.revision_requested',
        actorSide: 'BUYER',
        actorId: user.id,
        reason: b.reason ?? null,
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'quote.revision_requested',
        resourceType: 'quote',
        resourceId: q.id,
        companyId: ctx.company.id,
        reason: b.reason ?? null,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      await notify(
        tx,
        await workspaceRecipients(tx, q.sellerWorkspaceId, SELLER_ACTING_ROLES),
        'quote.revision_requested',
        { rfq_id: q.rfqId, rfq_number: q.rfq.number, quote_id: q.id, reason: b.reason ?? null },
        {
          path: `/app/seller/${q.sellerWorkspaceId}/rfqs/${q.rfqId}`,
          webOrigin: this.env.WEB_ORIGIN,
        },
      );
    });
    return this.detail(user, ws, q.rfqId);
  }

  async decline(
    user: User,
    ws: string,
    quoteId: string,
    b: z.infer<typeof quoteVersionActionRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'buyer.purchase');
    const q = await this.buyerQuote(ctx, quoteId);
    await this.prisma.$transaction(async (tx) => {
      await lockRfq(tx, q.rfqId);
      const cur = await tx.quote.findUniqueOrThrow({ where: { id: q.id } });
      if (cur.state !== 'SUBMITTED' || cur.currentVersionId !== b.version_id)
        throw new ApiError('CONFLICT', 'quote.superseded');
      await tx.quote.update({
        where: { id: q.id },
        data: { state: 'DECLINED', version: { increment: 1 } },
      });
      await tx.quoteVersion.update({ where: { id: b.version_id }, data: { state: 'DECLINED' } });
      await rfqEvent(tx, {
        rfqId: q.rfqId,
        quoteId: q.id,
        quoteVersionId: b.version_id,
        kind: 'quote.declined',
        actorSide: 'BUYER',
        actorId: user.id,
        reason: b.reason ?? null,
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'quote.declined',
        resourceType: 'quote',
        resourceId: q.id,
        companyId: ctx.company.id,
        reason: b.reason ?? null,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      await notify(
        tx,
        await workspaceRecipients(tx, q.sellerWorkspaceId, SELLER_ACTING_ROLES),
        'quote.declined',
        { rfq_id: q.rfqId, rfq_number: q.rfq.number, quote_id: q.id },
        {
          path: `/app/seller/${q.sellerWorkspaceId}/rfqs/${q.rfqId}`,
          webOrigin: this.env.WEB_ORIGIN,
        },
      );
    });
    return this.detail(user, ws, q.rfqId);
  }

  /**
   * Award (docs/09-workflows.md): lock the RFQ row, accept exactly the version the buyer saw if it
   * is still current, submitted and valid, and close every competing quote. The unique
   * accepted_quote_version_id plus the row lock guarantee one award (T22). Orders and checkout
   * are created in Phase 4; until then the award and the payment deadline are recorded.
   */
  async accept(
    user: User,
    ws: string,
    quoteId: string,
    b: z.infer<typeof quoteAcceptRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'buyer.purchase');
    const q = await this.buyerQuote(ctx, quoteId);
    const now = new Date();
    const result = await this.prisma.$transaction(
      async (tx) => {
        await lockRfq(tx, q.rfqId);
        const rfq = await tx.rfq.findUniqueOrThrow({ where: { id: q.rfqId } });
        if (rfq.state === 'AWARDED') {
          if (rfq.acceptedQuoteVersionId === b.version_id)
            return { rfq, versionId: b.version_id, replay: true };
          throw new ApiError('CONFLICT', 'rfq.already_awarded');
        }
        if (rfq.state !== 'OPEN') throw new ApiError('CONFLICT', 'rfq.not_open');
        if (rfq.adminHiddenAt) throw new ApiError('CONFLICT', 'rfq.hidden');
        const cur = await tx.quote.findUniqueOrThrow({
          where: { id: q.id },
          include: { currentVersion: true },
        });
        const v = cur.currentVersion;
        if (cur.state !== 'SUBMITTED' || !v || v.id !== b.version_id || v.state !== 'SUBMITTED')
          throw new ApiError('CONFLICT', 'quote.superseded');
        if (v.validUntil.getTime() <= now.getTime())
          throw new ApiError('CONFLICT', 'quote.expired');
        if (cur.sellerCompanyId === ctx.company.id)
          throw new ApiError('CONFLICT', 'rfq.self_dealing');
        if (!(await isPublicSeller(tx, cur.sellerWorkspaceId)))
          throw new ApiError('CONFLICT', 'quote.seller_unavailable');
        const paymentDueAt = new Date(
          now.getTime() + this.env.QUOTE_PAYMENT_WINDOW_HOURS * 3_600_000,
        );
        await tx.quoteVersion.update({ where: { id: v.id }, data: { state: 'ACCEPTED' } });
        await tx.quote.update({
          where: { id: cur.id },
          data: { state: 'ACCEPTED', version: { increment: 1 } },
        });
        const updated = await tx.rfq.update({
          where: { id: rfq.id },
          data: {
            state: 'AWARDED',
            acceptedQuoteVersionId: v.id,
            awardedAt: now,
            closedAt: now,
            paymentDueAt,
            version: { increment: 1 },
          },
        });
        // Phase 4: the award creates the unpaid order and its checkout (only while checkout is
        // enabled; otherwise the award is recorded and no order is pretended).
        if (this.commerce.checkoutEnabled) {
          const seller = await tx.company.findUniqueOrThrow({ where: { id: cur.sellerCompanyId } });
          await createQuoteCheckout(tx, {
            rfq: updated,
            version: v,
            buyer: {
              workspaceId: ctx.workspace.id,
              companyId: ctx.company.id,
              companyName: ctx.company.displayName,
            },
            seller: {
              workspaceId: cur.sellerWorkspaceId,
              companyId: seller.id,
              companyName: seller.displayName,
            },
            userId: user.id,
            payBy: paymentDueAt,
            poReference: b.po_reference ?? null,
            commissionBps: this.commerce.commissionBps,
          });
        }
        const others = await tx.quote.findMany({
          where: { rfqId: rfq.id, id: { not: cur.id }, state: 'SUBMITTED' },
          select: { id: true, currentVersionId: true, sellerWorkspaceId: true },
        });
        for (const o of others) {
          await tx.quote.update({
            where: { id: o.id },
            data: { state: 'DECLINED', version: { increment: 1 } },
          });
          if (o.currentVersionId)
            await tx.quoteVersion.update({
              where: { id: o.currentVersionId },
              data: { state: 'DECLINED' },
            });
          await notify(
            tx,
            await workspaceRecipients(tx, o.sellerWorkspaceId, SELLER_ACTING_ROLES),
            'rfq.awarded_other',
            { rfq_id: rfq.id, rfq_number: rfq.number, quote_id: o.id },
            {
              path: `/app/seller/${o.sellerWorkspaceId}/rfqs/${rfq.id}`,
              webOrigin: this.env.WEB_ORIGIN,
            },
          );
        }
        await rfqEvent(tx, {
          rfqId: rfq.id,
          quoteId: cur.id,
          quoteVersionId: v.id,
          kind: 'rfq.awarded',
          actorSide: 'BUYER',
          actorId: user.id,
          reason: b.po_reference ? `PO ${b.po_reference}` : null,
        });
        await writeAudit(tx, {
          actorId: user.id,
          actorType: 'user',
          action: 'rfq.awarded',
          resourceType: 'rfq',
          resourceId: rfq.id,
          companyId: ctx.company.id,
          details: {
            quote_id: cur.id,
            quote_version_id: v.id,
            total_fils: v.totalFils.toString(),
            po_reference: b.po_reference ?? null,
          },
          requestId: meta.requestId,
          ip: meta.ip,
        });
        await notify(
          tx,
          await workspaceRecipients(tx, cur.sellerWorkspaceId, SELLER_ACTING_ROLES),
          'quote.accepted',
          { rfq_id: rfq.id, rfq_number: rfq.number, quote_id: cur.id },
          {
            path: `/app/seller/${cur.sellerWorkspaceId}/rfqs/${rfq.id}`,
            webOrigin: this.env.WEB_ORIGIN,
          },
        );
        await notify(
          tx,
          await workspaceRecipients(tx, ctx.workspace.id, BUYER_ACTING_ROLES, user.id),
          'quote.accepted',
          { rfq_id: rfq.id, rfq_number: rfq.number, quote_id: cur.id },
          {
            path: `/app/buyer/${ctx.workspace.id}/rfqs/${rfq.id}`,
            webOrigin: this.env.WEB_ORIGIN,
            email: false,
          },
        );
        return { rfq: updated, versionId: v.id, replay: false };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, timeout: 15_000 },
    );
    const v = await this.prisma.quoteVersion.findUniqueOrThrow({ where: { id: result.versionId } });
    const checkout = await this.prisma.checkout.findUnique({
      where: { rfqId: result.rfq.id },
      include: { orders: { select: { id: true } } },
    });
    return {
      rfq_id: result.rfq.id,
      quote_id: v.quoteId,
      quote_version_id: v.id,
      state: 'AWARDED' as const,
      total_fils: v.totalFils.toString(),
      awarded_at: result.rfq.awardedAt!.toISOString(),
      payment_due_at: result.rfq.paymentDueAt!.toISOString(),
      order_id: checkout?.orders[0]?.id ?? null,
      checkout_id: checkout?.id ?? null,
    };
  }
}
