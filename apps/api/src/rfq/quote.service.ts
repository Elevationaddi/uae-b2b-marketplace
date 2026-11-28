import { Inject, Injectable } from '@nestjs/common';
import {
  RFQ_LIMITS,
  quoteTotals,
  type quoteDraftRequest,
  type quoteReviseRequest,
  type quoteUpdateRequest,
  type sellerQuoteListQuery,
  type sellerRfqListQuery,
  type TaxCodeValue,
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
  can,
  loadWorkspaceContext,
  requireCap,
  type WorkspaceContext,
} from './access';
import { quoteTaxRefusal, supplierVat } from '../commerce/tax';
import { AttachmentService, type Upload } from './attachments';
import { notify, workspaceRecipients } from './notify';
import {
  QUOTE_INCLUDE,
  RFQ_INCLUDE,
  dateOnly,
  lockRfq,
  mapEvent,
  mapFile,
  mapQuote,
  mapSummary,
  rfqEvent,
  sellerAccess,
  type RfqFull,
} from './rfq-common';

const PAGE = 20;
const DAY = 86_400_000;
type Fields = z.infer<typeof quoteDraftRequest>;

/**
 * Seller side of RFQs and quotes (docs/03-seller.md): eligible pool and invitations, quote drafts,
 * immutable submitted versions, revisions and withdrawal. A seller only ever sees its own quote
 * (T20); private RFQs are 404 to non-invitees (T19); accepted versions are immutable (T23).
 */
