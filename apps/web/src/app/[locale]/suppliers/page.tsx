'use client';
import type { CategoryNode, SupplierCard } from '@app/contracts';
import { BUSINESS_TYPES } from '@app/contracts';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, type FormEvent } from 'react';
import { useT } from '@/components/app-context';
import { SupplierCardView, useLocalized } from '@/components/catalog-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { Button, Empty, PageHeader, Pager, Skeleton } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';

const EMIRATES = [
  'ABU_DHABI',
  'DUBAI',
  'SHARJAH',
  'AJMAN',
  'UMM_AL_QUWAIN',
  'RAS_AL_KHAIMAH',
  'FUJAIRAH',
] as const;
const PASS = [
  'q',
  'category_id',
  'emirate',
  'business_type',
  'custom',
  'private_label',
  'white_label',
  'samples',
  'cursor',
];

function Directory() {
  const t = useT();
  const L = useLocalized();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const params = useSearchParams();
  const get = (k: string) => params?.get(k) ?? '';
  const query: Record<string, string> = {};
  for (const k of PASS) if (get(k)) query[k] = get(k);
  const { state, reload } = useResource<{ items: SupplierCard[]; total: number }>(
    '/marketplace/suppliers',
    query,
  );
  const cats = useResource<CategoryNode[]>('/marketplace/categories');
  const btypes = new Set(get('business_type').split(',').filter(Boolean));

  const push = (next: Record<string, string | null>) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) sp.set(k, v);
    const s = sp.toString();
    router.push(s ? `${pathname}?${s}` : pathname);
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const s = (k: string) => String(fd.get(k) ?? '').trim() || null;
    push({
      q: s('q'),
      category_id: s('category_id'),
      emirate: s('emirate'),
      business_type: fd.getAll('business_type').map(String).join(',') || null,
      custom: fd.get('custom') ? 'true' : null,
      private_label: fd.get('private_label') ? 'true' : null,
      white_label: fd.get('white_label') ? 'true' : null,
      samples: fd.get('samples') ? 'true' : null,
    });
  };
  const current = Object.fromEntries(
    PASS.filter((k) => k !== 'cursor').map((k) => [k, get(k) || null]),
  );

  return (
    <>
      <PageHeader title={t('sup.directory')} />
      <form className="card filter-bar" onSubmit={submit} key={params?.toString()}>
        <div className="field">
          <label htmlFor="s-q">{t('mkt.search')}</label>
          <input id="s-q" name="q" type="search" maxLength={100} defaultValue={get('q')} />
        </div>
        <div className="field">
          <label htmlFor="s-cat">{t('mkt.filter.category')}</label>
          <select id="s-cat" name="category_id" defaultValue={get('category_id')}>
            <option value="">{t('mkt.filter.any')}</option>
            {cats.state.status === 'ready'
              ? cats.state.data.map((c) => (
                  <option key={c.id} value={c.id}>
                    {L(c.name_en, c.name_ar)}
                  </option>
                ))
              : null}
          </select>
        </div>
        <div className="field">
          <label htmlFor="s-em">{t('mkt.filter.emirate')}</label>
          <select id="s-em" name="emirate" defaultValue={get('emirate')}>
            <option value="">{t('mkt.filter.any')}</option>
            {EMIRATES.map((e) => (
              <option key={e} value={e}>
                {t(`emirate.${e}` as MessageKey)}
              </option>
            ))}
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
          {(
            [
              ['custom', 'mkt.custom'],
              ['private_label', 'mkt.private_label'],
              ['white_label', 'mkt.white_label'],
              ['samples', 'mkt.samples'],
            ] as [string, MessageKey][]
          ).map(([k, l]) => (
            <label key={k} className="check">
              <input type="checkbox" name={k} value="true" defaultChecked={get(k) === 'true'} />
              {t(l)}
            </label>
          ))}
        </fieldset>
        <div className="actions">
          <Button type="submit">{t('mkt.apply')}</Button>
          <Button type="button" variant="secondary" onClick={() => router.push(pathname)}>
            {t('mkt.clear_all')}
          </Button>
        </div>
      </form>
      <Resource state={state} reload={reload} lines={6}>
        {(d, next) =>
          d.items.length === 0 ? (
            <Empty>{t('sup.empty')}</Empty>
          ) : (
            <>
              <p className="muted" role="status">
                {t('mkt.results_count', { count: d.total })}
              </p>
              <ul className="sgrid">
                {d.items.map((s) => (
                  <SupplierCardView key={s.id} s={s} />
                ))}
              </ul>
              <Pager
                hasPrev={!!get('cursor')}
                nextCursor={next}
                onFirst={() => push(current)}
                onNext={(c) => push({ ...current, cursor: c })}
              />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function SuppliersPage() {
  return (
    <MarketShell>
      <Suspense fallback={<Skeleton lines={6} />}>
        <Directory />
      </Suspense>
    </MarketShell>
  );
}
