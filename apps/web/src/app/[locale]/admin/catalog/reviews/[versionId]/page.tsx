'use client';
import type { SkuDetail, VersionDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { fieldText, useApp, useT } from '@/components/app-context';
import { MediaImg, Money, useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import {
  Alert,
  ApiErrorAlert,
  Button,
  DefinitionList,
  PageHeader,
  StatusBadge,
  TextArea,
} from '@/components/ui';
import { formatDate, formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Review = {
  version: VersionDetail;
  published_version: VersionDetail | null;
  changed_fields: string[];
  product: { id: string; status: string; price_type: string; workspace_id: string };
  skus: SkuDetail[];
  company: {
    id: string;
    display_name: string;
    status: string;
    licence_expiry: string;
    licence_expired: boolean;
    emirate: string;
  };
  storefront: { id: string; status: string; business_type: string | null } | null;
  category_requirements_en: string | null;
  category_requirements_ar: string | null;
  history: {
    id: string;
    action: string;
    to_state: string | null;
    reason: string | null;
    created_at: string;
    version: number | null;
  }[];
};

function VersionView({ v, changed }: { v: VersionDetail; changed: Set<string> }) {
  const t = useT();
  const L = useLocalized();
  const mark = (k: string) => (changed.has(k) ? 'changed' : undefined);
  const items: [string, string, string][] = [
    ['title_en', t('seller.title_en'), v.title_en],
    ['title_ar', t('seller.title_ar'), v.title_ar ?? '—'],
    ['category_id', t('seller.category'), L(v.category.name_en, v.category.name_ar)],
    ['mode', t('seller.mode'), t(`mode.${v.mode}` as MessageKey)],
    ['materials', t('pd.materials'), v.materials ?? '—'],
    ['dimensions', t('pd.dimensions'), v.dimensions ?? '—'],
    ['country_of_origin', t('pd.origin'), v.country_of_origin ?? '—'],
    ['lead_time_min_days', t('seller.lead_min'), String(v.lead_time_min_days ?? '—')],
    ['lead_time_max_days', t('seller.lead_max'), String(v.lead_time_max_days ?? '—')],
    ['fulfilment_days', t('seller.fulfilment_days'), String(v.fulfilment_days ?? '—')],
    [
      'attributes',
      t('seller.attributes'),
      Object.entries(v.attributes)
        .map(([k, x]) => `${k}: ${String(x)}`)
        .join(', ') || '—',
    ],
    [
      'specifications',
      t('pd.specifications'),
      v.specifications.map((s) => `${s.label_en}: ${s.value}`).join('; ') || '—',
    ],
    [
      'certifications',
      t('pd.certifications'),
      v.certifications.map((c) => c.name).join(', ') || '—',
    ],
    ['video_url', t('seller.video'), v.video_url ?? '—'],
  ];
  return (
    <div>
      <dl className="dl">
        {items.map(([k, label, value]) => (
          <div key={k} className={`dl-row ${mark(k) ?? ''}`}>
            <dt>
              {label}
              {mark(k) ? <span className="sr-only"> ({t('acat.changed_fields')})</span> : null}
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div
        className={
          changed.has('description_en') || changed.has('description_ar') ? 'changed' : undefined
        }
      >
        <h4>{t('seller.desc_en')}</h4>
        <p className="prewrap small">{v.description_en || '—'}</p>
        {v.description_ar ? (
          <>
            <h4>{t('seller.desc_ar')}</h4>
            <p className="prewrap small" dir="rtl" lang="ar">
              {v.description_ar}
            </p>
          </>
        ) : null}
      </div>
      {v.media.length ? (
        <ul className={`media-grid ${changed.has('media') ? 'changed' : ''}`}>
          {v.media.map((m, i) => (
            <li key={m.id}>
              <MediaImg
                src={m.url}
                alt={L(m.alt_en, m.alt_ar) || t('pd.image_n', { n: i + 1, total: v.media.length })}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Decision({ r, onDone }: { r: Review; onDone: () => void }) {
  const { locale } = useApp();
  const t = useT();
  const m = useMutation();
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'>(
    'APPROVED',
  );
  const [done, setDone] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reason = String(new FormData(e.currentTarget).get('reason') ?? '').trim();
    const res = await m.run(`/admin/catalog/reviews/${r.version.id}/decision`, {
      method: 'POST',
      body: { decision, expected_state: r.version.state, ...(reason ? { reason } : {}) },
    });
    if (res.ok) {
      setDone(true);
      onDone();
    }
  };
  if (done) return <Alert kind="success">{t('acat.decided')}</Alert>;
  if (r.version.state !== 'PENDING_REVIEW')
    return <Alert kind="info">{t('acat.not_pending')}</Alert>;
  return (
    <form className="card" onSubmit={submit} aria-labelledby="dec-h">
      <h2 id="dec-h" className="h3">
        {t('acat.decision')}
      </h2>
      <fieldset>
        <legend className="sr-only">{t('acat.decision')}</legend>
        {(
          [
            ['APPROVED', 'acat.approve'],
            ['CHANGES_REQUESTED', 'acat.request_changes'],
            ['REJECTED', 'acat.reject'],
          ] as const
        ).map(([v, k]) => (
          <label key={v} className="check">
            <input
              type="radio"
              name="decision"
              value={v}
              checked={decision === v}
              onChange={() => setDecision(v)}
            />
            {t(k)}
          </label>
        ))}
      </fieldset>
      <TextArea
        label={t('acat.reason')}
        name="reason"
        rows={3}
        maxLength={2000}
        required={decision !== 'APPROVED'}
        error={fieldText(locale, m.error?.fieldErrors.reason)}
      />
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      {done ? <Alert kind="success">{t('acat.decided')}</Alert> : null}
      <Button type="submit" variant={decision === 'REJECTED' ? 'danger' : 'primary'} busy={m.busy}>
        {decision === 'APPROVED'
          ? t('acat.approve')
          : decision === 'REJECTED'
            ? t('acat.reject')
            : t('acat.request_changes')}
      </Button>
    </form>
  );
}

function ReviewView({ id }: { id: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const me = useAdmin();
  const { state, reload } = useResource<Review>(`/admin/catalog/reviews/${id}`);
  return (
    <Resource state={state} reload={reload} backHref={`/${locale}/admin/catalog`} lines={10}>
      {(r) => {
        const changed = new Set(r.changed_fields);
        return (
          <>
            <p className="small">
              <Link href={`/${locale}/admin/catalog`}>← {t('acat.queue')}</Link>
            </p>
            <PageHeader
              title={`${t('acat.review_title')}: ${L(r.version.title_en, r.version.title_ar)}`}
            >
              <Link
                className="btn btn-secondary"
                href={`/${locale}/admin/catalog/products/${r.product.id}`}
              >
                {t('admin.nav.listings')}
              </Link>
            </PageHeader>
            <div className="status-row">
              <StatusBadge
                value={r.version.state}
                label={t(`vstate.${r.version.state}` as MessageKey)}
              />
              <span className="pill">
                {r.published_version ? t('acat.update') : t('acat.new_listing')}
              </span>
              <span className="muted small">v{r.version.version}</span>
            </div>
            <section className="card">
              <DefinitionList
                items={[
                  [
                    t('nav.company'),
                    <Link key="c" href={`/${locale}/admin/companies/${r.company.id}`}>
                      {r.company.display_name}
                    </Link>,
                  ],
                  [
                    t('acat.company_status'),
                    <StatusBadge
                      key="s"
                      value={r.company.status}
                      label={t(`cstatus.${r.company.status}` as MessageKey)}
                    />,
                  ],
                  [
                    t('acat.licence'),
                    <span key="l">
                      {formatDate(r.company.licence_expiry, locale)}
                      {r.company.licence_expired ? (
                        <span className="pill pill-warn small">{t('acat.licence_expired')}</span>
                      ) : null}
                    </span>,
                  ],
                  [
                    t('seller.business_type'),
                    r.storefront?.business_type
                      ? t(`btype.${r.storefront.business_type}` as MessageKey)
                      : '—',
                  ],
                  [t('seller.price_type'), t(`ptype.${r.product.price_type}` as MessageKey)],
                ]}
              />
            </section>
            {r.version.auto_flags.length ? (
              <Alert kind="warning" title={t('acat.flags')}>
                <ul>
                  {r.version.auto_flags.map((f, i) => (
                    <li key={i}>
                      “{f.term}” · {f.field} · {f.kind}
                    </li>
                  ))}
                </ul>
              </Alert>
            ) : null}
            {r.category_requirements_en || r.category_requirements_ar ? (
              <Alert kind="info" title={t('mkt.category_requirements')}>
                {L(r.category_requirements_en, r.category_requirements_ar)}
              </Alert>
            ) : null}
            {r.changed_fields.length ? (
              <p>
                <strong>{t('acat.changed_fields')}:</strong> {r.changed_fields.join(', ')}
              </p>
            ) : null}
            <div className="compare-cols">
              <section className="card" aria-labelledby="sub-h">
                <h2 id="sub-h" className="h3">
                  {t('acat.submitted_version')}
                </h2>
                <VersionView v={r.version} changed={changed} />
              </section>
              <section className="card" aria-labelledby="live-h">
                <h2 id="live-h" className="h3">
                  {t('acat.live_version')}
                </h2>
                {r.published_version ? (
                  <VersionView v={r.published_version} changed={new Set()} />
                ) : (
                  <p className="muted">{t('acat.no_live')}</p>
                )}
              </section>
            </div>
            <section className="card" aria-labelledby="sku-h">
              <h2 id="sku-h" className="h3">
                {t('seller.skus')}
              </h2>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">{t('pd.sku')}</th>
                      <th scope="col">{t('seller.variant_attrs')}</th>
                      <th scope="col">{t('mkt.moq_label')}</th>
                      <th scope="col">{t('pd.tiers')}</th>
                      <th scope="col">{t('common.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.skus.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <bdi>{s.code}</bdi>
                        </td>
                        <td>
                          {Object.entries(s.variant_attributes)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ') || '—'}
                        </td>
                        <td>{s.moq}</td>
                        <td>
                          {s.tiers.length
                            ? s.tiers.map((x) => (
                                <span key={x.min_qty} className="block">
                                  {x.min_qty}+ : <Money fils={x.unit_price_fils} />
                                </span>
                              ))
                            : '—'}
                        </td>
                        <td>{s.approved ? t('seller.sku_active') : t('seller.sku_pending')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            {me.capabilities.includes('admin.catalog.review') ? (
              <Decision r={r} onDone={reload} />
            ) : null}
            <section className="card" aria-labelledby="hist-h">
              <h2 id="hist-h" className="h3">
                {t('seller.history')}
              </h2>
              <ol className="timeline-list">
                {r.history.map((h) => (
                  <li key={h.id}>
                    <span className="small muted">{formatDubaiTime(h.created_at, locale)}</span>{' '}
                    <strong>{h.action}</strong>
                    {h.to_state ? ` → ${t(`vstate.${h.to_state}` as MessageKey)}` : ''}
                    {h.reason ? <p className="small">{h.reason}</p> : null}
                  </li>
                ))}
              </ol>
            </section>
          </>
        );
      }}
    </Resource>
  );
}

export default function ReviewPage() {
  const { versionId } = useParams<{ versionId: string }>();
  return (
    <AdminShell require="admin.catalog.read">
      <ReviewView id={versionId} />
    </AdminShell>
  );
}
