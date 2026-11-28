import { Inject, Injectable } from '@nestjs/common';
import type { notificationListQuery, notificationPreferencesRequest } from '@app/contracts';
import type { PrismaClient, User } from '@app/db';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import { NEWEST_FIRST, beforeCursor, decodeCursor, page } from '../common/pagination';
import { PRISMA } from '../infra/tokens';

const PAGE = 30;

/** In-app notifications and email preferences; strictly per user. */
@Injectable()
export class NotificationService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async list(user: User, q: z.infer<typeof notificationListQuery>) {
    const rows = await this.prisma.notification.findMany({
      where: {
        userId: user.id,
        ...(q.unread === 'true' ? { readAt: null } : {}),
        ...beforeCursor(decodeCursor(q.cursor)),
      },
      orderBy: NEWEST_FIRST,
      take: PAGE + 1,
    });
    const { items, nextCursor } = page(rows, PAGE);
    return {
      items: items.map((n) => ({
        id: n.id,
        type: n.type,
        payload: n.payload as Record<string, string | number | null>,
        read_at: n.readAt?.toISOString() ?? null,
        created_at: n.createdAt.toISOString(),
      })),
      next: nextCursor,
    };
  }

  async markRead(user: User, id: string) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const n = await this.prisma.notification.updateMany({
      where: { id, userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    if (
      n.count === 0 &&
      !(await this.prisma.notification.count({ where: { id, userId: user.id } }))
    )
      throw new ApiError('NOT_FOUND', 'common.not_found');
    return { ok: true as const };
  }

  async markAllRead(user: User) {
    await this.prisma.notification.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true as const };
  }

  /** Header badge counts: unread notifications and unread messages in the user's workspaces. */
  async unread(user: User) {
    const [notifications, msgs] = await Promise.all([
      this.prisma.notification.count({ where: { userId: user.id, readAt: null } }),
      this.prisma.$queryRaw<{ n: number }[]>`
        SELECT count(m.id)::int AS n
          FROM memberships ms
          JOIN workspaces w ON w.id = ms.workspace_id
          JOIN conversations c ON (w.kind = 'BUYER' AND c.buyer_workspace_id = w.id)
                               OR (w.kind = 'SELLER' AND c.seller_workspace_id = w.id)
          JOIN messages m ON m.conversation_id = c.id AND m.sender_id <> ${user.id}::uuid
          LEFT JOIN read_receipts rr ON rr.conversation_id = c.id AND rr.user_id = ${user.id}::uuid
         WHERE ms.user_id = ${user.id}::uuid AND ms.status = 'ACTIVE'
           AND ms.role IN ('OWNER', 'PROCUREMENT', 'SALES')
           AND (rr.last_read_at IS NULL OR m.created_at > rr.last_read_at)`,
    ]);
    return { notifications, messages: msgs[0]?.n ?? 0 };
  }

  async preferences(user: User) {
    const p = await this.prisma.notificationPreference.findUnique({ where: { userId: user.id } });
    return {
      email_rfqs: p?.emailRfqs ?? true,
      email_quotes: p?.emailQuotes ?? true,
      email_messages: p?.emailMessages ?? false,
      email_marketing: p?.emailMarketing ?? false,
    };
  }

  async updatePreferences(user: User, b: z.infer<typeof notificationPreferencesRequest>) {
    const data = {
      ...(b.email_rfqs !== undefined && { emailRfqs: b.email_rfqs }),
      ...(b.email_quotes !== undefined && { emailQuotes: b.email_quotes }),
      ...(b.email_messages !== undefined && { emailMessages: b.email_messages }),
      // Marketing is opt-in (T36): consent time is recorded; withdrawing clears it.
      ...(b.email_marketing !== undefined && {
        emailMarketing: b.email_marketing,
        marketingConsentAt: b.email_marketing ? new Date() : null,
      }),
    };
    await this.prisma.notificationPreference.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...data },
      update: data,
    });
    return this.preferences(user);
  }
}
