'use client';
import type { CategoryNode, SearchResponse } from '@app/contracts';
import { BUSINESS_TYPES, filsToDecimal, MARKETPLACE_SORTS, parseAedToFils } from '@app/contracts';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';
import { useT } from './app-context';
import { ProductGrid, useLocalized } from './catalog-ui';
import { useViewer } from './market-shell';
import { Resource } from './resource';
import { Button, Empty, Pager } from './ui';

const EMIRATES = [
  'ABU_DHABI',
  'DUBAI',
  'SHARJAH',
  'AJMAN',
  'UMM_AL_QUWAIN',
  'RAS_AL_KHAIMAH',
  'FUJAIRAH',
] as const;
/** URL parameters the API accepts; everything else in the URL is ignored. */
const PASS = [
  'q',
  'mode',
  'business_type',
  'emirate',
  'price_min',
  'price_max',
  'moq_max',
  'lead_time_max',
  'delivery_max',
  'in_stock',
  'custom',
  'private_label',
  'white_label',
  'samples',
  'attrs',
  'sort',
  'cursor',
  'category_id',
  'storefront_id',
] as const;

/**
 * Product search results driven entirely by the URL, so every filtered view can be shared or
 * bookmarked. Price filters and price sorts are offered to verified users only (A12); the API
 * enforces the same rule.
 */
