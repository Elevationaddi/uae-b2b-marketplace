import { Inject, Injectable } from '@nestjs/common';
import {
  OPERATIONS_LIMITS,
  type adminSupportListQuery,
  type supportCreateRequest,
  type supportListQuery,
  type SupportTicketDetail,
  type SupportTicketSummary,
} from '@app/contracts';
import type { AppEnv } from '@app/config';
import {
  Prisma,
  writeAudit,
  type PrismaClient,
  type SupportMessage,
  type SupportTicket,
  type User,
} from '@app/db';
import type { z } from 'zod';
import { assertUuid, decodeOffset, encodeOffset } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { companyNames } from '../commerce/commerce-common';
import { APP_ENV, PRISMA } from '../infra/tokens';
import { loadWorkspaceContext, type WorkspaceContext } from '../rfq/access';
import { notify } from '../rfq/notify';

type Tx = Prisma.TransactionClient;
type Full = SupportTicket & { messages: SupportMessage[] };
const PAGE = 20;
/** Ticket states in which the conversation is live. */
const LIVE = ['OPEN', 'ASSIGNED', 'WAITING_CUSTOMER'] as const;
/** Customer support is workspace-wide; a read-only member can follow but not write (P6-1). */
const WRITE_ROLES = ['OWNER', 'PROCUREMENT', 'SALES', 'WAREHOUSE', 'FINANCE'];

/**
 * Customer support tickets (docs/04-admin.md "Support"): a company user opens a ticket in their
 * workspace, optionally linked to one of the workspace's own orders or RFQs; a support admin takes
 * it, replies and resolves it. History is append-only; every state change is audited. Support sees
 * only the limited order details (number, state, total) the ticket links to.
 */
