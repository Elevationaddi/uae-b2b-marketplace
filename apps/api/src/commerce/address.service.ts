import { Inject, Injectable } from '@nestjs/common';
import { COMMERCE_LIMITS, type addressRequest } from '@app/contracts';
import { writeAudit, type Address, type PrismaClient, type User } from '@app/db';
import type { z } from 'zod';
import { assertUuid } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { PRISMA } from '../infra/tokens';
import { loadWorkspaceContext, requireCap } from '../rfq/access';

type Body = z.infer<typeof addressRequest>;

export function mapAddress(a: Address) {
  return {
    id: a.id,
    label: a.label,
    recipient: a.recipient,
    phone: a.phone,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    emirate: a.emirate,
    is_default: a.isDefault,
  };
}

export function addressSnapshot(a: Address) {
  const { id: _id, is_default: _d, ...rest } = mapAddress(a);
  return rest;
}

/**
 * Buyer workspace delivery addresses (UAE only, P4-7). Read by any member who can see orders;
 * changed by owner/procurement. Archived instead of deleted so checkouts keep their snapshot.
 */
@Injectable()
export class AddressService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  private async ctx(user: User, ws: string, write: boolean) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'BUYER');
    requireCap(ctx, write ? 'buyer.purchase' : 'buyer.orders.read');
    return ctx;
  }

  async list(user: User, ws: string) {
    const ctx = await this.ctx(user, ws, false);
    const rows = await this.prisma.address.findMany({
      where: { buyerWorkspaceId: ctx.workspace.id, archivedAt: null },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
    return rows.map(mapAddress);
  }

  async create(user: User, ws: string, b: Body, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws, true);
    const a = await this.prisma.$transaction(async (tx) => {
      const count = await tx.address.count({
        where: { buyerWorkspaceId: ctx.workspace.id, archivedAt: null },
      });
      if (count >= COMMERCE_LIMITS.maxAddresses)
        throw new ApiError('CONFLICT', 'address.limit_reached');
      const makeDefault = b.is_default === true || count === 0;
      if (makeDefault)
        await tx.address.updateMany({
          where: { buyerWorkspaceId: ctx.workspace.id },
          data: { isDefault: false },
        });
      const row = await tx.address.create({
        data: {
          buyerWorkspaceId: ctx.workspace.id,
          label: b.label,
          recipient: b.recipient,
          phone: b.phone,
          line1: b.line1,
          line2: b.line2 || null,
          city: b.city,
          emirate: b.emirate,
          isDefault: makeDefault,
        },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'address.created',
        resourceType: 'address',
        resourceId: row.id,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return row;
    });
    return mapAddress(a);
  }

  async update(user: User, ws: string, id: string, b: Body, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws, true);
    const a = await this.own(ctx.workspace.id, id);
    const row = await this.prisma.$transaction(async (tx) => {
      if (b.is_default)
        await tx.address.updateMany({
          where: { buyerWorkspaceId: ctx.workspace.id },
          data: { isDefault: false },
        });
      const r = await tx.address.update({
        where: { id: a.id },
        data: {
          label: b.label,
          recipient: b.recipient,
          phone: b.phone,
          line1: b.line1,
          line2: b.line2 || null,
          city: b.city,
          emirate: b.emirate,
          ...(b.is_default ? { isDefault: true } : {}),
        },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'address.updated',
        resourceType: 'address',
        resourceId: a.id,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return r;
    });
    return mapAddress(row);
  }

  async archive(user: User, ws: string, id: string, meta: RequestMeta) {
    const ctx = await this.ctx(user, ws, true);
    const a = await this.own(ctx.workspace.id, id);
    await this.prisma.$transaction(async (tx) => {
      await tx.address.update({
        where: { id: a.id },
        data: { archivedAt: new Date(), isDefault: false },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'address.archived',
        resourceType: 'address',
        resourceId: a.id,
        companyId: ctx.company.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return { ok: true as const };
  }

  /** Active address of this workspace; anything else is 404. */
  async own(workspaceId: string, id: string) {
    assertUuid(id);
    const a = await this.prisma.address.findFirst({
      where: { id, buyerWorkspaceId: workspaceId, archivedAt: null },
    });
    if (!a) throw new ApiError('NOT_FOUND', 'common.not_found');
    return a;
  }
}