export function SearchResults({
  fixed,
  categories,
}: {
  fixed?: { category_id?: string; storefront_id?: string };
  categories?: CategoryNode[];
}) {
  const t = useT();
  const L = useLocalized();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const params = useSearchParams();
  const viewer = useViewer();
  const verified = viewer.status === 'user';
  const get = (k: string) => params?.get(k) ?? '';

  const query: Record<string, string> = {};
  for (const k of PASS) {
    const v = get(k);
    if (v) query[k] = v;
  }
  if (fixed?.category_id) query.category_id = fixed.category_id;
  if (fixed?.storefront_id) query.storefront_id = fixed.storefront_id;
  const { state, reload } = useResource<SearchResponse>('/marketplace/products', query);
  const view = get('view') === 'list' ? 'list' : 'grid';
  const [filtersOpen, setFiltersOpen] = useState(false);

  const push = (next: Record<string, string | null>) => {
    const sp = new URLSearchParams(params?.toString() ?? '');
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === '') sp.delete(k);
      else sp.set(k, v);
    }
    if (!('cursor' in next)) sp.delete('cursor');
    const s = sp.toString();
    router.push(s ? `${pathname}?${s}` : pathname);
  };

  const onFilters = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const str = (k: string) => String(fd.get(k) ?? '').trim();
    const money = (k: string) => {
      const v = str(k);
      if (!v) return null;
      const f = parseAedToFils(v);
      return f === null ? null : f.toString();
    };
    const multi = (k: string) => fd.getAll(k).map(String).filter(Boolean).join(',') || null;
    const flag = (k: string) => (fd.get(k) ? 'true' : null);
    push({
      mode: str('mode') || null,
      business_type: multi('business_type'),
      emirate: multi('emirate'),
      moq_max: str('moq_max') || null,
      lead_time_max: str('lead_time_max') || null,
      delivery_max: str('delivery_max') || null,
      in_stock: flag('in_stock'),
      custom: flag('custom'),
      private_label: flag('private_label'),
      white_label: flag('white_label'),
      samples: flag('samples'),
      ...(verified ? { price_min: money('price_min'), price_max: money('price_max') } : {}),
      ...(categories && !fixed?.category_id ? { category_id: str('category_id') || null } : {}),
    });
    setFiltersOpen(false);
  };

  const clearAll = () => {
    const keep = get('q');
    router.push(keep ? `${pathname}?q=${encodeURIComponent(keep)}` : pathname);
  };

  const csv = (k: string) => new Set(get(k).split(',').filter(Boolean));
  const btypes = csv('business_type');
  const ems = csv('emirate');
  const sorts = MARKETPLACE_SORTS.filter((s) => verified || !s.startsWith('price_'));
  const cursor = get('cursor');
  const filterKey = PASS.filter((k) => k !== 'cursor' && k !== 'sort' && k !== 'q')
    .map((k) => get(k))
    .join('|');

  return (
    <div className="search-layout">
      <aside
        className={`search-filters ${filtersOpen ? 'search-filters-open' : ''}`}
        aria-label={t('mkt.filters')}
      >
        <form key={filterKey} onSubmit={onFilters}>
          <h2 className="h3">{t('mkt.filters')}</h2>
          {categories && !fixed?.category_id ? (
            <div className="field">
              <label htmlFor="f-cat">{t('mkt.filter.category')}</label>
              <select id="f-cat" name="category_id" defaultValue={get('category_id')}>
                <option value="">{t('mkt.filter.any')}</option>
                {categories.map((c) => (
                  <optgroup key={c.id} label={L(c.name_en, c.name_ar)}>
                    <option value={c.id}>{L(c.name_en, c.name_ar)}</option>
                    {c.children.map((s) => (
                      <option key={s.id} value={s.id}>
                        {L(s.name_en, s.name_ar)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="f-mode">{t('mkt.filter.mode')}</label>
            <select id="f-mode" name="mode" defaultValue={get('mode')}>
              <option value="">{t('mkt.filter.any')}</option>
              <option value="READY_STOCK">{t('mode.READY_STOCK')}</option>
              <option value="MADE_TO_ORDER">{t('mode.MADE_TO_ORDER')}</option>
            </select>
          </div>
          <fieldset>
            <legend>{t('mkt.filter.supplier_type')}</legend>
            {BUSINESS_TYPES.map((b) => (
              <label key={b} className="check">
                <input
                  type="checkbox"
                  name="business_type"
                  value={b}
                  defaultChecked={btypes.has(b)}
                />
                {t(`btype.${b}` as MessageKey)}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>{t('mkt.filter.emirate')}</legend>
            {EMIRATES.map((e) => (
              <label key={e} className="check">
                <input type="checkbox" name="emirate" value={e} defaultChecked={ems.has(e)} />
                {t(`emirate.${e}` as MessageKey)}
              </label>
            ))}
          </fieldset>
          {verified ? (
            <div className="field-row">
              <div className="field">
                <label htmlFor="f-pmin">{t('mkt.filter.price_min')}</label>
                <input
                  id="f-pmin"
                  name="price_min"
                  inputMode="decimal"
                  defaultValue={get('price_min') ? filsToDecimal(get('price_min')) : ''}
                />
              </div>
              <div className="field">
                <label htmlFor="f-pmax">{t('mkt.filter.price_max')}</label>
                <input
                  id="f-pmax"
                  name="price_max"
                  inputMode="decimal"
                  defaultValue={get('price_max') ? filsToDecimal(get('price_max')) : ''}
                />
              </div>
            </div>
          ) : (
            <p className="muted small">{t('mkt.filter.price_locked')}</p>
          )}
          <div className="field">
            <label htmlFor="f-moq">{t('mkt.filter.moq_max')}</label>
            <input id="f-moq" name="moq_max" type="number" min={0} defaultValue={get('moq_max')} />
          </div>
          <div className="field">
            <label htmlFor="f-lead">{t('mkt.filter.lead_time_max')}</label>
            <input
              id="f-lead"
              name="lead_time_max"
              type="number"
              min={0}
              max={365}
              defaultValue={get('lead_time_max')}
            />
          </div>
          <div className="field">
            <label htmlFor="f-del">{t('mkt.filter.delivery_max')}</label>
            <input
              id="f-del"
              name="delivery_max"
              type="number"
              min={0}
              max={365}
              defaultValue={get('delivery_max')}
            />
          </div>
          <fieldset>
            {(
              [
                ['in_stock', 'mkt.filter.in_stock'],
                ['custom', 'mkt.custom'],
                ['private_label', 'mkt.private_label'],
                ['white_label', 'mkt.white_label'],
                ['samples', 'mkt.samples'],
              ] as [string, MessageKey][]
            ).map(([k, label]) => (
              <label key={k} className="check">
                <input type="checkbox" name={k} value="true" defaultChecked={get(k) === 'true'} />
                {t(label)}
              </label>
            ))}
          </fieldset>
          <p className="muted small">{t('mkt.filter.verified_note')}</p>
          <div className="actions">
            <Button type="submit">{t('mkt.apply')}</Button>
            <Button type="button" variant="secondary" onClick={clearAll}>
              {t('mkt.clear_all')}
            </Button>
          </div>
        </form>
      </aside>

      <div className="results">
        <div className="results-bar">
          <Button
            type="button"
            variant="secondary"
            className="filters-toggle"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            {t('mkt.filters')}
          </Button>
          {state.status === 'ready' ? (
            <p className="muted" role="status" data-testid="results-count">
              {t('mkt.results_count', { count: state.data.total })}
            </p>
          ) : null}
          <label className="inline-field">
            <span>{t('mkt.sort')}</span>
            <select
              value={get('sort') || 'relevance'}
              onChange={(e) => push({ sort: e.target.value })}
            >
              {sorts.map((s) => (
                <option key={s} value={s}>
                  {t(`mkt.sort.${s}` as MessageKey)}
                </option>
              ))}
            </select>
          </label>
          <div className="seg" role="group" aria-label={t('mkt.view_grid')}>
            <button
              type="button"
              aria-pressed={view === 'grid'}
              onClick={() => push({ view: null, cursor })}
            >
              {t('mkt.view_grid')}
            </button>
            <button
              type="button"
              aria-pressed={view === 'list'}
              onClick={() => push({ view: 'list', cursor })}
            >
              {t('mkt.view_list')}
            </button>
          </div>
        </div>
        <Resource state={state} reload={reload} lines={8}>
          {(d, next) =>
            d.items.length === 0 ? (
              <Empty>
                <p>{t('mkt.no_results')}</p>
                <Button type="button" variant="secondary" onClick={clearAll}>
                  {t('mkt.clear_all')}
                </Button>
              </Empty>
            ) : (
              <>
                <ProductGrid items={d.items} view={view} />
                <Pager
                  hasPrev={!!cursor}
                  nextCursor={next}
                  onFirst={() => push({ cursor: null })}
                  onNext={(c) => push({ cursor: c })}
                />
              </>
            )
          }
        </Resource>
      </div>
    </div>
  );
}