@Injectable()
export class SupportService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  // ---------------------------------------------------------------- customer

  private canWrite(ctx: WorkspaceContext) {
    return WRITE_ROLES.includes(ctx.membership.role);
  }

  private requireWrite(ctx: WorkspaceContext) {
    if (!this.canWrite(ctx)) throw new ApiError('FORBIDDEN', 'common.forbidden');
  }

  async create(
    user: User,
    ws: string,
    b: z.infer<typeof supportCreateRequest>,
    meta: RequestMeta,
  ): Promise<SupportTicketDetail> {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws);
    this.requireWrite(ctx);
    if (b.order_id) {
      const order = await this.prisma.order.findFirst({
        where: {
          id: b.order_id,
          ...(ctx.workspace.kind === 'BUYER'
            ? { buyerWorkspaceId: ctx.workspace.id }
            : { sellerWorkspaceId: ctx.workspace.id }),
        },
        select: { id: true },
      });
      // Someone else's order is indistinguishable from a missing one.
      if (!order)
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
          order_id: 'not_found',
        });
    }
    if (b.rfq_id) {
      const rfq = await this.prisma.rfq.findFirst({
        where: {
          id: b.rfq_id,
          ...(ctx.workspace.kind === 'BUYER'
            ? { buyerWorkspaceId: ctx.workspace.id }
            : { quotes: { some: { sellerWorkspaceId: ctx.workspace.id } } }),
        },
        select: { id: true },
      });
      if (!rfq)
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
          rfq_id: 'not_found',
        });
    }
    const id = await this.prisma.$transaction(async (tx) => {
      // Serialise ticket creation per workspace so the open-ticket cap holds under concurrency.
      await tx.$queryRaw`SELECT id FROM workspaces WHERE id = ${ctx.workspace.id}::uuid FOR UPDATE`;
      const open = await tx.supportTicket.count({
        where: { workspaceId: ctx.workspace.id, state: { in: [...LIVE] } },
      });
      if (open >= OPERATIONS_LIMITS.openTicketsPerWorkspace)
        throw new ApiError('CONFLICT', 'support.too_many_open');
      const n = await tx.$queryRaw<
        { n: bigint }[]
      >`SELECT nextval('support_ticket_number_seq') AS n`;
      const now = new Date();
      const t = await tx.supportTicket.create({
        data: {
          number: `SUP-${String(n[0]!.n).padStart(6, '0')}`,
          workspaceId: ctx.workspace.id,
          companyId: ctx.company.id,
          openedById: user.id,
          category: b.category,
          subject: b.subject,
          orderId: b.order_id ?? null,
          rfqId: b.rfq_id ?? null,
          lastCustomerAt: now,
          messages: { create: { authorId: user.id, authorSide: 'CUSTOMER', body: b.body } },
        },
      });
      await this.audit(tx, user, false, 'support.created', t.id, meta, {
        companyId: ctx.company.id,
        details: { number: t.number, category: t.category },
      });
      return t.id;
    });
    return this.customerDetail(user, ws, id);
  }

  async list(user: User, ws: string, q: z.infer<typeof supportListQuery>) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws);
    return this.page(
      { workspaceId: ctx.workspace.id, ...(q.state ? { state: q.state } : {}) },
      q.cursor,
      null,
    );
  }

  private async customerTicket(ctx: WorkspaceContext, id: string) {
    assertUuid(id);
    const t = await this.prisma.supportTicket.findFirst({
      where: { id, workspaceId: ctx.workspace.id },
      include: { messages: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] } },
    });
    if (!t) throw new ApiError('NOT_FOUND', 'common.not_found');
    return t;
  }

  async customerDetail(user: User, ws: string, id: string): Promise<SupportTicketDetail> {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws);
    const t = await this.customerTicket(ctx, id);
    const write = this.canWrite(ctx);
    return this.view(t, null, {
      can_reply: write && (LIVE as readonly string[]).includes(t.state),
      can_close: write && t.state !== 'CLOSED',
      can_reopen: write && t.state === 'RESOLVED',
    });
  }

  /** Customer step on a locked ticket in the caller's workspace. */
  private async customerStep(
    user: User,
    ws: string,
    id: string,
    meta: RequestMeta,
    fn: (tx: Tx, t: SupportTicket) => Promise<{ action?: string }>,
  ) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws);
    this.requireWrite(ctx);
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM support_tickets WHERE id = ${id}::uuid FOR UPDATE`;
      const t = await tx.supportTicket.findFirst({ where: { id, workspaceId: ctx.workspace.id } });
      if (!t) throw new ApiError('NOT_FOUND', 'common.not_found');
      const r = await fn(tx, t);
      if (r.action)
        await this.audit(tx, user, false, r.action, t.id, meta, { companyId: t.companyId });
    });
    return this.customerDetail(user, ws, id);
  }

  reply(user: User, ws: string, id: string, body: string, meta: RequestMeta) {
    return this.customerStep(user, ws, id, meta, async (tx, t) => {
      if (!(LIVE as readonly string[]).includes(t.state))
        throw new ApiError('CONFLICT', 'support.not_open');
      await this.append(tx, t, user.id, 'CUSTOMER', body);
      await tx.supportTicket.update({
        where: { id: t.id },
        data: {
          lastCustomerAt: new Date(),
          // The customer answered: the ball is back with the assigned agent.
          ...(t.state === 'WAITING_CUSTOMER' ? { state: 'ASSIGNED' } : {}),
          version: { increment: 1 },
        },
      });
      return {};
    });
  }

  close(user: User, ws: string, id: string, meta: RequestMeta) {
    return this.customerStep(user, ws, id, meta, async (tx, t) => {
      if (t.state === 'CLOSED') throw new ApiError('CONFLICT', 'support.closed');
      await tx.supportTicket.update({
        where: { id: t.id },
        data: { state: 'CLOSED', closedAt: new Date(), version: { increment: 1 } },
      });
      return { action: 'support.closed' };
    });
  }

  reopen(user: User, ws: string, id: string, meta: RequestMeta) {
    return this.customerStep(user, ws, id, meta, async (tx, t) => {
      if (t.state !== 'RESOLVED') throw new ApiError('CONFLICT', 'support.not_resolved');
      await tx.supportTicket.update({
        where: { id: t.id },
        data: {
          state: t.assignedAdminId ? 'ASSIGNED' : 'OPEN',
          resolvedAt: null,
          lastCustomerAt: new Date(),
          version: { increment: 1 },
        },
      });
      return { action: 'support.reopened' };
    });
  }

  // ---------------------------------------------------------------- admin (support)

  adminList(admin: User, q: z.infer<typeof adminSupportListQuery>) {
    return this.page(
      {
        ...(q.state ? { state: q.state } : {}),
        ...(q.assigned === 'me'
          ? { assignedAdminId: admin.id }
          : q.assigned === 'unassigned'
            ? { assignedAdminId: null }
            : {}),
      },
      q.cursor,
      admin.id,
    );
  }

  async adminDetail(admin: User, id: string, canManage: boolean): Promise<SupportTicketDetail> {
    assertUuid(id);
    const t = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: { messages: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] } },
    });
    if (!t) throw new ApiError('NOT_FOUND', 'common.not_found');
    const mine = canManage && t.assignedAdminId === admin.id;
    return this.view(t, admin.id, {
      can_reply: mine && (LIVE as readonly string[]).includes(t.state),
      can_close: mine && (LIVE as readonly string[]).includes(t.state),
      can_reopen: canManage && t.state === 'RESOLVED',
    });
  }

  private async adminStep(
    admin: User,
    id: string,
    meta: RequestMeta,
    fn: (
      tx: Tx,
      t: SupportTicket,
    ) => Promise<{
      action: string;
      notify?: 'support.replied' | 'support.resolved';
      details?: Record<string, unknown>;
    }>,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM support_tickets WHERE id = ${id}::uuid FOR UPDATE`;
      const t = await tx.supportTicket.findUnique({ where: { id } });
      if (!t) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (t.state === 'CLOSED') throw new ApiError('CONFLICT', 'support.closed');
      const r = await fn(tx, t);
      await this.audit(tx, admin, true, r.action, t.id, meta, {
        companyId: t.companyId,
        details: r.details,
      });
      if (r.notify) await this.tellCustomer(tx, t, r.notify);
    });
    return this.adminDetail(admin, id, true);
  }

  private assignee(admin: User, t: SupportTicket) {
    if (t.assignedAdminId !== admin.id) throw new ApiError('FORBIDDEN', 'support.not_assigned');
  }

  /** Take the ticket (or take it over from another agent; the previous assignee is audited). */
  assign(admin: User, id: string, meta: RequestMeta) {
    return this.adminStep(admin, id, meta, async (tx, t) => {
      if (t.assignedAdminId === admin.id)
        throw new ApiError('CONFLICT', 'support.already_assigned');
      await tx.supportTicket.update({
        where: { id: t.id },
        data: {
          assignedAdminId: admin.id,
          ...(t.state === 'OPEN' ? { state: 'ASSIGNED' } : {}),
          version: { increment: 1 },
        },
      });
      return { action: 'support.assigned', details: { previous_admin_id: t.assignedAdminId } };
    });
  }

  adminReply(admin: User, id: string, body: string, meta: RequestMeta) {
    return this.adminStep(admin, id, meta, async (tx, t) => {
      this.assignee(admin, t);
      if (!(LIVE as readonly string[]).includes(t.state))
        throw new ApiError('CONFLICT', 'support.not_open');
      await this.append(tx, t, admin.id, 'ADMIN', body);
      await tx.supportTicket.update({
        where: { id: t.id },
        data: { state: 'WAITING_CUSTOMER', lastAdminAt: new Date(), version: { increment: 1 } },
      });
      return { action: 'support.replied', notify: 'support.replied' };
    });
  }

  resolve(admin: User, id: string, body: string | undefined, meta: RequestMeta) {
    return this.adminStep(admin, id, meta, async (tx, t) => {
      this.assignee(admin, t);
      if (!(LIVE as readonly string[]).includes(t.state))
        throw new ApiError('CONFLICT', 'support.not_open');
      if (body) await this.append(tx, t, admin.id, 'ADMIN', body);
      const now = new Date();
      await tx.supportTicket.update({
        where: { id: t.id },
        data: {
          state: 'RESOLVED',
          resolvedAt: now,
          ...(body ? { lastAdminAt: now } : {}),
          version: { increment: 1 },
        },
      });
      return { action: 'support.resolved', notify: 'support.resolved' };
    });
  }

  adminReopen(admin: User, id: string, meta: RequestMeta) {
    return this.adminStep(admin, id, meta, async (tx, t) => {
      if (t.state !== 'RESOLVED') throw new ApiError('CONFLICT', 'support.not_resolved');
      await tx.supportTicket.update({
        where: { id: t.id },
        data: {
          state: 'ASSIGNED',
          assignedAdminId: admin.id,
          resolvedAt: null,
          version: { increment: 1 },
        },
      });
      return { action: 'support.reopened', details: { previous_admin_id: t.assignedAdminId } };
    });
  }

  // ---------------------------------------------------------------- shared

  private async append(
    tx: Tx,
    t: SupportTicket,
    authorId: string,
    side: 'CUSTOMER' | 'ADMIN',
    body: string,
  ) {
    const count = await tx.supportMessage.count({ where: { ticketId: t.id } });
    if (count >= OPERATIONS_LIMITS.maxSupportMessages)
      throw new ApiError('CONFLICT', 'support.too_many_messages');
    await tx.supportMessage.create({ data: { ticketId: t.id, authorId, authorSide: side, body } });
  }

  /** The opener and the workspace owners hear about agent replies and resolutions. */
  private async tellCustomer(
    tx: Tx,
    t: SupportTicket,
    type: 'support.replied' | 'support.resolved',
  ) {
    const owners = await tx.membership.findMany({
      where: {
        workspaceId: t.workspaceId,
        status: 'ACTIVE',
        role: 'OWNER',
        user: { status: 'ACTIVE' },
      },
      select: { userId: true },
    });
    const opener = await tx.membership.findFirst({
      where: { workspaceId: t.workspaceId, userId: t.openedById, status: 'ACTIVE' },
      select: { userId: true },
    });
    const ids = [...new Set([...owners.map((o) => o.userId), ...(opener ? [opener.userId] : [])])];
    const ws = await tx.workspace.findUniqueOrThrow({ where: { id: t.workspaceId } });
    await notify(
      tx,
      ids,
      type,
      { ticket_id: t.id, ticket_number: t.number },
      {
        path: `/app/${ws.kind === 'BUYER' ? 'buyer' : 'seller'}/${t.workspaceId}/support/${t.id}`,
        webOrigin: this.env.WEB_ORIGIN,
      },
    );
  }

  private async audit(
    tx: Tx,
    actor: User,
    admin: boolean,
    action: string,
    id: string,
    meta: RequestMeta,
    extra?: { companyId?: string; details?: Record<string, unknown> },
  ) {
    await writeAudit(tx, {
      actorId: actor.id,
      actorType: admin ? 'admin' : 'user',
      action,
      resourceType: 'support_ticket',
      resourceId: id,
      companyId: extra?.companyId,
      details: extra?.details,
      requestId: meta.requestId,
      ip: meta.ip,
    });
  }

  private async page(
    where: Prisma.SupportTicketWhereInput,
    cursor: string | undefined,
    adminId: string | null,
  ) {
    const offset = decodeOffset(cursor);
    const rows = await this.prisma.supportTicket.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const items = rows.slice(0, PAGE);
    const [names, kinds] = await Promise.all([
      companyNames(
        this.prisma,
        items.map((r) => r.companyId),
      ),
      this.workspaceKinds(items.map((r) => r.workspaceId)),
    ]);
    return {
      items: items.map((t) => this.summary(t, names, kinds, adminId)),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  private async workspaceKinds(ids: string[]) {
    const rows = ids.length
      ? await this.prisma.workspace.findMany({
          where: { id: { in: [...new Set(ids)] } },
          select: { id: true, kind: true },
        })
      : [];
    return new Map(rows.map((w) => [w.id, w.kind]));
  }

  private summary(
    t: SupportTicket,
    names: Map<string, string>,
    kinds: Map<string, string>,
    adminId: string | null,
  ): SupportTicketSummary {
    return {
      id: t.id,
      number: t.number,
      category: t.category,
      subject: t.subject,
      state: t.state,
      company_name: names.get(t.companyId) ?? '',
      workspace_kind: kinds.get(t.workspaceId) === 'SELLER' ? 'SELLER' : 'BUYER',
      assigned: !!t.assignedAdminId,
      assigned_to_me: !!adminId && t.assignedAdminId === adminId,
      created_at: t.createdAt.toISOString(),
      updated_at: t.updatedAt.toISOString(),
    };
  }

  /**
   * Customers see agent messages as "Support"; admins see the agent's address. Linked order data
   * is limited to number, state and total for both audiences.
   */
  private async view(
    t: Full,
    adminId: string | null,
    flags: { can_reply: boolean; can_close: boolean; can_reopen: boolean },
  ): Promise<SupportTicketDetail> {
    const [names, kinds, order, rfq, authors] = await Promise.all([
      companyNames(this.prisma, [t.companyId]),
      this.workspaceKinds([t.workspaceId]),
      t.orderId
        ? this.prisma.order.findUnique({
            where: { id: t.orderId },
            select: { id: true, number: true, state: true, totalFils: true },
          })
        : null,
      t.rfqId
        ? this.prisma.rfq.findUnique({
            where: { id: t.rfqId },
            select: { id: true, number: true, title: true },
          })
        : null,
      this.prisma.user.findMany({
        where: { id: { in: [...new Set(t.messages.map((m) => m.authorId))] } },
        select: { id: true, fullName: true, email: true },
      }),
    ]);
    const byId = new Map(authors.map((a) => [a.id, a]));
    return {
      ...this.summary(t, names, kinds, adminId),
      order: order
        ? {
            id: order.id,
            number: order.number,
            state: order.state,
            total_fils: order.totalFils.toString(),
          }
        : null,
      rfq,
      messages: t.messages.map((m) => {
        const a = byId.get(m.authorId);
        const side = m.authorSide as 'CUSTOMER' | 'ADMIN' | 'SYSTEM';
        return {
          id: m.id,
          author_side: side,
          author_name:
            side === 'CUSTOMER'
              ? (a?.fullName ?? a?.email ?? '')
              : adminId
                ? (a?.email ?? '')
                : 'Support',
          body: m.body,
          created_at: m.createdAt.toISOString(),
        };
      }),
      ...flags,
    };
  }
}
