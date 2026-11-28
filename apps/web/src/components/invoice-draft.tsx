'use client';
import type { InvoiceDraft } from '@app/contracts';
import { useState } from 'react';
import { useResource } from '@/lib/use-resource';
import { useT } from './app-context';
import { Money } from './catalog-ui';
import { Totals } from './commerce-ui';
import { Resource } from './resource';
import { Alert, Button, DefinitionList } from './ui';

/**
 * Non-binding invoice draft (F05, C-09). Loaded on request; always labelled as not a tax invoice.
 * The buyer never sees the commission part.
 */
export function InvoiceDraftCard({ url }: { url: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const res = useResource<InvoiceDraft>(open ? url : null);
  return (
    <section className="card" aria-labelledby="inv-draft" data-testid="invoice-draft">
      <h2 id="inv-draft" className="h3">
        {t('invoice.open')}
      </h2>
      {!open ? (
        <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
          {t('invoice.open')}
        </Button>
      ) : (
        <Resource state={res.state} reload={res.reload} lines={6}>
          {(d) => (
            <>
              <Alert kind="warning">{t('invoice.not_tax_invoice')}</Alert>
              <p className="h3">{t('invoice.title', { number: d.order_number })}</p>
              <DefinitionList
                items={[
                  [
                    t('invoice.supplier'),
                    <span key="s">
                      {d.supplier.legal_name}
                      <span className="muted small block">
                        {t('invoice.trn')}: <bdi>{d.supplier.trn ?? t('common.none')}</bdi> ·{' '}
                        {t(`vat.${d.supplier.vat_status}`)}
                        {d.supplier.vat_confirmed ? '' : ` ${t('invoice.vat_unconfirmed')}`}
                      </span>
                    </span>,
                  ],
                  [
                    t('invoice.buyer'),
                    <span key="b">
                      {d.buyer.legal_name}
                      <span className="muted small block">
                        {t('invoice.trn')}: <bdi>{d.buyer.trn ?? t('common.none')}</bdi>
                      </span>
                    </span>,
                  ],
                  [t('tax.code'), t(`taxcode.${d.tax_code}`)],
                ]}
              />
              <ul className="plain-list">
                {d.lines.map((l, i) => (
                  <li key={i}>
                    {l.title} · {l.quantity} × <Money fils={l.unit_price_fils} /> ={' '}
                    <Money fils={l.line_total_fils} />
                  </li>
                ))}
              </ul>
              <Totals
                merchandise={d.merchandise_fils}
                shipping={d.shipping_fils}
                tax={d.tax_fils}
                taxBps={d.tax_bps}
                total={d.total_fils}
              />
              {d.provisional ? <p className="muted small">{t('tax.provisional_note')}</p> : null}
              {d.commission ? (
                <>
                  <h3 className="h3">{t('invoice.commission_title')}</h3>
                  <DefinitionList
                    items={[
                      [
                        t('order.commission'),
                        <Money key="c" fils={d.commission.commission_fils} />,
                      ],
                      ...(d.commission.commission_bps !== null
                        ? ([
                            [
                              t('invoice.rate'),
                              `${(d.commission.commission_bps / 100).toFixed(2)}%`,
                            ],
                          ] as [string, React.ReactNode][])
                        : []),
                    ]}
                  />
                  <p className="muted small">{t('invoice.commission_vat_pending')}</p>
                </>
              ) : null}
            </>
          )}
        </Resource>
      )}
    </section>
  );
}
