import { type Prisma } from '@prisma/client';

/** Helpers shared by payment (Phase 4) and settlement (Phase 5) processing. */
type TxClient = Prisma.TransactionClient;

export const BUYER_ROLES = ['OWNER', 'PROCUREMENT'] as const;
export const SELLER_ORDER_ROLES = ['OWNER', 'SALES', 'WAREHOUSE', 'FINANCE'] as const;

export async function notifyWorkspace(
  tx: TxClient,
  workspaceId: string,
  roles: readonly string[],
  type: string,
  payload: Record<string, string>,
) {
  const members = await tx.membership.findMany({
    where: {
      workspaceId,
      status: 'ACTIVE',
      role: { in: roles as Prisma.EnumMembershipRoleFilter['in'] },
      user: { status: 'ACTIVE' },
    },
    select: { userId: true },
  });
  const ids = [...new Set(members.map((m) => m.userId))];
  if (ids.length === 0) return;
  await tx.notification.createMany({
    data: ids.map((userId) => ({ userId, type, payload: payload as Prisma.InputJsonValue })),
  });
}

export async function openCase(
  tx: TxClient,
  kind:
    | 'LATE_CAPTURE'
    | 'AMOUNT_MISMATCH'
    | 'UNKNOWN_REFERENCE'
    | 'INVALID_SIGNATURE'
    | 'REFUND_FAILED'
    | 'PAYOUT_FAILED',
  ids: { checkoutId?: string; paymentId?: string; paymentEventId?: string },
  details: Record<string, string | null>,
) {
  await tx.reconciliationCase.create({
    data: {
      kind,
      checkoutId: ids.checkoutId ?? null,
      paymentId: ids.paymentId ?? null,
      paymentEventId: ids.paymentEventId ?? null,
      details: details as Prisma.InputJsonValue,
    },
  });
}
