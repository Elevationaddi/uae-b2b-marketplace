'use client';
import type { ProductCard } from '@app/contracts';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useApp, useT } from '@/components/app-context';
import { AvailabilityBadge, MediaImg, PriceLine, useLocalized } from '@/components/catalog-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { ApiErrorAlert, Button, Empty, PageHeader } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type CompareProduct = ProductCard & {
  category_name_en: string;
  category_name_ar: string;
  materials: string | null;
  dimensions: string | null;
  country_of_origin: string | null;
  fulfilment_days: number | null;
  certifications: string[];
  attributes: { key: string; label_en: string; label_ar: string; value: string }[];
};
type Row = { product_id: string; added_at: string; product: CompareProduct | null };

function Compare() {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const { state, reload } = useResource<Row[]>('/marketplace/compare');
  const m = useMutation();
  const remove = async (id: string) => {
    const r = await m.run(`/marketplace/compare/${id}`, { method: 'DELETE' });
    if (r.ok) reload();
  };
  return (
    <>
      <PageHeader title={t('mkt.compare')} />
      <p className="muted small">{t('lists.compare_limit')}</p>
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      <Resource
        state={state}
        reload={reload}
        loginHref={`/${locale}/login?next=${encodeURIComponent(`/${locale}/compare`)}`}
      >
        {(rows) => {
          if (!rows.length) return <Empty>{t('lists.empty_compare')}</Empty>;
          const live = rows.filter((r): r is Row & { product: CompareProduct } => !!r.product);
          const attrKeys = new Map<string, string>();
          for (const r of live)
            for (const a of r.product.attributes) attrKeys.set(a.key, L(a.label_en, a.label_ar));
          const line = (label: string, f: (p: CompareProduct) => ReactNode) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {live.map((r) => (
                <td key={r.product_id}>{f(r.product) ?? '—'}</td>
              ))}
            </tr>
          );
          return (
            <>
              {rows
                .filter((r) => !r.product)
                .map((r) => (
                  <div key={r.product_id} className="alert alert-info">
                    {t('lists.unavailable_item')}{' '}
                    <Button type="button" variant="link" onClick={() => remove(r.product_id)}>
                      {t('lists.remove')}
                    </Button>
                  </div>
                ))}
              {live.length ? (
                <div className="table-wrap">
                  <table className="table compare-table">
                    <thead>
                      <tr>
                        <td />
                        {live.map((r) => (
                          <th key={r.product_id} scope="col">
                            <MediaImg src={r.product.image_url} alt="" className="compare-img" />
                            <Link href={`/${locale}/products/${r.product_id}`}>
                              {L(r.product.title_en, r.product.title_ar)}
                            </Link>
                            <div>
                              <Button
                                type="button"
                                variant="link"
                                busy={m.busy}
                                onClick={() => remove(r.product_id)}
                              >
                                {t('lists.remove')}
                              </Button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {line(t('pd.unit_price'), (p) => (
                        <PriceLine price={p.price} />
                      ))}
                      {line(t('mkt.moq_label'), (p) => p.min_moq)}
                      {line(t('pd.availability'), (p) => (
                        <AvailabilityBadge mode={p.mode} inStock={p.in_stock} />
                      ))}
                      {line(t('mkt.lead_time_label'), (p) =>
                        p.lead_time_min_days !== null
                          ? `${p.lead_time_min_days}–${p.lead_time_max_days ?? p.lead_time_min_days}`
                          : null,
                      )}
                      {line(t('pd.fulfilment'), (p) => p.fulfilment_days)}
                      {line(t('mkt.filter.category'), (p) =>
                        L(p.category_name_en, p.category_name_ar),
                      )}
                      {line(t('pd.supplier'), (p) => (
                        <>
                          {p.supplier.name} · {t(`emirate.${p.supplier.emirate}` as MessageKey)}
                        </>
                      ))}
                      {line(t('pd.materials'), (p) => p.materials)}
                      {line(t('pd.dimensions'), (p) => p.dimensions)}
                      {line(t('pd.origin'), (p) => p.country_of_origin)}
                      {line(t('pd.certifications'), (p) =>
                        p.certifications.length ? p.certifications.join(', ') : null,
                      )}
                      {line(t('mkt.custom'), (p) =>
                        p.custom_manufacturing ? t('common.yes') : t('common.no'),
                      )}
                      {line(t('mkt.private_label'), (p) =>
                        p.private_label ? t('common.yes') : t('common.no'),
                      )}
                      {line(t('mkt.samples'), (p) =>
                        p.samples_available ? t('common.yes') : t('common.no'),
                      )}
                      {[...attrKeys].map(([k, label]) =>
                        line(label, (p) => p.attributes.find((a) => a.key === k)?.value ?? null),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </>
          );
        }}
      </Resource>
    </>
  );
}

export default function ComparePage() {
  return (
    <MarketShell>
      <Compare />
    </MarketShell>
  );
}
