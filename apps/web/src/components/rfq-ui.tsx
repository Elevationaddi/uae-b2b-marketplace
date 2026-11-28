'use client';
import type { QuoteResponse, QuoteVersionResponse, RfqDetail } from '@app/contracts';
import { formatDate, formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useApp, useT } from './app-context';
import { Money, useLocalized } from './catalog-ui';
import { DefinitionList, StatusBadge } from './ui';

export function RfqState({ value }: { value: string }) {
  const t = useT();
  return <StatusBadge value={value} label={t(`rfq.state.${value}` as MessageKey)} />;
}

export function QuoteState({ value }: { value: string }) {
  const t = useT();
  return <StatusBadge value={value} label={t(`quote.state.${value}` as MessageKey)} />;
}

/** Request summary shown to both sides (specs, quantity, dates, attachments). */
export function RfqSummaryCard({
  d,
  fileHref,
}: {
  d: RfqDetail;
  fileHref: (id: string) => string;
}) {
  const t = useT();
  const { locale } = useApp();
  const L = useLocalized();
  return (
    <section className="card" aria-labelledby="rfq-req">
      <h2 id="rfq-req" className="h3">
        {t('rfq.request')}
      </h2>
      <DefinitionList
        items={[
          [t('rfq.number'), <bdi key="n">{d.number}</bdi>],
          [t('rfq.category'), L(d.category_name_en, d.category_name_ar)],
          [t('rfq.quantity'), `${d.quantity} × ${t(`unit.${d.unit}` as MessageKey)}`],
          [t('rfq.delivery_emirate'), t(`emirate.${d.emirate}` as MessageKey)],
          [t('rfq.target_date'), formatDate(d.target_date, locale)],
          [t('rfq.deadline'), formatDubaiTime(d.deadline, locale)],
          [t('rfq.visibility'), t(`rfq.visibility.${d.visibility}` as MessageKey)],
          [
            t('rfq.budget'),
            d.budget_fils ? <Money key="b" fils={d.budget_fils} /> : t('rfq.no_budget'),
          ],
          [t('rfq.buyer'), d.buyer.company_name],
        ]}
      />
      <h3 className="h4">{t('rfq.specs')}</h3>
      <p className="pre-wrap">{d.specs}</p>
      <h3 className="h4">{t('rfq.attachments')}</h3>
      {d.files.length === 0 ? (
        <p className="muted">{t('common.none')}</p>
      ) : (
        <ul className="file-list">
          {d.files.map((f) => (
            <li key={f.id}>
              <a href={`/api/v1${fileHref(f.id)}`}>{f.name}</a>{' '}
              <span className="muted small">{Math.ceil(f.bytes / 1024)} KB</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function QuoteFigures({ v }: { v: QuoteVersionResponse }) {
  const t = useT();
  const { locale } = useApp();
  return (
    <DefinitionList
      items={[
        [t('quote.quantity'), `${v.quantity} × ${t(`unit.${v.unit}` as MessageKey)}`],
        [t('quote.unit_price'), <Money key="u" fils={v.unit_price_fils} />],
        [t('quote.subtotal'), <Money key="s" fils={v.subtotal_fils} />],
        [t('quote.shipping'), <Money key="sh" fils={v.shipping_fils} />],
        [
          t('quote.tax'),
          <span key="t">
            <Money fils={v.tax_fils} />{' '}
            <span className="muted small">
              {t(`tax.${v.tax_code}` as MessageKey)} · {(v.tax_bps / 100).toFixed(2)}%
            </span>
          </span>,
        ],
        [
          t('quote.total'),
          <strong key="tot">
            <Money fils={v.total_fils} />
          </strong>,
        ],
        [t('quote.lead_days'), t('quote.days', { count: v.lead_days })],
        [t('quote.delivery_date'), formatDate(v.delivery_date, locale)],
        [t('quote.valid_until'), formatDubaiTime(v.valid_until, locale)],
      ]}
    />
  );
}

/** Side-by-side comparison of current quote versions (docs/02-buyer.md). */
export function QuoteComparison({
  quotes,
  actions,
}: {
  quotes: QuoteResponse[];
  actions?: (q: QuoteResponse) => React.ReactNode;
}) {
  const t = useT();
  const { locale } = useApp();
  const rows = quotes.filter((q) => q.current);
  if (rows.length === 0) return <p className="muted">{t('rfq.no_quotes')}</p>;
  const lowest = rows
    .filter((q) => q.current!.state === 'SUBMITTED')
    .reduce<bigint | null>((m, q) => {
      const v = BigInt(q.current!.total_fils);
      return m === null || v < m ? v : m;
    }, null);
  return (
    <div className="table-wrap">
      <table className="table compare-quotes" data-testid="quote-comparison">
        <caption className="sr-only">{t('rfq.compare_caption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('quote.supplier')}</th>
            <th scope="col">{t('common.status')}</th>
            <th scope="col">{t('quote.total')}</th>
            <th scope="col">{t('quote.unit_price')}</th>
            <th scope="col">{t('quote.shipping')}</th>
            <th scope="col">{t('quote.tax')}</th>
            <th scope="col">{t('quote.delivery_date')}</th>
            <th scope="col">{t('quote.valid_until')}</th>
            {actions ? <th scope="col">{t('common.actions')}</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((q) => {
            const v = q.current!;
            const best =
              lowest !== null && BigInt(v.total_fils) === lowest && v.state === 'SUBMITTED';
            return (
              <tr key={q.id} data-quote-id={q.id}>
                <th scope="row">
                  {q.seller.company_name}
                  <span className="muted small block">
                    {t('quote.version')} {v.version}
                  </span>
                  {q.revision_requested ? (
                    <span className="pill pill-info small">{t('quote.revision_requested')}</span>
                  ) : null}
                </th>
                <td>
                  <QuoteState value={q.state} />
                </td>
                <td>
                  <strong>
                    <Money fils={v.total_fils} />
                  </strong>
                  {best && rows.length > 1 ? (
                    <span className="pill pill-ok small block">{t('rfq.lowest_total')}</span>
                  ) : null}
                </td>
                <td>
                  <Money fils={v.unit_price_fils} />
                  <span className="muted small"> × {v.quantity}</span>
                </td>
                <td>
                  <Money fils={v.shipping_fils} />
                </td>
                <td>
                  <Money fils={v.tax_fils} />
                </td>
                <td>{formatDate(v.delivery_date, locale)}</td>
                <td>{formatDubaiTime(v.valid_until, locale)}</td>
                {actions ? <td>{actions(q)}</td> : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function RfqTimeline({ events }: { events: RfqDetail['events'] }) {
  const t = useT();
  const { locale } = useApp();
  if (!events.length) return <p className="muted">{t('common.none')}</p>;
  return (
    <ol className="timeline">
      {[...events].reverse().map((e) => (
        <li key={e.id}>
          <time dateTime={e.created_at}>{formatDubaiTime(e.created_at, locale)}</time>
          <div>
            <strong>{t(`rfq.event.${e.kind}` as MessageKey)}</strong>{' '}
            <span className="muted small">{t(`rfq.side.${e.actor_side}` as MessageKey)}</span>
            {e.reason ? <p className="pre-wrap">{e.reason}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** datetime-local value (Asia/Dubai, UTC+4, no DST) to a UTC ISO string, and back. */
export function dubaiLocalToIso(v: string): string {
  return new Date(`${v}:00+04:00`).toISOString();
}
export function isoToDubaiLocal(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 4 * 3_600_000);
  return d.toISOString().slice(0, 16);
}
export function dubaiLocalFromNow(hours: number): string {
  return isoToDubaiLocal(new Date(Date.now() + hours * 3_600_000).toISOString());
}
export function dateFromNow(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}
