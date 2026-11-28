import { Inject, Injectable } from '@nestjs/common';
import {
  FULFILMENT_LIMITS,
  type adminDisputeCloseRequest,
  type adminDisputeEvidenceRequest,
  type adminDisputeProposeRequest,
  type DisputeDetail,
  type disputeListQuery,
  type disputeMessageRequest,
  type disputeOpenRequest,
} from '@app/contracts';
import type { AppEnv } from '@app/config';
import {
  Prisma,
  recomputeSettlement,
  writeAudit,
  type Dispute,
  type DisputeMessage,
  type File as StoredFile,
  type Order,
  type PrismaClient,
  type Refund,
  type User,
} from '@app/db';
import type { z } from 'zod';
import { assertUuid, decodeOffset, encodeOffset } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { APP_ENV, PRISMA } from '../infra/tokens';
import { AttachmentService, type Upload } from '../rfq/attachments';
import { loadWorkspaceContext, type WorkspaceContext } from '../rfq/access';
import { notify } from '../rfq/notify';
import { companyNames } from '../commerce/commerce-common';
import {
  disputable,
  nextCaseNumber,
  requireRole,
  roleCan,
  sellerCanDispute,
} from './fulfilment-common';
import { lockScopedOrder, workspaceUsers } from './fulfilment.service';

type Tx = Prisma.TransactionClient;
type Side = 'buyer' | 'seller';
const PAGE = 20;
const BUYER_NOTIFY = ['OWNER', 'PROCUREMENT'] as const;
const SELLER_NOTIFY = ['OWNER', 'SALES', 'WAREHOUSE'] as const;
type Full = Dispute & {
  order: Order;
  messages: (DisputeMessage & { file?: StoredFile | null })[];
  refunds: Refund[];
};

/**
 * Disputes (docs/04-admin.md, docs/09-workflows.md): a buyer or seller opens a case on a paid
 * order; settlement eligibility is held while it is active (T27). Assigned support moves it
 * through review, evidence and a proposal; a refund outcome goes to finance with dual control and
 * the case closes only when the provider confirms it. Case history is append-only.
 */
