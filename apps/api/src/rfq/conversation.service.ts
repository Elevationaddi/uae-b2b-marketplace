import { Inject, Injectable } from '@nestjs/common';
import type { conversationStartRequest } from '@app/contracts';
import type { AppEnv } from '@app/config';
import { Prisma, writeAudit, type PrismaClient, type User } from '@app/db';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import { decodeCursor, encodeCursor } from '../common/pagination';
import { RateLimitService } from '../common/rate-limit.service';
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
import { notify, workspaceRecipients } from './notify';
import { isPublicSeller, sellerAccess } from './rfq-common';

const PAGE = 30;
const CONV_INCLUDE = {
  buyerWorkspace: { include: { company: true } },
  sellerWorkspace: { include: { company: true } },
  rfq: { select: { id: true, number: true, title: true } },
} satisfies Prisma.ConversationInclude;
type Conv = Prisma.ConversationGetPayload<{ include: typeof CONV_INCLUDE }>;

/**
 * Scoped messaging (docs/02-buyer.md, docs/03-seller.md): a conversation joins one buyer and one
 * seller workspace, optionally about one RFQ. Only participants with the messaging capability
 * can read; sending also needs an approved, trading workspace (A12). There is no company search:
 * a buyer starts from a public storefront, a seller only from an RFQ visible to it.
 */
