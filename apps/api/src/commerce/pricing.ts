import { createHash } from 'node:crypto';
import { bpsOf, priceForQuantity, type CartLine } from '@app/contracts';
import type { Address, Emirate, Tx } from '@app/db';
import { addressSnapshot } from './address.service';

/** One priced cart line with the internal ids checkout needs. */
export interface PricedLine extends CartLine {
  seller_workspace_id: string;
  seller_company_id: string;
  unit_price: bigint | null;
}

export interface SellerGroup {
  seller: { workspace_id: string; company_name: string; storefront_id: string | null };
  seller_company_id: string;
  delivery: { fee_fils: string | null; emirates: Emirate[]; days: number | null };
  lines: PricedLine[];
  merchandise: bigint;
}

/**
 * Load and price the buyer workspace's cart from live server data (never client totals, T09/T10).
 * Each line carries an issue when it cannot be bought as-is: the listing left the marketplace,
 * it is not a ready-stock priced item (P4-6), MOQ/increment no longer fit, or stock is short.
 */
export async function loadCart(tx: Tx, buyerWorkspaceId: string): Promise<SellerGroup[]> {
  const items = await tx.cartItem.findMany({
    where: { buyerWorkspaceId },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
  });
  if (items.length === 0) return [];
  const skus = await tx.sku.findMany({
    where: { id: { in: items.map((i) => i.skuId) } },
    include: {
      tiers: { orderBy: { minQty: 'asc' } },
      inventory: true,
      product: { include: { publishedVersion: true } },
    },
  });
  const skuById = new Map(skus.map((s) => [s.id, s]));
  const productIds = [...new Set(skus.map((s) => s.productId))];
  const visible = await tx.$queryRaw<{ id: string; company_name: string; mode: string }[]>`
    SELECT id, company_name, mode::text AS mode FROM marketplace_products
     WHERE id = ANY(${productIds}::uuid[])`;
  const visibleById = new Map(visible.map((v) => [v.id, v]));
  const sellerIds = [...new Set(skus.map((s) => s.sellerWorkspaceId))];
  const workspaces = await tx.workspace.findMany({
    where: { id: { in: sellerIds } },
    include: { company: true, storefront: true },
  });
  const wsById = new Map(workspaces.map((w) => [w.id, w]));

  const groups = new Map<string, SellerGroup>();
  for (const item of items) {
    const sku = skuById.get(item.skuId);
    if (!sku) continue;
    const w = wsById.get(sku.sellerWorkspaceId)!;
    let g = groups.get(w.id);
    if (!g) {
      const sf = w.storefront;
      g = {
        seller: {
          workspace_id: w.id,
          company_name: w.company.displayName,
          storefront_id: sf && sf.status === 'PUBLISHED' && !sf.adminHiddenAt ? sf.id : null,
        },
        seller_company_id: w.companyId,
        delivery: {
          fee_fils: sf?.deliveryFeeFils?.toString() ?? null,
          emirates: sf?.deliveryEmirates ?? [],
          days: sf?.deliveryDays ?? null,
        },
        lines: [],
        merchandise: 0n,
      };
      groups.set(w.id, g);
    }
    const v = sku.product.publishedVersion;
    const listed = visibleById.get(sku.productId);
    const inv = sku.inventory;
    const available = inv ? inv.onHand - inv.reserved - inv.unavailable : 0;
    let issue: CartLine['issue'] = null;
    let unitPrice: bigint | null = null;
    let lineTotal: bigint | null = null;
    if (!listed || !v || !sku.active || !sku.approvedAt) issue = 'unavailable';
    else if (listed.mode !== 'READY_STOCK' || sku.product.priceType === 'QUOTE_ONLY')
      issue = 'not_cart_eligible';
    else {
      const p = priceForQuantity(
        sku.product.priceType,
        {
          moq: sku.moq,
          order_increment: sku.orderIncrement,
          tiers: sku.tiers.map((t) => ({ min_qty: t.minQty, unit_price_fils: t.unitPriceFils })),
        },
        item.quantity,
      );
      if (!p.ok)
        issue =
          p.code === 'MOQ_NOT_MET' ? 'moq' : p.code === 'INCREMENT' ? 'increment' : 'unavailable';
      else {
        unitPrice = p.unitPriceFils;
        lineTotal = p.lineTotalFils;
        if (available < item.quantity) issue = 'insufficient_stock';
      }
    }
    g.lines.push({
      id: item.id,
      sku_id: sku.id,
      product_id: sku.productId,
      title_en: v?.titleEn ?? '',
      title_ar: v?.titleAr ?? null,
      sku_code: sku.code,
      variant_attributes: (sku.variantAttributes ?? {}) as Record<string, string>,
      unit: sku.unit,
      quantity: item.quantity,
      moq: sku.moq,
      order_increment: sku.orderIncrement,
      available: Math.max(0, available),
      unit_price_fils: unitPrice?.toString() ?? null,
      line_total_fils: lineTotal?.toString() ?? null,
      issue,
      seller_workspace_id: w.id,
      seller_company_id: w.companyId,
      unit_price: unitPrice,
    });
    if (lineTotal !== null) g.merchandise += lineTotal;
  }
  return [...groups.values()];
}

export function publicLine(l: PricedLine): CartLine {
  const { seller_workspace_id: _w, seller_company_id: _c, unit_price: _u, ...rest } = l;
  return rest;
}

export interface PreviewGroup {
  group: SellerGroup;
  shipping: bigint;
  tax: bigint;
  total: bigint;
  issue: 'no_delivery_terms' | 'emirate_not_served' | null;
}

/**
 * Checkout totals per seller (P4-1, P4-2): flat seller delivery fee per order, STANDARD tax on
 * merchandise plus shipping, half-up per order. The hash covers every priced input, so checkout
 * creation can refuse with 409 when anything changed after the buyer reviewed it (T12).
 */
export function buildPreview(groups: SellerGroup[], address: Address, taxBps: number) {
  const out: PreviewGroup[] = groups.map((g) => {
    let issue: PreviewGroup['issue'] = null;
    if (g.delivery.fee_fils === null || g.delivery.emirates.length === 0)
      issue = 'no_delivery_terms';
    else if (!g.delivery.emirates.includes(address.emirate)) issue = 'emirate_not_served';
    const shipping = g.delivery.fee_fils === null ? 0n : BigInt(g.delivery.fee_fils);
    const tax = bpsOf(g.merchandise + shipping, taxBps);
    return { group: g, shipping, tax, total: g.merchandise + shipping + tax, issue };
  });
  const sum = (f: (p: PreviewGroup) => bigint) => out.reduce((a, p) => a + f(p), 0n);
  const blocked =
    out.length === 0 ||
    out.some((p) => p.issue !== null || p.group.lines.some((l) => l.issue !== null));
  const hash = createHash('sha256')
    .update(
      JSON.stringify({
        a: [address.id, address.emirate, address.updatedAt.toISOString()],
        t: taxBps,
        g: out.map((p) => ({
          s: p.group.seller.workspace_id,
          f: p.shipping.toString(),
          l: p.group.lines.map((l) => [l.sku_id, l.quantity, l.unit_price_fils, l.issue]),
        })),
      }),
    )
    .digest('hex');
  return {
    groups: out,
    merchandise: sum((p) => p.group.merchandise),
    shipping: sum((p) => p.shipping),
    tax: sum((p) => p.tax),
    total: sum((p) => p.total),
    blocked,
    hash,
    address: addressSnapshot(address),
  };
}
