import { Prisma, toIsoDate, type PrismaClient, type Tx } from '@app/db';
import { ApiError } from '../common/api-error';
import type { WorkspaceContext } from './access';

export const VERSION_INCLUDE = {
  files: { include: { file: true }, orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.QuoteVersionInclude;

export const QUOTE_INCLUDE = {
  versions: { include: VERSION_INCLUDE, orderBy: { version: 'desc' as const } },
  sellerWorkspace: { include: { company: true, storefront: true } },
} satisfies Prisma.QuoteInclude;

export const RFQ_INCLUDE = {
  category: true,
  buyerWorkspace: { include: { company: true } },
  invites: {
    include: { sellerWorkspace: { include: { company: true, storefront: true } } },
    orderBy: { createdAt: 'asc' as const },
  },
  files: { include: { file: true }, orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.RfqInclude;

export type RfqFull = Prisma.RfqGetPayload<{ include: typeof RFQ_INCLUDE }>;
export type QuoteFull = Prisma.QuoteGetPayload<{ include: typeof QUOTE_INCLUDE }>;
type VersionFull = Prisma.QuoteVersionGetPayload<{ include: typeof VERSION_INCLUDE }>;
type FileRow = {
  id: string;
  originalName: string;
  mime: string;
  bytes: number;
  scanState: string;
  createdAt: Date;
};

export const mapFile = (f: FileRow) => ({
  id: f.id,
  name: f.originalName,
  mime: f.mime,
  bytes: f.bytes,
  scan_state: f.scanState as 'PENDING' | 'CLEAN' | 'INFECTED',
  created_at: f.createdAt.toISOString(),
});

export function mapVersion(v: VersionFull) {
  return {
    id: v.id,
    version: v.version,
    state: v.state,
    quantity: v.quantity,
    unit: v.unit,
    unit_price_fils: v.unitPriceFils.toString(),
    subtotal_fils: v.subtotalFils.toString(),
    shipping_fils: v.shippingFils.toString(),
    tax_code: v.taxCode,
    tax_bps: v.taxBps,
    tax_fils: v.taxFils.toString(),
    total_fils: v.totalFils.toString(),
    specs: v.specs,
    deviations: v.deviations,
    lead_days: v.leadDays,
    delivery_date: toIsoDate(v.deliveryDate),
    valid_until: v.validUntil.toISOString(),
    terms: v.terms,
    submitted_at: v.submittedAt?.toISOString() ?? null,
    files: v.files.map((f) => mapFile(f.file)),
  };
}

export function sellerParty(ws: {
  id: string;
  company: { displayName: string; emirate: string };
  storefront: { id: string; status: string; adminHiddenAt: Date | null } | null;
}) {
  return {
    workspace_id: ws.id,
    company_name: ws.company.displayName,
    emirate: ws.company.emirate,
    storefront_id:
      ws.storefront && ws.storefront.status === 'PUBLISHED' && !ws.storefront.adminHiddenAt
        ? ws.storefront.id
        : null,
  };
}

/** Whether a newer revision request exists than the current submitted version. */
export function revisionRequested(
  q: QuoteFull,
  events: { quoteId: string | null; kind: string; createdAt: Date }[],
): boolean {
  const cur = q.versions.find((v) => v.id === q.currentVersionId);
  if (!cur || cur.state !== 'SUBMITTED' || !cur.submittedAt) return false;
  return events.some(
    (e) =>
      e.quoteId === q.id &&
      e.kind === 'quote.revision_requested' &&
      e.createdAt.getTime() > cur.submittedAt!.getTime(),
  );
}

export function mapQuote(
  q: QuoteFull,
  events: { quoteId: string | null; kind: string; createdAt: Date }[],
) {
  const current = q.versions.find((v) => v.id === q.currentVersionId) ?? null;
  return {
    id: q.id,
    rfq_id: q.rfqId,
    state: q.state,
    version: q.version,
    seller: sellerParty(q.sellerWorkspace),
    current: current ? mapVersion(current) : null,
    history: q.versions
      .filter((v) => v.id !== q.currentVersionId && v.state !== 'DRAFT')
      .map(mapVersion),
    revision_requested: revisionRequested(q, events),
    created_at: q.createdAt.toISOString(),
    updated_at: q.updatedAt.toISOString(),
  };
}

export function mapSummary(
  r:
    | RfqFull
    | (Omit<RfqFull, 'invites' | 'files' | 'buyerWorkspace'> & { category: RfqFull['category'] }),
  quoteCount: number | null,
) {
  return {
    id: r.id,
    number: r.number,
    title: r.title,
    state: r.state,
    visibility: r.visibility,
    category_id: r.categoryId,
    category_name_en: r.category.nameEn,
    category_name_ar: r.category.nameAr,
    quantity: r.quantity,
    unit: r.unit,
    emirate: r.emirate,
    target_date: toIsoDate(r.targetDate),
    deadline: r.deadline.toISOString(),
    published_at: r.publishedAt?.toISOString() ?? null,
    quote_count: quoteCount,
    created_at: r.createdAt.toISOString(),
  };
}

export function mapEvent(e: {
  id: string;
  kind: string;
  actorSide: string;
  quoteId: string | null;
  quoteVersionId: string | null;
  reason: string | null;
  createdAt: Date;
}) {
  return {
    id: e.id,
    kind: e.kind,
    actor_side: e.actorSide,
    quote_id: e.quoteId,
    quote_version_id: e.quoteVersionId,
    reason: e.reason,
    created_at: e.createdAt.toISOString(),
  };
}

export async function rfqEvent(
  tx: Tx,
  e: {
    rfqId: string;
    kind: string;
    actorSide: 'BUYER' | 'SELLER' | 'SYSTEM' | 'ADMIN';
    actorId?: string | null;
    quoteId?: string | null;
    quoteVersionId?: string | null;
    reason?: string | null;
  },
): Promise<void> {
  await tx.rfqEvent.create({
    data: {
      rfqId: e.rfqId,
      kind: e.kind,
      actorSide: e.actorSide,
      actorId: e.actorId ?? null,
      quoteId: e.quoteId ?? null,
      quoteVersionId: e.quoteVersionId ?? null,
      reason: e.reason ?? null,
    },
  });
}

/** Seller workspace is listed publicly (published storefront of a trading-eligible seller). */
export async function isPublicSeller(prisma: Tx, sellerWorkspaceId: string): Promise<boolean> {
  const r = await prisma.$queryRaw<{ n: number }[]>`
    SELECT count(*)::int AS n FROM marketplace_suppliers WHERE seller_workspace_id = ${sellerWorkspaceId}::uuid`;
  return (r[0]?.n ?? 0) > 0;
}

/**
 * Pool eligibility (docs/09-workflows.md, provisional rule recorded in the status file): the
 * seller is publicly listed and has at least one public product in the RFQ's top-level category.
 */
export async function poolEligible(
  prisma: Tx,
  sellerWorkspaceId: string,
  categoryId: string,
): Promise<boolean> {
  const r = await prisma.$queryRaw<{ n: number }[]>`
    SELECT count(*)::int AS n
      FROM marketplace_suppliers s
     WHERE s.seller_workspace_id = ${sellerWorkspaceId}::uuid
       AND EXISTS (
         SELECT 1 FROM marketplace_products mp
           JOIN categories rc ON rc.id = ${categoryId}::uuid
          WHERE mp.seller_workspace_id = s.seller_workspace_id
            AND COALESCE(mp.parent_category_id, mp.category_id) = COALESCE(rc.parent_id, rc.id))`;
  return (r[0]?.n ?? 0) > 0;
}

/** Seller workspaces eligible for a POOL RFQ in the category (other companies only). */
export async function poolSellerWorkspaces(
  prisma: Tx,
  categoryId: string,
  excludeCompanyId: string,
  limit = 500,
): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT DISTINCT s.seller_workspace_id AS id
      FROM marketplace_suppliers s
      JOIN marketplace_products mp ON mp.seller_workspace_id = s.seller_workspace_id
      JOIN categories rc ON rc.id = ${categoryId}::uuid
     WHERE COALESCE(mp.parent_category_id, mp.category_id) = COALESCE(rc.parent_id, rc.id)
       AND s.company_id <> ${excludeCompanyId}::uuid
     LIMIT ${limit}`;
  return rows.map((r) => r.id);
}

export interface SellerAccess {
  invited: boolean;
  quoteId: string | null;
  /** Seller may open the RFQ at all. */
  visible: boolean;
  /** Message key when a new quote or revision cannot be sent now. */
  quoteBlocked: string | null;
}

/**
 * What a seller workspace may do with an RFQ (T19): hidden, own-company and non-invited private
 * RFQs are invisible (404). A seller who already quoted keeps read access after closing.
 */
export async function sellerAccess(
  prisma: Tx,
  rfq: {
    id: string;
    state: string;
    visibility: string;
    deadline: Date;
    categoryId: string;
    buyerCompanyId: string;
    adminHiddenAt: Date | null;
  },
  ctx: WorkspaceContext,
  now = new Date(),
): Promise<SellerAccess> {
  const none = { invited: false, quoteId: null, visible: false, quoteBlocked: 'common.not_found' };
  if (rfq.adminHiddenAt || rfq.buyerCompanyId === ctx.company.id || rfq.state === 'DRAFT')
    return none;
  const [invite, quote] = await Promise.all([
    prisma.rfqInvite.findUnique({
      where: { rfqId_sellerWorkspaceId: { rfqId: rfq.id, sellerWorkspaceId: ctx.workspace.id } },
    }),
    prisma.quote.findUnique({
      where: { rfqId_sellerWorkspaceId: { rfqId: rfq.id, sellerWorkspaceId: ctx.workspace.id } },
      select: { id: true, state: true },
    }),
  ]);
  const invited = !!invite;
  const open = rfq.state === 'OPEN' && rfq.deadline.getTime() > now.getTime();
  let visible = !!quote;
  if (!visible && open) {
    visible =
      invited ||
      (rfq.visibility === 'POOL' && (await poolEligible(prisma, ctx.workspace.id, rfq.categoryId)));
  }
  if (!visible) return none;
  let quoteBlocked: string | null = null;
  if (!ctx.eligible) quoteBlocked = ctx.ineligibleReason ?? 'trading.not_eligible';
  else if (rfq.state !== 'OPEN') quoteBlocked = 'rfq.not_open';
  else if (!open) quoteBlocked = 'rfq.deadline_passed';
  return { invited, quoteId: quote?.id ?? null, visible: true, quoteBlocked };
}

export async function nextRfqNumber(tx: Tx): Promise<string> {
  const r = await tx.$queryRaw<{ n: bigint }[]>`SELECT nextval('rfq_number_seq') AS n`;
  return `RFQ-${String(r[0]!.n).padStart(6, '0')}`;
}

/** Lock the RFQ row for the rest of the transaction (award guard, docs/06-data.md). */
export async function lockRfq(tx: Tx, rfqId: string): Promise<void> {
  const r = await tx.$queryRaw<
    { id: string }[]
  >`SELECT id FROM rfqs WHERE id = ${rfqId}::uuid FOR UPDATE`;
  if (r.length === 0) throw new ApiError('NOT_FOUND', 'common.not_found');
}

export function dateOnly(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

export type Db = PrismaClient;