@Injectable()
export class QuoteService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly attachments: AttachmentService,
  ) {}

  private ctx(user: User, ws: string) {
    return loadWorkspaceContext(this.prisma, user.id, ws, 'SELLER');
  }

  private taxBps(code: TaxCodeValue): number {
    return code === 'STANDARD' ? (this.env.TAX_STANDARD_BPS ?? 500) : 0;
  }

  /** F05: in supplier_status mode the quote's tax code must fit the supplier's VAT status. */
  private assertQuoteTax(ctx: WorkspaceContext, code: TaxCodeValue) {
    const refusal = quoteTaxRefusal(
      { treatment: this.env.TAX_TREATMENT, standardBps: this.env.TAX_STANDARD_BPS ?? 500 },
      supplierVat(ctx.company),
      code,
    );
    if (refusal) throw new ApiError('CONFLICT', refusal, { tax_code: refusal.split('.')[1]! });
  }

  private async visibleRfq(ctx: WorkspaceContext, id: string) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const r = await this.prisma.rfq.findUnique({ where: { id }, include: RFQ_INCLUDE });
    if (!r) throw new ApiError('NOT_FOUND', 'common.not_found');
    const access = await sellerAccess(this.prisma, r, ctx);
    if (!access.visible) throw new ApiError('NOT_FOUND', 'common.not_found');
    return { r, access };
  }

  // ---------------------------------------------------------------- RFQ reads

  async listRfqs(user: User, ws: string, q: z.infer<typeof sellerRfqListQuery>) {
    const ctx = await this.ctx(user, ws);
    const offset = decodeOffset(q.cursor);
    const term = q.q ? `%${likeEscape(q.q)}%` : null;
    const w = ctx.workspace.id;
    // Visible = quoted by me, or OPEN before the deadline and (invited, or POOL and eligible).
    const rows = await this.prisma.$queryRaw<
      { id: string; invited: boolean; quote_state: string | null }[]
    >`
      WITH me AS (
        SELECT ${w}::uuid AS ws, ${ctx.company.id}::uuid AS company,
               EXISTS (SELECT 1 FROM marketplace_suppliers s WHERE s.seller_workspace_id = ${w}::uuid) AS listed
      )
      SELECT r.id,
             EXISTS (SELECT 1 FROM rfq_invites i WHERE i.rfq_id = r.id AND i.seller_workspace_id = me.ws) AS invited,
             q.state::text AS quote_state
        FROM rfqs r CROSS JOIN me
        JOIN categories rc ON rc.id = r.category_id
        LEFT JOIN quotes q ON q.rfq_id = r.id AND q.seller_workspace_id = me.ws
       WHERE r.admin_hidden_at IS NULL AND r.state <> 'DRAFT' AND r.buyer_company_id <> me.company
         AND (
           q.id IS NOT NULL
           OR (r.state = 'OPEN' AND r.deadline > now() AND (
                 EXISTS (SELECT 1 FROM rfq_invites i WHERE i.rfq_id = r.id AND i.seller_workspace_id = me.ws)
                 OR (r.visibility = 'POOL' AND me.listed AND EXISTS (
                       SELECT 1 FROM marketplace_products mp
                        WHERE mp.seller_workspace_id = me.ws
                          AND COALESCE(mp.parent_category_id, mp.category_id) = COALESCE(rc.parent_id, rc.id)))))
         )
         AND (${q.scope} <> 'invited' OR EXISTS (SELECT 1 FROM rfq_invites i WHERE i.rfq_id = r.id AND i.seller_workspace_id = me.ws))
         AND (${q.scope} <> 'pool' OR r.visibility = 'POOL')
         AND (${q.scope} <> 'quoted' OR (q.id IS NOT NULL AND q.state <> 'DRAFT'))
         AND (${q.category_id ?? null}::uuid IS NULL OR r.category_id = ${q.category_id ?? null}::uuid OR rc.parent_id = ${q.category_id ?? null}::uuid)
         AND (${term}::text IS NULL OR r.title ILIKE ${term}::text OR r.number ILIKE ${term}::text)
       ORDER BY (r.state = 'OPEN') DESC, r.deadline ASC, r.id ASC
       OFFSET ${offset} LIMIT ${PAGE + 1}`;
    const ids = rows.slice(0, PAGE).map((r) => r.id);
    const full = await this.prisma.rfq.findMany({
      where: { id: { in: ids } },
      include: { category: true, buyerWorkspace: { include: { company: true } } },
    });
    const byId = new Map(full.map((r) => [r.id, r]));
    return {
      items: rows.slice(0, PAGE).map((row) => {
        const r = byId.get(row.id)!;
        return {
          ...mapSummary(r, null),
          invited: row.invited,
          buyer_company_name: r.buyerWorkspace.company.displayName,
          my_quote_state: (row.quote_state as never) ?? null,
        };
      }),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  async rfqDetail(user: User, ws: string, id: string) {
    const ctx = await this.ctx(user, ws);
    const { r, access } = await this.visibleRfq(ctx, id);
    return this.view(ctx, r, access);
  }

  private async view(
    ctx: WorkspaceContext,
    r: RfqFull,
    access: Awaited<ReturnType<typeof sellerAccess>>,
  ) {
    const quote = access.quoteId
      ? await this.prisma.quote.findUnique({
          where: { id: access.quoteId },
          include: QUOTE_INCLUDE,
        })
      : null;
    // Seller timeline: RFQ-level events plus this seller's own quote events only.
    const events = await this.prisma.rfqEvent.findMany({
      where: {
        rfqId: r.id,
        OR: [
          { quoteId: null, kind: { in: ['rfq.published', 'rfq.cancelled', 'rfq.expired'] } },
          ...(quote ? [{ quoteId: quote.id }] : []),
        ],
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    const edit = can(ctx, 'seller.catalog.edit');
    return {
      ...mapSummary(r, null),
      version: r.version,
      specs: r.specs,
      budget_fils: r.budgetFils?.toString() ?? null,
      cancel_reason: r.cancelReason,
      awarded_at: r.awardedAt?.toISOString() ?? null,
      // Whether this seller won is visible from its own quote state; never another seller's id.
      accepted_quote_version_id:
        quote &&
        r.acceptedQuoteVersionId &&
        quote.versions.some((v) => v.id === r.acceptedQuoteVersionId)
          ? r.acceptedQuoteVersionId
          : null,
      payment_due_at: null,
      admin_hidden: false,
      buyer: {
        workspace_id: r.buyerWorkspaceId,
        company_name: r.buyerWorkspace.company.displayName,
        emirate: r.buyerWorkspace.company.emirate,
      },
      invitees: [],
      files: r.files.map((f) => mapFile(f.file)),
      events: events.map(mapEvent),
      quotes: quote ? [mapQuote(quote, events)] : [],
      can: {
        edit: false,
        publish: false,
        cancel: false,
        quote: edit && !access.quoteBlocked && (!quote || quote.state === 'DRAFT'),
        message: can(ctx, 'messaging') && (r.state === 'OPEN' || !!quote),
      },
      quote_blocked_reason: access.quoteBlocked,
      invited: access.invited,
    };
  }

  async downloadRfqFile(user: User, ws: string, rfqId: string, fileId: string, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    const { r, access } = await this.visibleRfq(ctx, rfqId);
    const onRfq = r.files.some((f) => f.fileId === fileId);
    const onMyQuote =
      !onRfq &&
      !!access.quoteId &&
      (await this.prisma.quoteFile.count({
        where: { fileId, quoteVersion: { quoteId: access.quoteId } },
      })) > 0;
    if (!onRfq && !onMyQuote) throw new ApiError('NOT_FOUND', 'common.not_found');
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

  // ---------------------------------------------------------------- quotes

  async listQuotes(user: User, ws: string, q: z.infer<typeof sellerQuoteListQuery>) {
    const ctx = await this.ctx(user, ws);
    const offset = decodeOffset(q.cursor);
    const rows = await this.prisma.quote.findMany({
      where: { sellerWorkspaceId: ctx.workspace.id, ...(q.state ? { state: q.state } : {}) },
      include: {
        currentVersion: true,
        rfq: { include: { buyerWorkspace: { include: { company: true } } } },
      },
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    return {
      items: rows.slice(0, PAGE).map((x) => ({
        id: x.id,
        state: x.state,
        rfq: {
          id: x.rfq.id,
          number: x.rfq.number,
          title: x.rfq.title,
          state: x.rfq.state,
          deadline: x.rfq.deadline.toISOString(),
        },
        buyer_company_name: x.rfq.buyerWorkspace.company.displayName,
        current: x.currentVersion
          ? {
              version: x.currentVersion.version,
              state: x.currentVersion.state,
              total_fils: x.currentVersion.totalFils.toString(),
              valid_until: x.currentVersion.validUntil.toISOString(),
            }
          : null,
        updated_at: x.updatedAt.toISOString(),
      })),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  private validateFields(f: Pick<Fields, 'valid_until' | 'delivery_date'>, now = new Date()) {
    const errs: Record<string, string> = {};
    const valid = new Date(f.valid_until);
    if (valid.getTime() <= now.getTime()) errs.valid_until = 'future';
    else if (valid.getTime() > now.getTime() + RFQ_LIMITS.maxQuoteValidityDays * DAY)
      errs.valid_until = 'max';
    if (dateOnly(f.delivery_date).getTime() <= todayUtc(now).getTime())
      errs.delivery_date = 'future';
    if (Object.keys(errs).length)
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', errs);
  }

  private versionData(f: Fields) {
    const unitPrice = BigInt(f.unit_price_fils);
    const shipping = BigInt(f.shipping_fils);
    const bps = this.taxBps(f.tax_code);
    const t = quoteTotals(f.quantity, unitPrice, shipping, bps);
    return {
      quantity: f.quantity,
      unit: f.unit,
      unitPriceFils: unitPrice,
      subtotalFils: t.subtotal,
      shippingFils: shipping,
      taxCode: f.tax_code,
      taxBps: bps,
      taxFils: t.tax,
      totalFils: t.total,
      specs: f.specs,
      deviations: f.deviations ?? null,
      leadDays: f.lead_days,
      deliveryDate: dateOnly(f.delivery_date),
      validUntil: new Date(f.valid_until),
      terms: f.terms ?? null,
    };
  }

  private async ownQuote(ctx: WorkspaceContext, id: string) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const q = await this.prisma.quote.findFirst({
      where: { id, sellerWorkspaceId: ctx.workspace.id },
      include: { ...QUOTE_INCLUDE, rfq: { include: RFQ_INCLUDE } },
    });
    if (!q) throw new ApiError('NOT_FOUND', 'common.not_found');
    return q;
  }

  async createDraft(user: User, ws: string, rfqId: string, f: Fields, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'seller.catalog.edit');
    const { r, access } = await this.visibleRfq(ctx, rfqId);
    if (access.quoteId) throw new ApiError('CONFLICT', 'quote.exists');
    if (access.quoteBlocked) throw new ApiError('CONFLICT', access.quoteBlocked);
    this.validateFields(f);
    try {
      await this.prisma.$transaction(async (tx) => {
        const q = await tx.quote.create({
          data: {
            rfqId: r.id,
            sellerWorkspaceId: ctx.workspace.id,
            sellerCompanyId: ctx.company.id,
            createdById: user.id,
          },
        });
        const v = await tx.quoteVersion.create({
          data: { quoteId: q.id, version: 1, createdById: user.id, ...this.versionData(f) },
        });
        await tx.quote.update({ where: { id: q.id }, data: { currentVersionId: v.id } });
        await writeAudit(tx, {
          actorId: user.id,
          actorType: 'user',
          action: 'quote.draft_created',
          resourceType: 'quote',
          resourceId: q.id,
          companyId: ctx.company.id,
          details: { rfq_id: r.id },
          requestId: meta.requestId,
          ip: meta.ip,
        });
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')
        throw new ApiError('CONFLICT', 'quote.exists');
      throw err;
    }
    return this.rfqDetail(user, ws, rfqId);
  }

  async updateDraft(
    user: User,
    ws: string,
    id: string,
    b: z.infer<typeof quoteUpdateRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'seller.catalog.edit');
    const q = await this.ownQuote(ctx, id);
    const cur = q.versions.find((v) => v.id === q.currentVersionId);
    if (q.state !== 'DRAFT' || !cur || cur.state !== 'DRAFT')
      throw new ApiError('CONFLICT', 'quote.not_draft');
    if (q.version !== b.expected_version) throw new ApiError('CONFLICT', 'common.stale');
    const merged: Fields = {
      quantity: b.quantity ?? cur.quantity,
      unit: b.unit ?? cur.unit,
      unit_price_fils: b.unit_price_fils ?? cur.unitPriceFils.toString(),
      shipping_fils: b.shipping_fils ?? cur.shippingFils.toString(),
      tax_code: b.tax_code ?? cur.taxCode,
      specs: b.specs ?? cur.specs,
      deviations: b.deviations !== undefined ? b.deviations : cur.deviations,
      lead_days: b.lead_days ?? cur.leadDays,
      delivery_date: b.delivery_date ?? cur.deliveryDate.toISOString().slice(0, 10),
      valid_until: b.valid_until ?? cur.validUntil.toISOString(),
      terms: b.terms !== undefined ? b.terms : cur.terms,
    };
    await this.prisma.$transaction(async (tx) => {
      const n = await tx.quote.updateMany({
        where: { id: q.id, version: b.expected_version, state: 'DRAFT' },
        data: { version: { increment: 1 } },
      });
      if (n.count !== 1) throw new ApiError('CONFLICT', 'common.stale');
      await tx.quoteVersion.update({ where: { id: cur.id }, data: this.versionData(merged) });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'quote.draft_updated',
        resourceType: 'quote',
        resourceId: q.id,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.rfqDetail(user, ws, q.rfqId);
  }

  /** Submit the draft version: totals are recomputed and the version becomes immutable. */
  async submit(user: User, ws: string, id: string, expected: number, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'seller.catalog.edit');
    const q = await this.ownQuote(ctx, id);
    const access = await sellerAccess(this.prisma, q.rfq, ctx);
    if (access.quoteBlocked) throw new ApiError('CONFLICT', access.quoteBlocked);
    const cur = q.versions.find((v) => v.id === q.currentVersionId);
    if (q.state !== 'DRAFT' || !cur || cur.state !== 'DRAFT')
      throw new ApiError('CONFLICT', 'quote.not_draft');
    if (q.version !== expected) throw new ApiError('CONFLICT', 'common.stale');
    const fields: Fields = {
      quantity: cur.quantity,
      unit: cur.unit,
      unit_price_fils: cur.unitPriceFils.toString(),
      shipping_fils: cur.shippingFils.toString(),
      tax_code: cur.taxCode,
      specs: cur.specs,
      deviations: cur.deviations,
      lead_days: cur.leadDays,
      delivery_date: cur.deliveryDate.toISOString().slice(0, 10),
      valid_until: cur.validUntil.toISOString(),
      terms: cur.terms,
    };
    this.validateFields(fields);
    this.assertQuoteTax(ctx, fields.tax_code);
    if (cur.files.some((f) => f.file.scanState !== 'CLEAN'))
      throw new ApiError('CONFLICT', 'rfq.files_not_clean');
    await this.prisma.$transaction(async (tx) => {
      await lockRfq(tx, q.rfqId);
      const rfq = await tx.rfq.findUniqueOrThrow({ where: { id: q.rfqId } });
      if (rfq.state !== 'OPEN' || rfq.deadline.getTime() <= Date.now())
        throw new ApiError('CONFLICT', 'rfq.deadline_passed');
      const n = await tx.quote.updateMany({
        where: { id: q.id, version: expected, state: 'DRAFT' },
        data: { state: 'SUBMITTED', version: { increment: 1 } },
      });
      if (n.count !== 1) throw new ApiError('CONFLICT', 'common.stale');
      await tx.quoteVersion.update({
        where: { id: cur.id },
        data: { ...this.versionData(fields), state: 'SUBMITTED', submittedAt: new Date() },
      });
      await rfqEvent(tx, {
        rfqId: q.rfqId,
        quoteId: q.id,
        quoteVersionId: cur.id,
        kind: 'quote.submitted',
        actorSide: 'SELLER',
        actorId: user.id,
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'quote.submitted',
        resourceType: 'quote',
        resourceId: q.id,
        companyId: ctx.company.id,
        details: { rfq_id: q.rfqId, version: cur.version },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      await notify(
        tx,
        await workspaceRecipients(tx, q.rfq.buyerWorkspaceId, BUYER_ACTING_ROLES),
        'quote.submitted',
        {
          rfq_id: q.rfqId,
          rfq_number: q.rfq.number,
          quote_id: q.id,
          company: ctx.company.displayName,
        },
        {
          path: `/app/buyer/${q.rfq.buyerWorkspaceId}/rfqs/${q.rfqId}`,
          webOrigin: this.env.WEB_ORIGIN,
        },
      );
    });
    return this.rfqDetail(user, ws, q.rfqId);
  }

  /**
   * New immutable version replacing the current submitted one (old one SUPERSEDED). Allowed while
   * the RFQ is open and before its deadline, or after the deadline when the buyer asked for a
   * revision of the current version. Attachments carry forward.
   */
  async revise(
    user: User,
    ws: string,
    id: string,
    b: z.infer<typeof quoteReviseRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'seller.catalog.edit');
    const q = await this.ownQuote(ctx, id);
    const { expected_version, ...fields } = b;
    this.validateFields(fields);
    this.assertQuoteTax(ctx, fields.tax_code);
    const events = await this.prisma.rfqEvent.findMany({
      where: { quoteId: q.id, kind: 'quote.revision_requested' },
    });
    await this.prisma.$transaction(async (tx) => {
      await lockRfq(tx, q.rfqId);
      const rfq = await tx.rfq.findUniqueOrThrow({ where: { id: q.rfqId } });
      const cur = await tx.quote.findUniqueOrThrow({
        where: { id: q.id },
        include: { currentVersion: { include: { files: true } } },
      });
      if (cur.state === 'ACCEPTED') throw new ApiError('CONFLICT', 'quote.accepted_immutable');
      if (rfq.state !== 'OPEN') throw new ApiError('CONFLICT', 'rfq.not_open');
      if (
        cur.state !== 'SUBMITTED' ||
        !cur.currentVersion ||
        cur.currentVersion.state !== 'SUBMITTED'
      )
        throw new ApiError('CONFLICT', 'quote.not_submitted');
      if (cur.version !== expected_version) throw new ApiError('CONFLICT', 'common.stale');
      const requested = events.some(
        (e) => e.createdAt.getTime() > (cur.currentVersion!.submittedAt?.getTime() ?? 0),
      );
      if (rfq.deadline.getTime() <= Date.now() && !requested)
        throw new ApiError('CONFLICT', 'rfq.deadline_passed');
      const old = cur.currentVersion;
      await tx.quoteVersion.update({ where: { id: old.id }, data: { state: 'SUPERSEDED' } });
      const v = await tx.quoteVersion.create({
        data: {
          quoteId: q.id,
          version: old.version + 1,
          createdById: user.id,
          ...this.versionData(fields),
          state: 'SUBMITTED',
          submittedAt: new Date(),
          files: { create: old.files.map((f) => ({ fileId: f.fileId })) },
        },
      });
      await tx.quote.update({
        where: { id: q.id },
        data: { currentVersionId: v.id, version: { increment: 1 } },
      });
      await rfqEvent(tx, {
        rfqId: q.rfqId,
        quoteId: q.id,
        quoteVersionId: v.id,
        kind: 'quote.revised',
        actorSide: 'SELLER',
        actorId: user.id,
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'quote.revised',
        resourceType: 'quote',
        resourceId: q.id,
        companyId: ctx.company.id,
        details: { rfq_id: q.rfqId, version: v.version },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      await notify(
        tx,
        await workspaceRecipients(tx, q.rfq.buyerWorkspaceId, BUYER_ACTING_ROLES),
        'quote.revised',
        {
          rfq_id: q.rfqId,
          rfq_number: q.rfq.number,
          quote_id: q.id,
          company: ctx.company.displayName,
        },
        {
          path: `/app/buyer/${q.rfq.buyerWorkspaceId}/rfqs/${q.rfqId}`,
          webOrigin: this.env.WEB_ORIGIN,
        },
      );
    });
    return this.rfqDetail(user, ws, q.rfqId);
  }

  async withdraw(user: User, ws: string, id: string, expected: number, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'seller.catalog.edit');
    const q = await this.ownQuote(ctx, id);
    await this.prisma.$transaction(async (tx) => {
      await lockRfq(tx, q.rfqId);
      const cur = await tx.quote.findUniqueOrThrow({ where: { id: q.id } });
      if (cur.state === 'ACCEPTED') throw new ApiError('CONFLICT', 'quote.accepted_immutable');
      if (cur.state !== 'SUBMITTED') throw new ApiError('CONFLICT', 'quote.not_submitted');
      if (cur.version !== expected) throw new ApiError('CONFLICT', 'common.stale');
      await tx.quote.update({
        where: { id: q.id },
        data: { state: 'WITHDRAWN', version: { increment: 1 } },
      });
      if (cur.currentVersionId)
        await tx.quoteVersion.update({
          where: { id: cur.currentVersionId },
          data: { state: 'WITHDRAWN' },
        });
      await rfqEvent(tx, {
        rfqId: q.rfqId,
        quoteId: q.id,
        quoteVersionId: cur.currentVersionId,
        kind: 'quote.withdrawn',
        actorSide: 'SELLER',
        actorId: user.id,
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'quote.withdrawn',
        resourceType: 'quote',
        resourceId: q.id,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      await notify(
        tx,
        await workspaceRecipients(tx, q.rfq.buyerWorkspaceId, BUYER_ACTING_ROLES),
        'quote.withdrawn',
        {
          rfq_id: q.rfqId,
          rfq_number: q.rfq.number,
          quote_id: q.id,
          company: ctx.company.displayName,
        },
        {
          path: `/app/buyer/${q.rfq.buyerWorkspaceId}/rfqs/${q.rfqId}`,
          webOrigin: this.env.WEB_ORIGIN,
        },
      );
    });
    return this.rfqDetail(user, ws, q.rfqId);
  }

  async addFile(user: User, ws: string, id: string, file: Upload | undefined, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'seller.catalog.edit');
    const q = await this.ownQuote(ctx, id);
    const cur = q.versions.find((v) => v.id === q.currentVersionId);
    if (q.state !== 'DRAFT' || !cur || cur.state !== 'DRAFT')
      throw new ApiError('CONFLICT', 'quote.not_draft');
    if (cur.files.length >= RFQ_LIMITS.maxQuoteFiles)
      throw new ApiError('CONFLICT', 'rfq.file_limit');
    const data = await this.attachments.prepare(
      user.id,
      ctx.company.id,
      file,
      'QUOTE_ATTACHMENT',
      `quotes/${q.id}`,
    );
    await this.prisma.$transaction(async (tx) => {
      const f = await tx.file.create({ data });
      if (f.scanState === 'CLEAN')
        await tx.quoteFile.create({ data: { quoteVersionId: cur.id, fileId: f.id } });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: f.scanState === 'CLEAN' ? 'quote.file_added' : 'quote.file_quarantined',
        resourceType: 'file',
        resourceId: f.id,
        companyId: ctx.company.id,
        details: { quote_id: q.id, mime: f.mime, bytes: f.bytes },
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    if (data.scanState === 'INFECTED')
      throw new ApiError('VALIDATION_FAILED', 'file.infected', { file: 'infected' });
    return this.rfqDetail(user, ws, q.rfqId);
  }

  async removeFile(user: User, ws: string, id: string, fileId: string, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'seller.catalog.edit');
    const q = await this.ownQuote(ctx, id);
    const cur = q.versions.find((v) => v.id === q.currentVersionId);
    if (q.state !== 'DRAFT' || !cur || cur.state !== 'DRAFT')
      throw new ApiError('CONFLICT', 'quote.not_draft');
    const link = cur.files.find((f) => f.fileId === fileId);
    if (!link) throw new ApiError('NOT_FOUND', 'common.not_found');
    await this.prisma.$transaction(async (tx) => {
      await tx.quoteFile.delete({ where: { id: link.id } });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'quote.file_removed',
        resourceType: 'file',
        resourceId: fileId,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.rfqDetail(user, ws, q.rfqId);
  }
}