@Injectable()
export class ConversationService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly limits: RateLimitService,
  ) {}

  private async ctx(user: User, ws: string) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws);
    // Reading history needs the messaging role; trading eligibility is checked when sending.
    if (!can({ ...ctx, eligible: true }, 'messaging'))
      throw new ApiError('FORBIDDEN', 'common.forbidden');
    return ctx;
  }

  private side(ctx: WorkspaceContext): 'BUYER' | 'SELLER' {
    return ctx.workspace.kind;
  }

  private async load(ctx: WorkspaceContext, id: string): Promise<Conv> {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const where =
      this.side(ctx) === 'BUYER'
        ? { id, buyerWorkspaceId: ctx.workspace.id }
        : { id, sellerWorkspaceId: ctx.workspace.id };
    const c = await this.prisma.conversation.findFirst({ where, include: CONV_INCLUDE });
    if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
    return c;
  }

  private async unreadFor(userId: string, ids: string[]): Promise<Map<string, number>> {
    if (ids.length === 0) return new Map();
    const rows = await this.prisma.$queryRaw<{ id: string; n: number }[]>`
      SELECT c.id, count(m.id)::int AS n
        FROM conversations c
        JOIN messages m ON m.conversation_id = c.id AND m.sender_id <> ${userId}::uuid
        LEFT JOIN read_receipts rr ON rr.conversation_id = c.id AND rr.user_id = ${userId}::uuid
       WHERE c.id = ANY(${ids}::uuid[]) AND (rr.last_read_at IS NULL OR m.created_at > rr.last_read_at)
       GROUP BY c.id`;
    return new Map(rows.map((r) => [r.id, r.n]));
  }

  private async map(ctx: WorkspaceContext, userId: string, c: Conv, unread?: number) {
    const mine = this.side(ctx);
    const other = mine === 'BUYER' ? c.sellerWorkspace : c.buyerWorkspace;
    const last = await this.prisma.message.findFirst({
      where: { conversationId: c.id },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
    return {
      id: c.id,
      counterpart: { workspace_id: other.id, company_name: other.company.displayName },
      my_side: mine,
      my_workspace_id: ctx.workspace.id,
      rfq: c.rfq ? { id: c.rfq.id, number: c.rfq.number, title: c.rfq.title } : null,
      last_message: last
        ? {
            body: last.body,
            created_at: last.createdAt.toISOString(),
            mine: last.senderId === userId,
          }
        : null,
      unread: unread ?? (await this.unreadFor(userId, [c.id])).get(c.id) ?? 0,
      last_message_at: c.lastMessageAt.toISOString(),
    };
  }

  async list(user: User, ws: string, cursor?: string) {
    const ctx = await this.ctx(user, ws);
    const cur = decodeCursor(cursor);
    const field = this.side(ctx) === 'BUYER' ? 'buyerWorkspaceId' : 'sellerWorkspaceId';
    const rows = await this.prisma.conversation.findMany({
      where: {
        [field]: ctx.workspace.id,
        ...(cur
          ? {
              OR: [
                { lastMessageAt: { lt: cur.createdAt } },
                { lastMessageAt: cur.createdAt, id: { lt: cur.id } },
              ],
            }
          : {}),
      },
      include: CONV_INCLUDE,
      orderBy: [{ lastMessageAt: 'desc' }, { id: 'desc' }],
      take: PAGE + 1,
    });
    const items = rows.slice(0, PAGE);
    const unread = await this.unreadFor(
      user.id,
      items.map((c) => c.id),
    );
    const last = items[items.length - 1];
    return {
      items: await Promise.all(items.map((c) => this.map(ctx, user.id, c, unread.get(c.id) ?? 0))),
      next:
        rows.length > PAGE && last
          ? encodeCursor({ createdAt: last.lastMessageAt, id: last.id })
          : null,
    };
  }

  private async sendBlocked(ctx: WorkspaceContext, c: Conv): Promise<string | null> {
    if (!can(ctx, 'messaging'))
      return ctx.eligible ? 'common.forbidden' : (ctx.ineligibleReason ?? 'trading.not_eligible');
    const other = this.side(ctx) === 'BUYER' ? c.sellerWorkspace : c.buyerWorkspace;
    if (other.status !== 'ACTIVE' || other.company.status !== 'APPROVED')
      return 'messages.counterpart_unavailable';
    return null;
  }

  async detail(user: User, ws: string, id: string) {
    const ctx = await this.ctx(user, ws);
    const c = await this.load(ctx, id);
    const blocked = await this.sendBlocked(ctx, c);
    return {
      ...(await this.map(ctx, user.id, c)),
      can_send: !blocked,
      send_blocked_reason: blocked,
    };
  }

  async messages(user: User, ws: string, id: string, cursor?: string) {
    const ctx = await this.ctx(user, ws);
    const c = await this.load(ctx, id);
    const cur = decodeCursor(cursor);
    const rows = await this.prisma.message.findMany({
      where: {
        conversationId: c.id,
        ...(cur
          ? {
              OR: [
                { createdAt: { lt: cur.createdAt } },
                { createdAt: cur.createdAt, id: { lt: cur.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: PAGE + 1,
    });
    const items = rows.slice(0, PAGE);
    const senders = new Map(
      (
        await this.prisma.user.findMany({
          where: { id: { in: [...new Set(items.map((m) => m.senderId))] } },
          select: { id: true, fullName: true },
        })
      ).map((u) => [u.id, u.fullName ?? '']),
    );
    const last = items[items.length - 1];
    return {
      items: items.map((m) => ({
        id: m.id,
        body: m.body,
        file: null,
        sender_name: senders.get(m.senderId) ?? '',
        mine: m.senderId === user.id,
        side: m.senderWorkspaceId === c.buyerWorkspaceId ? ('BUYER' as const) : ('SELLER' as const),
        created_at: m.createdAt.toISOString(),
      })),
      next: rows.length > PAGE && last ? encodeCursor(last) : null,
    };
  }

  private async post(user: User, ctx: WorkspaceContext, c: Conv, body: string, meta: RequestMeta) {
    const mine = this.side(ctx);
    const other = mine === 'BUYER' ? c.sellerWorkspaceId : c.buyerWorkspaceId;
    const m = await this.prisma.$transaction(async (tx) => {
      const m = await tx.message.create({
        data: {
          conversationId: c.id,
          senderId: user.id,
          senderWorkspaceId: ctx.workspace.id,
          body,
        },
      });
      await tx.conversation.update({ where: { id: c.id }, data: { lastMessageAt: m.createdAt } });
      await tx.readReceipt.upsert({
        where: { conversationId_userId: { conversationId: c.id, userId: user.id } },
        create: {
          conversationId: c.id,
          userId: user.id,
          lastReadMessageId: m.id,
          lastReadAt: m.createdAt,
        },
        update: { lastReadMessageId: m.id, lastReadAt: m.createdAt },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'message.sent',
        resourceType: 'conversation',
        resourceId: c.id,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      const roles = mine === 'BUYER' ? SELLER_ACTING_ROLES : BUYER_ACTING_ROLES;
      await notify(
        tx,
        await workspaceRecipients(tx, other, roles),
        c.rfq &&
          mine === 'SELLER' &&
          !(await tx.message.count({ where: { conversationId: c.id, id: { not: m.id } } }))
          ? 'rfq.question'
          : 'message.new',
        {
          conversation_id: c.id,
          company: ctx.company.displayName,
          rfq_number: c.rfq?.number ?? null,
          workspace_id: other,
        },
        { path: `/app/messages/${other}/${c.id}`, webOrigin: this.env.WEB_ORIGIN },
      );
      return m;
    });
    return m;
  }

  async start(
    user: User,
    ws: string,
    b: z.infer<typeof conversationStartRequest>,
    meta: RequestMeta,
  ) {
    const ctx = await this.ctx(user, ws);
    requireCap(ctx, 'messaging');
    await this.limits.consume('message_user', user.id);
    let buyerWs: string;
    let sellerWs: string;
    let rfqId: string | null = null;
    if (ctx.workspace.kind === 'BUYER') {
      if (!b.storefront_id)
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
          storefront_id: 'required',
        });
      const s = await this.prisma.storefront.findUnique({ where: { id: b.storefront_id } });
      if (
        !s ||
        !(await isPublicSeller(this.prisma, s.sellerWorkspaceId)) ||
        s.companyId === ctx.company.id
      )
        throw new ApiError('NOT_FOUND', 'common.not_found');
      buyerWs = ctx.workspace.id;
      sellerWs = s.sellerWorkspaceId;
      if (b.rfq_id) {
        const r = await this.prisma.rfq.findFirst({
          where: { id: b.rfq_id, buyerWorkspaceId: buyerWs },
        });
        if (!r || r.state === 'DRAFT') throw new ApiError('NOT_FOUND', 'common.not_found');
        rfqId = r.id;
      }
    } else {
      if (!b.rfq_id)
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', { rfq_id: 'required' });
      const r = await this.prisma.rfq.findUnique({ where: { id: b.rfq_id } });
      if (!r) throw new ApiError('NOT_FOUND', 'common.not_found');
      const access = await sellerAccess(this.prisma, r, ctx);
      if (!access.visible) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (r.state !== 'OPEN' && !access.quoteId) throw new ApiError('CONFLICT', 'rfq.not_open');
      buyerWs = r.buyerWorkspaceId;
      sellerWs = ctx.workspace.id;
      rfqId = r.id;
    }
    const existing = await this.prisma.conversation.findFirst({
      where: { buyerWorkspaceId: buyerWs, sellerWorkspaceId: sellerWs, rfqId },
    });
    let id = existing?.id;
    if (!id) {
      try {
        id = (
          await this.prisma.conversation.create({
            data: { buyerWorkspaceId: buyerWs, sellerWorkspaceId: sellerWs, rfqId },
          })
        ).id;
      } catch (err) {
        if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002'))
          throw err;
        id = (
          await this.prisma.conversation.findFirstOrThrow({
            where: { buyerWorkspaceId: buyerWs, sellerWorkspaceId: sellerWs, rfqId },
          })
        ).id;
      }
    }
    const c = await this.load(ctx, id);
    await this.post(user, ctx, c, b.body, meta);
    return this.detail(user, ws, id);
  }

  async send(user: User, ws: string, id: string, body: string, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws);
    await this.limits.consume('message_user', user.id);
    const c = await this.load(ctx, id);
    const blocked = await this.sendBlocked(ctx, c);
    if (blocked)
      throw new ApiError(
        blocked === 'messages.counterpart_unavailable' ? 'CONFLICT' : 'FORBIDDEN',
        blocked,
      );
    const m = await this.post(user, ctx, c, body, meta);
    return {
      id: m.id,
      body: m.body,
      file: null,
      sender_name: user.fullName ?? '',
      mine: true,
      side: this.side(ctx),
      created_at: m.createdAt.toISOString(),
    };
  }

  async read(user: User, ws: string, id: string, lastMessageId: string) {
    const ctx = await this.ctx(user, ws);
    const c = await this.load(ctx, id);
    const m = await this.prisma.message.findFirst({
      where: { id: lastMessageId, conversationId: c.id },
    });
    if (!m) throw new ApiError('NOT_FOUND', 'common.not_found');
    const prior = await this.prisma.readReceipt.findUnique({
      where: { conversationId_userId: { conversationId: c.id, userId: user.id } },
    });
    // Never move the read marker backwards.
    if (!prior?.lastReadAt || prior.lastReadAt.getTime() < m.createdAt.getTime())
      await this.prisma.readReceipt.upsert({
        where: { conversationId_userId: { conversationId: c.id, userId: user.id } },
        create: {
          conversationId: c.id,
          userId: user.id,
          lastReadMessageId: m.id,
          lastReadAt: m.createdAt,
        },
        update: { lastReadMessageId: m.id, lastReadAt: m.createdAt },
      });
    return { ok: true as const };
  }
}
