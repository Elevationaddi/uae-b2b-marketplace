import type { NotificationType } from '@app/contracts';
import { enqueueEmail, type Prisma, type Tx } from '@app/db';

type Payload = Record<string, string | number | null>;

/** Which email opt-in governs a notification type (in-app is always on). */
function emailCategory(type: NotificationType): 'rfqs' | 'quotes' | 'messages' | 'support' {
  // Support replies answer a request the user made: always emailed, never marketing.
  if (type.startsWith('support.')) return 'support';
  if (
    type.startsWith('quote.') ||
    type.startsWith('order.') ||
    type.startsWith('dispute.') ||
    type.startsWith('payout.')
  )
    return 'quotes';
  if (type.startsWith('message.')) return 'messages';
  return 'rfqs';
}

const SUMMARY: Record<
  NotificationType,
  { en: (p: Payload) => string; ar: (p: Payload) => string }
> = {
  'rfq.invited': {
    en: (p) => `You are invited to quote on ${p.rfq_number}`,
    ar: (p) => `تمت دعوتك لتقديم عرض سعر على ${p.rfq_number}`,
  },
  'rfq.matched': {
    en: (p) => `New request for quotation in your category: ${p.rfq_number}`,
    ar: (p) => `طلب عرض سعر جديد في فئتك: ${p.rfq_number}`,
  },
  'rfq.question': {
    en: (p) => `New question on ${p.rfq_number}`,
    ar: (p) => `سؤال جديد على ${p.rfq_number}`,
  },
  'rfq.cancelled': {
    en: (p) => `${p.rfq_number} was cancelled by the buyer`,
    ar: (p) => `ألغى المشتري ${p.rfq_number}`,
  },
  'rfq.expired': {
    en: (p) => `${p.rfq_number} has closed`,
    ar: (p) => `تم إغلاق ${p.rfq_number}`,
  },
  'rfq.awarded_other': {
    en: (p) => `${p.rfq_number} was awarded to another supplier`,
    ar: (p) => `تمت ترسية ${p.rfq_number} على مورد آخر`,
  },
  'quote.submitted': {
    en: (p) => `New quotation on ${p.rfq_number} from ${p.company}`,
    ar: (p) => `عرض سعر جديد على ${p.rfq_number} من ${p.company}`,
  },
  'quote.revised': {
    en: (p) => `Revised quotation on ${p.rfq_number} from ${p.company}`,
    ar: (p) => `عرض سعر معدل على ${p.rfq_number} من ${p.company}`,
  },
  'quote.withdrawn': {
    en: (p) => `${p.company} withdrew its quotation on ${p.rfq_number}`,
    ar: (p) => `سحب ${p.company} عرض السعر على ${p.rfq_number}`,
  },
  'quote.revision_requested': {
    en: (p) => `The buyer asked for a revised quotation on ${p.rfq_number}`,
    ar: (p) => `طلب المشتري عرض سعر معدلاً على ${p.rfq_number}`,
  },
  'quote.declined': {
    en: (p) => `Your quotation on ${p.rfq_number} was declined`,
    ar: (p) => `تم رفض عرض السعر الخاص بك على ${p.rfq_number}`,
  },
  'quote.accepted': {
    en: (p) => `Your quotation on ${p.rfq_number} was accepted`,
    ar: (p) => `تم قبول عرض السعر الخاص بك على ${p.rfq_number}`,
  },
  'quote.expired': {
    en: (p) => `A quotation on ${p.rfq_number} expired`,
    ar: (p) => `انتهت صلاحية عرض سعر على ${p.rfq_number}`,
  },
  'message.new': {
    en: (p) => `New message from ${p.company}`,
    ar: (p) => `رسالة جديدة من ${p.company}`,
  },
  'order.paid': {
    en: (p) => `Payment confirmed for ${p.order_number}`,
    ar: (p) => `تم تأكيد الدفع للطلب ${p.order_number}`,
  },
  'order.received': {
    en: (p) => `New paid order ${p.order_number}`,
    ar: (p) => `طلب مدفوع جديد ${p.order_number}`,
  },
  'order.cancelled': {
    en: (p) => `${p.order_number} was cancelled`,
    ar: (p) => `تم إلغاء الطلب ${p.order_number}`,
  },
  'order.payment_due': {
    en: (p) => `Payment is due for ${p.order_number}`,
    ar: (p) => `الدفع مستحق للطلب ${p.order_number}`,
  },
  'order.dispatched': {
    en: (p) => `${p.order_number} has been dispatched`,
    ar: (p) => `تم شحن الطلب ${p.order_number}`,
  },
  'order.delivered': {
    en: (p) => `The supplier reported ${p.order_number} as delivered`,
    ar: (p) => `أبلغ المورد بتسليم الطلب ${p.order_number}`,
  },
  'order.completed': {
    en: (p) => `The buyer confirmed receipt of ${p.order_number}`,
    ar: (p) => `أكد المشتري استلام الطلب ${p.order_number}`,
  },
  'order.auto_completed': {
    en: (p) => `${p.order_number} was completed automatically after the dispute window ended`,
    ar: (p) => `اكتمل الطلب ${p.order_number} تلقائيًا بعد انتهاء فترة النزاع`,
  },
  'order.refunded': {
    en: (p) => `A refund was confirmed for ${p.order_number}`,
    ar: (p) => `تم تأكيد استرداد مبلغ للطلب ${p.order_number}`,
  },
  'dispute.opened': {
    en: (p) => `A dispute was opened on ${p.order_number}`,
    ar: (p) => `تم فتح نزاع على الطلب ${p.order_number}`,
  },
  'dispute.updated': {
    en: (p) => `Dispute ${p.dispute_number} was updated`,
    ar: (p) => `تم تحديث النزاع ${p.dispute_number}`,
  },
  'payout.paid': {
    en: (p) => `Payout ${p.payout_number} was paid by the provider`,
    ar: (p) => `دفع مزود الدفع التحويل ${p.payout_number}`,
  },
  'payout.failed': {
    en: (p) => `Payout ${p.payout_number} failed at the provider`,
    ar: (p) => `فشل التحويل ${p.payout_number} لدى مزود الدفع`,
  },
  'support.replied': {
    en: (p) => `Platform support replied to ${p.ticket_number}`,
    ar: (p) => `رد فريق دعم المنصة على ${p.ticket_number}`,
  },
  'support.resolved': {
    en: (p) => `${p.ticket_number} was marked resolved`,
    ar: (p) => `تم وضع علامة "تم الحل" على ${p.ticket_number}`,
  },
};

