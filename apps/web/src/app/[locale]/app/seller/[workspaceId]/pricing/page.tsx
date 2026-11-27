'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useT } from '@/components/app-context';
import { Money, useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import { Empty, PageHeader, Pager } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';

type Summary = {
  id: string;
  status: string;
  price_type: string;
  title_en: string;
  title_ar: string | null;
  sku_count: number;
  min_price_fils: string | null;
  min_moq: number | null;
};

/** Price overview across the catalogue; prices are edited per product (changes are audited, not reviewed). */
function Pricing({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const L = useLocalized();
  const [cursor, setCursor] = useState<string[]>([]);
  const { state, reload } = useResource<Summary[]>(`${sellerApi(ws)}/products`, {
    tab: 'all',
    cursor: cursor.at(-1),
  });
  return (
    <>
      <PageHeader title={t('seller.pricing_title')} />
      <p className="lead">{t('seller.pricing_body')}</p>
      <Resource state={state} reload={reload}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>{t('seller.products_empty')}</Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">{t('seller.title_en')}</th>
                      <th scope="col">{t('seller.price_type')}</th>
                      <th scope="col">{t('mkt.price_from', { price: '' }).trim()}</th>
                      <th scope="col">{t('mkt.moq_label')}</th>
                      <th scope="col">{t('seller.skus')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <Link href={`${base}/products/${p.id}#sec-pricing`}>
                            {L(p.title_en, p.title_ar)}
                          </Link>
                        </td>
                        <td>{t(`ptype.${p.price_type}` as MessageKey)}</td>
                        <td>{p.min_price_fils ? <Money fils={p.min_price_fils} /> : '—'}</td>
                        <td>{p.min_moq ?? '—'}</td>
                        <td>{p.sku_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager
                hasPrev={cursor.length > 0}
                nextCursor={next}
                onFirst={() => setCursor([])}
                onNext={(c) => setCursor([...cursor, c])}
              />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function PricingPage() {
  return <SellerShell>{(ws, base) => <Pricing ws={ws} base={base} />}</SellerShell>;
}
