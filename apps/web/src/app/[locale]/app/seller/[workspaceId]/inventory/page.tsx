'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment, Suspense, useState } from 'react';
import { fieldText, useApp, useT } from '@/components/app-context';
import { useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import {
  Button,
  ConfirmDialog,
  Empty,
  Field,
  PageHeader,
  Pager,
  SelectField,
  Skeleton,
} from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Inv = {
  on_hand: number;
  reserved: number;
  unavailable: number;
  available: number;
  sold: number;
  version: number;
};
type Item = {
  sku_id: string;
  product_id: string;
  code: string;
  variant_attributes: Record<string, string>;
  unit: string;
  title_en: string;
  title_ar: string | null;
  product_status: string;
  mode: string;
  active: boolean;
  approved: boolean;
  inventory: Inv;
  low_stock_threshold: number;
  restock_at: string | null;
  low_stock: boolean;
};
type Movement = {
  id: string;
  kind: string;
  delta_on_hand: number;
  on_hand_after: number;
  reserved_after: number;
  unavailable_after: number;
  reason: string;
  actor_email: string | null;
  created_at: string;
};
const KINDS = [
  'RECEIVE',
  'REMOVE',
  'MARK_UNAVAILABLE',
  'RELEASE_UNAVAILABLE',
  'SET_ON_HAND',
] as const;

function Movements({ ws, item }: { ws: Workspace; item: Item }) {
  const { locale } = useApp();
  const t = useT();
  const [cursor, setCursor] = useState<string | undefined>();
  const { state, reload } = useResource<Movement[]>(
    `${sellerApi(ws)}/inventory/${item.sku_id}/movements`,
    { cursor },
  );
  return (
    <Resource state={state} reload={reload}>
      {(rows, next) =>
        rows.length === 0 ? (
          <p className="muted">{t('common.none')}</p>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table small">
                <thead>
                  <tr>
                    <th scope="col">{t('common.created')}</th>
                    <th scope="col">{t('seller.adjust_kind')}</th>
                    <th scope="col">{t('seller.on_hand')}</th>
                    <th scope="col">{t('seller.unavailable')}</th>
                    <th scope="col">{t('seller.adjust_reason')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m) => (
                    <tr key={m.id}>
                      <td>{formatDubaiTime(m.created_at, locale)}</td>
                      <td>{t(`movement.${m.kind}` as MessageKey)}</td>
                      <td>
                        {m.on_hand_after}{' '}
                        <span className="muted">
                          ({m.delta_on_hand >= 0 ? '+' : ''}
                          {m.delta_on_hand})
                        </span>
                      </td>
                      <td>{m.unavailable_after}</td>
                      <td>
                        {m.reason}
                        {m.actor_email ? (
                          <span className="muted block">{m.actor_email}</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager
              hasPrev={!!cursor}
              nextCursor={next}
              onFirst={() => setCursor(undefined)}
              onNext={setCursor}
            />
          </>
        )
      }
    </Resource>
  );
}

function Inventory({ ws }: { ws: Workspace; base: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const params = useSearchParams();
  const filter = ['low', 'out'].includes(params?.get('filter') ?? '')
    ? params!.get('filter')!
    : 'all';
  const q = params?.get('q') ?? '';
  const cursor = params?.get('cursor') ?? '';
  const { state, reload } = useResource<Item[]>(`${sellerApi(ws)}/inventory`, {
    filter,
    q,
    cursor,
  });
  const [adjust, setAdjust] = useState<Item | null>(null);
  const [settings, setSettings] = useState<Item | null>(null);
  const [history, setHistory] = useState<string | null>(null);
  const [kind, setKind] = useState<(typeof KINDS)[number]>('RECEIVE');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [threshold, setThreshold] = useState('');
  const [restock, setRestock] = useState('');
  const m = useMutation();
  const fe = (k: string) => fieldText(locale, m.error?.fieldErrors[k]);
  const go = (next: Record<string, string>) => {
    const sp = new URLSearchParams({ filter, q, ...next });
    for (const [k, v] of [...sp]) if (!v || (k === 'filter' && v === 'all')) sp.delete(k);
    router.push(sp.toString() ? `${pathname}?${sp}` : pathname);
  };
  const doAdjust = async () => {
    if (!adjust) return;
    const r = await m.run(`${sellerApi(ws)}/inventory/${adjust.sku_id}/adjust`, {
      method: 'POST',
      body: {
        kind,
        quantity: Number(qty),
        reason: reason.trim(),
        ...(kind === 'SET_ON_HAND' ? { expected_version: adjust.inventory.version } : {}),
      },
    });
    if (r.ok) {
      setAdjust(null);
      reload();
    }
  };
  const doSettings = async () => {
    if (!settings) return;
    const r = await m.run(`${sellerApi(ws)}/inventory/${settings.sku_id}`, {
      method: 'PATCH',
      body: { low_stock_threshold: Number(threshold), restock_at: restock || null },
    });
    if (r.ok) {
      setSettings(null);
      reload();
    }
  };
  return (
    <>
      <PageHeader title={t('seller.inventory_title')} />
      <div className="tabs" role="tablist">
        {(['all', 'low', 'out'] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => go({ filter: f, cursor: '' })}
          >
            {t(`seller.filter.${f}` as MessageKey)}
          </button>
        ))}
      </div>
      <form
        role="search"
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          go({ q: String(new FormData(e.currentTarget).get('q') ?? '').trim(), cursor: '' });
        }}
      >
        <label className="sr-only" htmlFor="inv-q">
          {t('seller.search_products')}
        </label>
        <input
          id="inv-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder={t('seller.search_products')}
          maxLength={100}
        />
        <button type="submit" className="btn btn-secondary">
          {t('mkt.search')}
        </button>
      </form>
      <Resource state={state} reload={reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>{t('seller.inventory_empty')}</Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="inventory-table">
                  <thead>
                    <tr>
                      <th scope="col">{t('pd.sku')}</th>
                      <th scope="col">{t('seller.on_hand')}</th>
                      <th scope="col">{t('seller.reserved')}</th>
                      <th scope="col">{t('seller.unavailable')}</th>
                      <th scope="col">{t('seller.available')}</th>
                      <th scope="col">{t('seller.sold')}</th>
                      <th scope="col">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((i) => (
                      <Fragment key={i.sku_id}>
                        <tr>
                          <td>
                            <Link href={`/${locale}/app/seller/${ws.id}/products/${i.product_id}`}>
                              {L(i.title_en, i.title_ar)}
                            </Link>
                            <span className="muted small block">
                              <bdi>{i.code}</bdi>
                              {Object.values(i.variant_attributes).length
                                ? ` · ${Object.values(i.variant_attributes).join(' / ')}`
                                : ''}
                            </span>
                            {i.low_stock ? (
                              <span
                                className={`pill ${i.inventory.available === 0 ? 'pill-warn' : 'pill-info'} small`}
                              >
                                {i.inventory.available === 0
                                  ? t('mkt.out_of_stock')
                                  : t('seller.kpi.low_stock')}
                              </span>
                            ) : null}
                            {i.restock_at ? (
                              <span className="muted small block">
                                {t('seller.restock_at')}: {i.restock_at}
                              </span>
                            ) : null}
                          </td>
                          <td>{i.inventory.on_hand}</td>
                          <td>{i.inventory.reserved}</td>
                          <td>{i.inventory.unavailable}</td>
                          <td>
                            <strong>{i.inventory.available}</strong>
                          </td>
                          <td>{i.inventory.sold}</td>
                          <td>
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => {
                                m.setError(null);
                                setKind('RECEIVE');
                                setQty('');
                                setReason('');
                                setAdjust(i);
                              }}
                            >
                              {t('seller.adjust')}
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => {
                                m.setError(null);
                                setThreshold(String(i.low_stock_threshold));
                                setRestock(i.restock_at ?? '');
                                setSettings(i);
                              }}
                            >
                              {t('seller.save_settings')}
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              aria-expanded={history === i.sku_id}
                              onClick={() => setHistory(history === i.sku_id ? null : i.sku_id)}
                            >
                              {t('seller.movements')}
                            </Button>
                          </td>
                        </tr>
                        {history === i.sku_id ? (
                          <tr>
                            <td colSpan={7}>
                              <Movements ws={ws} item={i} />
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager
                hasPrev={!!cursor}
                nextCursor={next}
                onFirst={() => go({ cursor: '' })}
                onNext={(c) => go({ cursor: c })}
              />
            </>
          )
        }
      </Resource>
      <ConfirmDialog
        open={adjust !== null}
        title={t('seller.adjust')}
        body={adjust ? `${adjust.code} · ${t('seller.on_hand')} ${adjust.inventory.on_hand}` : ''}
        confirmLabel={t('seller.adjust')}
        busy={m.busy}
        error={m.error}
        onConfirm={doAdjust}
        onClose={() => setAdjust(null)}
      >
        <SelectField
          label={t('seller.adjust_kind')}
          value={kind}
          onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}
          options={KINDS.map((k) => ({ value: k, label: t(`movement.${k}` as MessageKey) }))}
        />
        <Field
          label={t('seller.adjust_qty')}
          type="number"
          min={0}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          error={fe('quantity')}
          required
        />
        <Field
          label={t('seller.adjust_reason')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={fe('reason')}
          minLength={3}
          maxLength={300}
          required
        />
      </ConfirmDialog>
      <ConfirmDialog
        open={settings !== null}
        title={t('seller.save_settings')}
        body={settings?.code}
        confirmLabel={t('common.save')}
        busy={m.busy}
        error={m.error}
        onConfirm={doSettings}
        onClose={() => setSettings(null)}
      >
        <Field
          label={t('seller.low_threshold')}
          type="number"
          min={0}
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          error={fe('low_stock_threshold')}
        />
        <Field
          label={t('seller.restock_at')}
          type="date"
          value={restock}
          onChange={(e) => setRestock(e.target.value)}
          optional
        />
      </ConfirmDialog>
    </>
  );
}

export default function InventoryPage() {
  return (
    <SellerShell>
      {(ws, base) => (
        <Suspense fallback={<Skeleton />}>
          <Inventory ws={ws} base={base} />
        </Suspense>
      )}
    </SellerShell>
  );
}
