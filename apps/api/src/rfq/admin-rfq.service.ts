import { Inject, Injectable } from '@nestjs/common';
import type { adminRfqQuery } from '@app/contracts';
import { writeAudit, type PrismaClient, type Prisma, type User } from '@app/db';
import type { z } from 'zod';
import { decodeOffset, encodeOffset } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { PRISMA } from '../infra/tokens';
import { lockRfq, mapEvent, mapSummary, rfqEvent } from './rfq-common';

const PAGE = 25;
const INCLUDE = {
  category: true,
  buyerWorkspace: { include: { company: true } },
} satisfies Prisma.RfqInclude;

/**
 * Admin RFQ moderation (docs/04-admin.md): metadata and abuse handling only. Quote prices, terms
 * and attachments stay private to the parties; admins see quote states, not contents.
 */
@Injectable()
export class AdminRfqService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async list(q: z.infer<typeof adminRfqQuery>) {
    const offset = decodeOffset(q.cursor);
    const where: Prisma.RfqWhereInput = {
      ...(q.state ? { state: q.state } : {}),
      ...(q.hidden === 'true' ? { adminHiddenAt: { not: null } } : {}),
      ...(q.hidden === 'false' ? { adminHiddenAt: null } : {}),
      ...(q.q
        ? {
            OR: [
              { title: { contains: q.q, mode: 'insensitive' as const } },
              { number: { contains: q.q, mode: 'insensitive' as const } },
              {
                buyerWorkspace: {
                  company: { displayName: { contains: q.q, mode: 'insensitive' as const } },
                },
              },
            ],
          }
        : {}),
    };
    const rows = await this.prisma.rfq.findMany({
      where,
      include: INCLUDE,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const counts = new Map(
      (
        await this.prisma.quote.groupBy({
          by: ['rfqId'],
          where: { rfqId: { in: rows.map((r) => r.id) }, state: { not: 'DRAFT' } },
          _count: { _all: true },
        })
      ).map((g) => [g.rfqId, g._count._all]),
    );
    return {
      items: rows.slice(0, PAGE).map((r) => ({
        ...mapSummary(r, counts.get(r.id) ?? 0),
        buyer_company_name: r.buyerWorkspace.company.displayName,
        hidden: !!r.adminHiddenAt,
      })),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  async detail(id: string) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const r = await this.prisma.rfq.findUnique({
      where: { id },
      include: {
        ...INCLUDE,
        _count: { select: { invites: true, files: true } },
        quotes: {
          where: { state: { not: 'DRAFT' } },
          include: { sellerWorkspace: { include: { company: true } } },
          orderBy: { createdAt: 'asc' },
        },
        events: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] },
      },
    });
    if (!r) throw new ApiError('NOT_FOUND', 'common.not_found');
    return {
      ...mapSummary(r, r.quotes.length),
      buyer_company_name: r.buyerWorkspace.company.displayName,
      hidden: !!r.adminHiddenAt,
      specs: r.specs,
      hidden_reason: r.adminHiddenReason,
      invitee_count: r._count.invites,
      file_count: r._count.files,
      quotes: r.quotes.map((q) => ({
        id: q.id,
        seller_company_name: q.sellerWorkspace.company.displayName,
        state: q.state,
        version: q.version,
        updated_at: q.updatedAt.toISOString(),
      })),
      events: r.events.map(mapEvent),
    };
  }

  async setHidden(admin: User, id: string, hidden: boolean, reason: string, meta: RequestMeta) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError('NOT_FOUND', 'common.not_found');
    await this.prisma.$transaction(async (tx) => {
      await lockRfq(tx, id);
      const r = await tx.rfq.findUniqueOrThrow({ where: { id } });
      if (hidden === !!r.adminHiddenAt)
        throw new ApiError('CONFLICT', hidden ? 'rfq.already_hidden' : 'rfq.not_hidden');
      await tx.rfq.update({
        where: { id },
        data: hidden
          ? { adminHiddenAt: new Date(), adminHiddenReason: reason, version: { increment: 1 } }
          : { adminHiddenAt: null, adminHiddenReason: null, version: { increment: 1 } },
      });
      await rfqEvent(tx, {
        rfqId: id,
        kind: hidden ? 'rfq.hidden' : 'rfq.unhidden',
        actorSide: 'ADMIN',
        actorId: admin.id,
        reason,
      });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: hidden ? 'admin.rfq.hidden' : 'admin.rfq.unhidden',
        resourceType: 'rfq',
        resourceId: id,
        companyId: r.buyerCompanyId,
        reason,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.detail(id);
  }
}