/** Active members of a workspace holding one of the roles (notification recipients). */
export async function workspaceRecipients(
  tx: Tx,
  workspaceId: string,
  roles: readonly string[],
  excludeUserId?: string,
): Promise<string[]> {
  const rows = await tx.membership.findMany({
    where: {
      workspaceId,
      status: 'ACTIVE',
      role: { in: roles as Prisma.EnumMembershipRoleFilter['in'] },
      user: { status: 'ACTIVE' },
      ...(excludeUserId ? { userId: { not: excludeUserId } } : {}),
    },
    select: { userId: true },
  });
  return [...new Set(rows.map((r) => r.userId))];
}

/**
 * In-app notification for each user, plus an email through the transactional outbox when the
 * user has that category enabled. Call inside the business transaction. The payload holds
 * display data only (references and names), never another party's prices or documents.
 */
export async function notify(
  tx: Tx,
  userIds: string[],
  type: NotificationType,
  payload: Payload,
  opts: { email?: boolean; path: string; webOrigin: string },
): Promise<void> {
  if (userIds.length === 0) return;
  await tx.notification.createMany({
    data: userIds.map((userId) => ({
      userId,
      type,
      // The in-app path (without locale) lets the notification centre link to the resource.
      payload: { ...payload, path: opts.path } as Prisma.InputJsonValue,
    })),
  });
  if (opts.email === false) return;
  const cat = emailCategory(type);
  const users = await tx.user.findMany({
    where: { id: { in: userIds }, status: 'ACTIVE', emailVerifiedAt: { not: null } },
    select: { id: true, email: true, locale: true },
  });
  const prefs = new Map(
    (await tx.notificationPreference.findMany({ where: { userId: { in: userIds } } })).map((p) => [
      p.userId,
      p,
    ]),
  );
  for (const u of users) {
    const p = prefs.get(u.id);
    const on =
      cat === 'rfqs'
        ? (p?.emailRfqs ?? true)
        : cat === 'quotes'
          ? (p?.emailQuotes ?? true)
          : cat === 'messages'
            ? (p?.emailMessages ?? false)
            : true;
    if (!on) continue;
    const locale = u.locale;
    await enqueueEmail(tx, {
      template: 'activity',
      to: u.email,
      locale,
      vars: {
        summary: SUMMARY[type][locale](payload),
        url: `${opts.webOrigin}/${locale}${opts.path}`,
      },
    });
  }
}