@Injectable()
export class DisputeService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly attachments: AttachmentService,
  ) {}

  private async ctx(user: User, side: Side, ws: string) {
    return loadWorkspaceContext(this.prisma, user.id, ws, side === 'buyer' ? 'BUYER' : 'SELLER');
  }

  private canAct(ctx: WorkspaceContext, side: Side) {
    return side === 'buyer' ? roleCan(ctx, 'buyer.orders.act') : sellerCanDispute(ctx);
  }

  private scope(side: Side, ctx: WorkspaceContext): Prisma.OrderWhereInput {
    return side === 'buyer'
      ? { buyerWorkspaceId: ctx.workspace.id }
      : { sellerWorkspaceId: ctx.workspace.id };
  }

  private path(side: Side, o: Order, disputeId: string) {
    return side === 'buyer'
      ? `/app/buyer/${o.buyerWorkspaceId}/disputes/${disputeId}`
      : `/app/seller/${o.sellerWorkspaceId}/disputes/${disputeId}`;
  }

  /** Notify the order's parties (optionally excluding the side that acted). */
  private async tell(
    tx: Tx,
    o: Order,
    d: { id: string; number: string },
    type: 'dispute.opened' | 'dispute.updated',
    except?: Side,
  ) {
    for (const side of ['buyer', 'seller'] as const) {
      if (side === except) continue;
      const users = await workspaceUsers(
        tx,
        side === 'buyer' ? o.buyerWorkspaceId : o.sellerWorkspaceId,
        side === 'buyer' ? BUYER_NOTIFY : SELLER_NOTIFY,
      );
      await notify(
        tx,
        users,
        type,
        { dispute_id: d.id, dispute_number: d.number, order_id: o.id, order_number: o.number },
        { path: this.path(side, o, d.id), webOrigin: this.env.WEB_ORIGIN },
      );
    }
  }

  private async audit(
    tx: Tx,
    actor: User,
    admin: boolean,
    action: string,
    id: string,
    meta: RequestMeta,
    extra?: { companyId?: string; reason?: string; details?: Record<string, unknown> },
  ) {
    await writeAudit(tx, {
      actorId: actor.id,
      actorType: admin ? 'admin' : 'user',
      action,
      resourceType: 'dispute',
      resourceId: id,
      companyId: extra?.companyId,
      reason: extra?.reason,
      details: extra?.details,
      requestId: meta.requestId,
      ip: meta.ip,
    });
  }

  // ---------------------------------------------------------------- parties

  async open(
    user: User,
    side: Side,
    ws: string,
    orderId: string,
    body: z.infer<typeof disputeOpenRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, side, ws);
    if (!this.canAct(ctx, side)) throw new ApiError('FORBIDDEN', 'common.forbidden');
    try {
      return await this.prisma.$transaction(async (tx) => {
        const o = await lockScopedOrder(tx, orderId, this.scope(side, ctx));
        if (!disputable(o)) throw new ApiError('CONFLICT', 'dispute.not_allowed');
        if (await tx.dispute.count({ where: { orderId: o.id, state: { not: 'CLOSED' } } }))
          throw new ApiError('CONFLICT', 'dispute.exists');
        const d = await tx.dispute.create({
          data: {
            number: await nextCaseNumber(tx, 'dispute'),
            orderId: o.id,
            openedById: user.id,
            openedSide: side === 'buyer' ? 'BUYER' : 'SELLER',
            type: body.type,
            reason: body.reason,
            messages: {
              create: {
                authorId: user.id,
                authorSide: side === 'buyer' ? 'BUYER' : 'SELLER',
                body: body.reason,
              },
            },
          },
        });
        await tx.orderEvent.create({
          data: {
            orderId: o.id,
            kind: 'dispute.opened',
            actorSide: side === 'buyer' ? 'BUYER' : 'SELLER',
            actorId: user.id,
            reason: d.number,
          },
        });
        // T27: settlement eligibility is held while the case is active.
        await recomputeSettlement(tx, o.id);
        await this.audit(tx, user, false, 'dispute.opened', d.id, meta, {
          companyId: ctx.company.id,
          details: { order_id: o.id, type: body.type },
        });
        await this.tell(tx, o, d, 'dispute.opened', side);
        return { id: d.id };
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ApiError('CONFLICT', 'dispute.exists');
      throw e;
    }
  }

  async list(user: User, side: Side, ws: string, q: z.infer<typeof disputeListQuery>) {
    const ctx = await this.ctx(user, side, ws);
    requireRole(ctx, side === 'buyer' ? 'buyer.orders.read' : 'seller.orders.read');
    return this.page(
      { order: this.scope(side, ctx), ...(q.state ? { state: q.state } : {}) },
      q.cursor,
      null,
    );
  }

  async detail(user: User, side: Side, ws: string, id: string): Promise<DisputeDetail> {
    const ctx = await this.ctx(user, side, ws);
    requireRole(ctx, side === 'buyer' ? 'buyer.orders.read' : 'seller.orders.read');
    const d = await this.load({ id, order: this.scope(side, ctx) });
    return this.view(d, null, this.canAct(ctx, side) && d.state !== 'CLOSED');
  }

  async message(
    user: User,
    side: Side,
    ws: string,
    id: string,
    body: z.infer<typeof disputeMessageRequest>,
    file: Upload | undefined,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, side, ws);
    if (!this.canAct(ctx, side)) throw new ApiError('FORBIDDEN', 'common.forbidden');
    const d = await this.load({ id, order: this.scope(side, ctx) });
    await this.post(
      d,
      user,
      side === 'buyer' ? 'BUYER' : 'SELLER',
      body.body,
      file,
      ctx.company.id,
      meta,
    );
    return this.detail(user, side, ws, id);
  }

  async download(
    user: User,
    side: Side | 'admin',
    ws: string | null,
    id: string,
    fileId: string,
    meta: RequestMeta,
  ) {
    assertUuid(fileId);
    let companyId: string | undefined;
    let where: Prisma.DisputeWhereInput = { id };
    if (side !== 'admin') {
      const ctx = await this.ctx(user, side, ws!);
      requireRole(ctx, side === 'buyer' ? 'buyer.orders.read' : 'seller.orders.read');
      where = { id, order: this.scope(side, ctx) };
      companyId = ctx.company.id;
    }
    assertUuid(id);
    const hit = await this.prisma.disputeMessage.findFirst({ where: { fileId, dispute: where } });
    if (!hit) throw new ApiError('NOT_FOUND', 'common.not_found');
    const out = await this.attachments.stream(fileId);
    await writeAudit(this.prisma, {
      actorId: user.id,
      actorType: side === 'admin' ? 'admin' : 'user',
      action: 'dispute.file_downloaded',
      resourceType: 'file',
      resourceId: fileId,
      companyId,
      requestId: meta.requestId,
      ip: meta.ip,
    });
    return out;
  }

  // ---------------------------------------------------------------- admin (support)

  adminList(admin: User, q: z.infer<typeof disputeListQuery>) {
    return this.page(
      {
        ...(q.state ? { state: q.state } : {}),
        ...(q.mine === 'true' ? { assignedAdminId: admin.id } : {}),
      },
      q.cursor,
      admin.id,
    );
  }

  async adminDetail(admin: User, id: string, canManage: boolean) {
    const d = await this.load({ id });
    return this.view(
      d,
      admin.id,
      canManage && d.state !== 'CLOSED' && d.assignedAdminId === admin.id,
    );
  }

  private async adminStep(
    admin: User,
    id: string,
    meta: RequestMeta,
    fn: (
      tx: Tx,
      d: Dispute & { order: Order },
    ) => Promise<{ action: string; reason?: string; message?: string }>,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM disputes WHERE id = ${id}::uuid FOR UPDATE`;
      const d = await tx.dispute.findUnique({ where: { id }, include: { order: true } });
      if (!d) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (d.state === 'CLOSED') throw new ApiError('CONFLICT', 'dispute.closed');
      const r = await fn(tx, d);
      if (r.message)
        await tx.disputeMessage.create({
          data: { disputeId: d.id, authorId: admin.id, authorSide: 'ADMIN', body: r.message },
        });
      await this.audit(tx, admin, true, r.action, d.id, meta, { reason: r.reason });
      await this.tell(tx, d.order, d, 'dispute.updated');
    });
    return this.adminDetail(admin, id, true);
  }

  private assignee(admin: User, d: Dispute) {
    if (d.assignedAdminId !== admin.id) throw new ApiError('FORBIDDEN', 'dispute.not_assigned');
  }

  assign(admin: User, id: string, meta: RequestMeta) {
    return this.adminStep(admin, id, meta, async (tx, d) => {
      await tx.dispute.update({
        where: { id: d.id },
        data: {
          assignedAdminId: admin.id,
          ...(d.state === 'OPEN' ? { state: 'UNDER_REVIEW' } : {}),
          version: { increment: 1 },
        },
      });
      return { action: 'dispute.assigned' };
    });
  }

  requestEvidence(
    admin: User,
    id: string,
    b: z.infer<typeof adminDisputeEvidenceRequest>,
    meta: RequestMeta,
  ) {
    return this.adminStep(admin, id, meta, async (tx, d) => {
      this.assignee(admin, d);
      if (d.state !== 'UNDER_REVIEW' && d.state !== 'RESOLUTION_PROPOSED')
        throw new ApiError('CONFLICT', 'dispute.invalid_transition');
      await tx.dispute.update({
        where: { id: d.id },
        data: { state: 'AWAITING_EVIDENCE', version: { increment: 1 } },
      });
      return { action: 'dispute.evidence_requested', message: b.message };
    });
  }

  propose(
    admin: User,
    id: string,
    b: z.infer<typeof adminDisputeProposeRequest>,
    meta: RequestMeta,
  ) {
    return this.adminStep(admin, id, meta, async (tx, d) => {
      this.assignee(admin, d);
      if (d.state !== 'UNDER_REVIEW' && d.state !== 'AWAITING_EVIDENCE')
        throw new ApiError('CONFLICT', 'dispute.invalid_transition');
      const amount = b.amount_fils ? BigInt(b.amount_fils) : null;
      if (amount !== null && amount > d.order.totalFils - d.order.refundedFils)
        throw new ApiError('CONFLICT', 'refund.exceeds_remaining');
      await tx.dispute.update({
        where: { id: d.id },
        data: {
          state: 'RESOLUTION_PROPOSED',
          proposal: b.proposal,
          proposalAmountFils: amount,
          proposalNote: b.note,
          version: { increment: 1 },
        },
      });
      return { action: 'dispute.resolution_proposed', message: b.note, reason: b.proposal };
    });
  }

  /** Close without a money action; a refund outcome closes only on provider confirmation. */
  close(admin: User, id: string, b: z.infer<typeof adminDisputeCloseRequest>, meta: RequestMeta) {
    return this.adminStep(admin, id, meta, async (tx, d) => {
      this.assignee(admin, d);
      if (d.state !== 'RESOLUTION_PROPOSED' || d.proposal !== 'NO_ACTION')
        throw new ApiError('CONFLICT', 'dispute.invalid_transition');
      await tx.dispute.update({
        where: { id: d.id },
        data: {
          state: 'CLOSED',
          resolution: b.resolution,
          closedAt: new Date(),
          version: { increment: 1 },
        },
      });
      await recomputeSettlement(tx, d.orderId);
      return { action: 'dispute.closed', message: b.resolution, reason: b.resolution };
    });
  }

  async adminMessage(
    admin: User,
    id: string,
    body: z.infer<typeof disputeMessageRequest>,
    meta: RequestMeta,
  ) {
    const d = await this.load({ id });
    this.assignee(admin, d);
    await this.post(d, admin, 'ADMIN', body.body, undefined, undefined, meta);
    return this.adminDetail(admin, id, true);
  }

  // ---------------------------------------------------------------- internals

  private async post(
    d: Full,
    user: User,
    side: 'BUYER' | 'SELLER' | 'ADMIN',
    body: string,
    file: Upload | undefined,
    companyId: string | undefined,
    meta: RequestMeta,
  ) {
    if (d.state === 'CLOSED') throw new ApiError('CONFLICT', 'dispute.closed');
    if (d.messages.length >= FULFILMENT_LIMITS.maxDisputeMessages)
      throw new ApiError('CONFLICT', 'dispute.message_limit');
    const data =
      file && companyId
        ? await this.attachments.prepare(
            user.id,
            companyId,
            file,
            'DISPUTE_EVIDENCE',
            `disputes/${d.id}`,
          )
        : null;
    await this.prisma.$transaction(async (tx) => {
      const f = data ? await tx.file.create({ data }) : null;
      await tx.disputeMessage.create({
        data: {
          disputeId: d.id,
          authorId: user.id,
          authorSide: side,
          body,
          fileId: f && f.scanState === 'CLEAN' ? f.id : null,
        },
      });
      if (side !== 'ADMIN' && d.state === 'AWAITING_EVIDENCE')
        await tx.dispute.update({
          where: { id: d.id },
          data: { state: 'UNDER_REVIEW', version: { increment: 1 } },
        });
      await this.audit(tx, user, side === 'ADMIN', 'dispute.message', d.id, meta, {
        companyId,
        details: { file: f ? f.scanState : null },
      });
      await this.tell(
        tx,
        d.order,
        d,
        'dispute.updated',
        side === 'BUYER' ? 'buyer' : side === 'SELLER' ? 'seller' : undefined,
      );
    });
    if (data && data.scanState !== 'CLEAN')
      throw new ApiError('VALIDATION_FAILED', 'file.infected', { file: 'infected' });
  }

  private async load(where: Prisma.DisputeWhereInput): Promise<Full> {
    if (typeof where.id === 'string') assertUuid(where.id);
    const d = await this.prisma.dispute.findFirst({
      where,
      include: {
        order: true,
        messages: { orderBy: { createdAt: 'asc' } },
        refunds: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!d) throw new ApiError('NOT_FOUND', 'common.not_found');
    const fileIds = d.messages.map((m) => m.fileId).filter((x): x is string => !!x);
    const files = await this.prisma.file.findMany({ where: { id: { in: fileIds } } });
    const byId = new Map(files.map((f) => [f.id, f]));
    return {
      ...d,
      messages: d.messages.map((m) => ({
        ...m,
        file: m.fileId ? (byId.get(m.fileId) ?? null) : null,
      })),
    };
  }

  private async page(
    where: Prisma.DisputeWhereInput,
    cursor: string | undefined,
    adminId: string | null,
  ) {
    const offset = decodeOffset(cursor);
    const rows = await this.prisma.dispute.findMany({
      where,
      include: { order: true },
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const names = await companyNames(
      this.prisma,
      rows.flatMap((r) => [r.order.buyerCompanyId, r.order.sellerCompanyId]),
    );
    return {
      items: rows.slice(0, PAGE).map((d) => this.summary(d, names, adminId)),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  private summary(
    d: Dispute & { order: Order },
    names: Map<string, string>,
    adminId: string | null,
  ) {
    return {
      id: d.id,
      number: d.number,
      order_id: d.orderId,
      order_number: d.order.number,
      type: d.type,
      state: d.state,
      opened_side: d.openedSide as 'BUYER' | 'SELLER',
      buyer_company_name: names.get(d.order.buyerCompanyId) ?? '',
      seller_company_name: names.get(d.order.sellerCompanyId) ?? '',
      assigned_to_me: !!adminId && d.assignedAdminId === adminId,
      assigned: !!d.assignedAdminId,
      created_at: d.createdAt.toISOString(),
      updated_at: d.updatedAt.toISOString(),
    };
  }

  private async view(d: Full, adminId: string | null, canMessage: boolean): Promise<DisputeDetail> {
    const names = await companyNames(this.prisma, [
      d.order.buyerCompanyId,
      d.order.sellerCompanyId,
    ]);
    const party = (side: string) =>
      side === 'BUYER'
        ? (names.get(d.order.buyerCompanyId) ?? '')
        : side === 'SELLER'
          ? (names.get(d.order.sellerCompanyId) ?? '')
          : '';
    return {
      ...this.summary(d, names, adminId),
      reason: d.reason,
      order_total_fils: d.order.totalFils.toString(),
      order_refunded_fils: d.order.refundedFils.toString(),
      proposal: d.proposal,
      proposal_amount_fils: d.proposalAmountFils?.toString() ?? null,
      proposal_note: d.proposalNote,
      resolution: d.resolution,
      closed_at: d.closedAt?.toISOString() ?? null,
      // Staff identities are not shown to companies: admin messages read as marketplace support.
      messages: d.messages.map((m) => ({
        id: m.id,
        author_side: m.authorSide as 'BUYER' | 'SELLER' | 'ADMIN' | 'SYSTEM',
        author_name: party(m.authorSide),
        body: m.body,
        file: m.file ? { id: m.file.id, name: m.file.originalName } : null,
        created_at: m.createdAt.toISOString(),
      })),
      refunds: d.refunds.map((r) => ({
        id: r.id,
        number: r.number,
        state: r.state,
        amount_fils: r.amountFils.toString(),
      })),
      can_message: canMessage,
    };
  }
}
