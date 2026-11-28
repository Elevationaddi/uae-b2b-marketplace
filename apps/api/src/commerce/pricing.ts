import { createHash } from 'node:crypto';
import {
  bpsOf,
  priceForQuantity,
  type CartLine,
  type DeliveryRate,
  type OrderTaxCode,
} from '@app/contracts';
import { parseDeliveryRates } from '../catalog/mappers';
import type { Address, Emirate, Tx } from '@app/db';
import { addressSnapshot } from './address.service';
import { supplierVat, taxRuleFor, type SupplierVat, type TaxSettings } from './tax';

/** One priced cart line with the internal ids checkout needs. */
export interface PricedLine extends CartLine {
  seller_workspace_id: string;
  seller_company_id: string;
  unit_price: bigint | null;
}

export interface SellerGroup {
  seller: { workspace_id: string; company_name: string; storefront_id: string | null };
  seller_company_id: string;
  /** C-10: per-emirate delivery rates; FD-08: free buyer collection. */
  delivery: { rates: DeliveryRate[] };
  collection: {
    enabled: boolean;
    emirate: Emirate | null;
    days: number | null;
    instructions_en: string | null;
    instructions_ar: string | null;
  };
  vat: SupplierVat;
  returnPolicy: { en: string | null; ar: string | null } | null;
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
        delivery: { rates: parseDeliveryRates(sf?.deliveryRates) },
        collection: {
          enabled: !!sf?.collectionEnabled && !!sf.collectionEmirate,
          emirate: sf?.collectionEmirate ?? null,
          days: sf?.collectionDays ?? null,
          instructions_en: sf?.collectionInstructionsEn ?? null,
          instructions_ar: sf?.collectionInstructionsAr ?? null,
        },
        vat: supplierVat(w.company),
        returnPolicy:
          sf && (sf.returnPolicyEn || sf.returnPolicyAr)
            ? { en: sf.returnPolicyEn, ar: sf.returnPolicyAr }
            : null,
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

export type DeliveryChoice = 'DELIVERY' | 'COLLECTION';

export interface PreviewGroup {
  group: SellerGroup;
  method: DeliveryChoice;
  /** The rate for the buyer's emirate, when the supplier delivers there. */
  rate: DeliveryRate | null;
  shipping: bigint;
  tax: bigint;
  taxBps: number;
  taxCode: OrderTaxCode;
  provisional: boolean;
  total: bigint;
  issue:
    | 'no_delivery_terms'
    | 'emirate_not_served'
    | 'collection_unavailable'
    | 'supplier_vat_unconfirmed'
    | null;
}

/**
 * Checkout totals per seller (C-10, P4-2, F05): the supplier's delivery fee for the buyer's emirate,
 * or nothing when the buyer collects (FD-08); VAT on merchandise plus delivery at the supplier's
 * rule (see tax.ts), half-up per order. The hash covers every priced input and the chosen methods,
 * so checkout creation can refuse with 409 when anything changed after the buyer reviewed it (T12).
 */
export function buildPreview(
  groups: SellerGroup[],
  address: Address,
  settings: TaxSettings,
  methods: Record<string, DeliveryChoice> = {},
) {
  const out: PreviewGroup[] = groups.map((g) => {
    const method = methods[g.seller.workspace_id] ?? 'DELIVERY';
    const rate = g.delivery.rates.find((r) => r.emirate === address.emirate) ?? null;
    let issue: PreviewGroup['issue'] = null;
    if (method === 'COLLECTION') {
      if (!g.collection.enabled) issue = 'collection_unavailable';
    } else if (g.delivery.rates.length === 0) issue = 'no_delivery_terms';
    else if (!rate) issue = 'emirate_not_served';
    const rule = taxRuleFor(settings, g.vat);
    if (!rule.ok && issue === null) issue = rule.reason;
    const taxBps = rule.ok ? rule.bps : 0;
    const shipping = method === 'DELIVERY' && rate ? BigInt(rate.fee_fils) : 0n;
    const tax = bpsOf(g.merchandise + shipping, taxBps);
    return {
      group: g,
      method,
      rate,
      shipping,
      tax,
      taxBps,
      taxCode: rule.ok ? rule.code : 'STANDARD',
      provisional: rule.ok ? rule.provisional : false,
      total: g.merchandise + shipping + tax,
      issue,
    };
  });
  const sum = (f: (p: PreviewGroup) => bigint) => out.reduce((a, p) => a + f(p), 0n);
  const blocked =
    out.length === 0 ||
    out.some((p) => p.issue !== null || p.group.lines.some((l) => l.issue !== null));
  const hash = createHash('sha256')
    .update(
      JSON.stringify({
        a: [address.id, address.emirate, address.updatedAt.toISOString()],
        t: settings.treatment,
        g: out.map((p) => ({
          s: p.group.seller.workspace_id,
          x: [p.taxCode, p.taxBps, p.issue],
          m: [p.method, p.rate?.days ?? null, p.group.collection.emirate],
          r: p.group.returnPolicy,
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
    taxBps: out.length > 0 && out.every((p) => p.taxBps === out[0]!.taxBps) ? out[0]!.taxBps : null,
    provisional: settings.treatment === 'provisional_standard',
    address: addressSnapshot(address),
  };
}
