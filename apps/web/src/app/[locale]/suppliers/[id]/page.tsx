'use client';
import type { StorefrontReviews, SupplierDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useApp, useT } from '@/components/app-context';
import {
  CapabilityPills,
  MediaImg,
  Section,
  useLocalized,
  VerifiedBadge,
} from '@/components/catalog-ui';
import { Stars } from '@/components/fulfilment-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { SearchResults } from '@/components/search-results';
import { ApiErrorAlert, Button, DefinitionList, Skeleton } from '@/components/ui';
import { formatDate, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

/** Published buyer reviews; buyers are shown as "Verified buyer" (no company names). */
function SupplierReviews({ id }: { id: string }) {
  const t = useT();
  const { locale } = useApp();
  const res = useResource<StorefrontReviews>(`/marketplace/suppliers/${id}/reviews`);
  return (
    <Section id="sf-rev" title={t('review.section')}>
      <Resource state={res.state} reload={res.reload} lines={3}>
        {(r) =>
          r.count === 0 ? (
            <p className="muted">{t('review.none')}</p>
          ) : (
            <div data-testid="supplier-reviews">
              <p>
                <strong>
                  {t('review.average', {
                    avg: (r.average ?? 0).toLocaleString(locale === 'ar' ? 'ar-AE' : 'en-AE'),
                    count: r.count,
                  })}
                </strong>
              </p>
              <ul className="plain review-list">
                {r.items.map((it) => (
                  <li key={it.id}>
                    <p>
                      <Stars rating={it.rating} />{' '}
                      <span className="muted small">
                        {t('review.verified_buyer')} ·{' '}
                        {formatDate(it.created_at.slice(0, 10), locale)}
                      </span>
                    </p>
                    {it.comment ? <p>{it.comment}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </Resource>
    </Section>
  );
}

function Supplier({ id }: { id: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const { state, reload, setData } = useResource<SupplierDetail>(`/marketplace/suppliers/${id}`);
  const m = useMutation();
  return (
    <Resource state={state} reload={reload} backHref={`/${locale}/suppliers`} lines={10}>
      {(s) => {
        const toggle = async () => {
          const r = await m.run(`/marketplace/saved/suppliers/${s.id}`, {
            method: s.viewer.saved ? 'DELETE' : 'POST',
          });
          if (r.ok) setData({ ...s, viewer: { ...s.viewer, saved: !s.viewer.saved } });
        };
        const facilities = s.gallery.filter((g) => g.kind !== 'LOGO' && g.kind !== 'COVER');
        return (
          <>
            <div className="sf-cover">
              <MediaImg src={s.cover_url} alt="" className="sf-cover-img" />
            </div>
            <div className="sf-head">
              <MediaImg src={s.logo_url} alt={s.name} className="sf-logo" />
              <div className="sf-title">
                <h1>{s.name}</h1>
                <p className="muted">
                  {s.business_type ? `${t(`btype.${s.business_type}` as MessageKey)} · ` : ''}
                  {s.city ? `${s.city}, ` : ''}
                  {t(`emirate.${s.emirate}` as MessageKey)}
                </p>
                <VerifiedBadge />
                {s.verified_since ? (
                  <p className="muted small">
                    {t('mkt.verified_since', {
                      date: formatDate(s.verified_since.slice(0, 10), locale),
                    })}
                  </p>
                ) : null}
              </div>
              <div className="sf-actions">
                {s.viewer.tier === 'verified' ? (
                  <>
                    <Link
                      className="btn btn-primary"
                      href={`/${locale}/app/rfqs/new?${new URLSearchParams({ invite: s.id })}`}
                    >
                      {t('pd.request_quote')}
                    </Link>
                    <Link
                      className="btn btn-secondary"
                      href={`/${locale}/app/messages/new?${new URLSearchParams({ storefront: s.id })}`}
                    >
                      {t('messages.message_supplier')}
                    </Link>
                  </>
                ) : null}
                {s.viewer.tier === 'verified' ? (
                  <Button
                    type="button"
                    variant="secondary"
                    busy={m.busy}
                    aria-pressed={s.viewer.saved}
                    onClick={toggle}
                  >
                    {s.viewer.saved ? t('sup.saved') : t('sup.save')}
                  </Button>
                ) : (
                  <Link
                    href={`/${locale}/login?next=${encodeURIComponent(`/${locale}/suppliers/${s.id}`)}`}
                  >
                    {t('pd.sign_in_to_save')}
                  </Link>
                )}
              </div>
            </div>
            {m.error ? <ApiErrorAlert error={m.error} /> : null}
            <CapabilityPills
              custom={s.customization_services}
              privateLabel={s.private_label}
              whiteLabel={s.white_label}
              samples={s.samples_available}
            />
            <div className="sf-grid">
              <Section id="sf-about" title={t('sup.about')}>
                {s.description_en || s.description_ar ? (
                  <p className="prewrap">{L(s.description_en, s.description_ar)}</p>
                ) : null}
                <DefinitionList
                  items={[
                    ...(s.year_established
                      ? [
                          [
                            t('sup.year_established', { year: '' }).trim(),
                            String(s.year_established),
                          ] as [string, string],
                        ]
                      : []),
                    ...(s.specialization_en || s.specialization_ar
                      ? [
                          [
                            t('sup.specialisation'),
                            L(s.specialization_en, s.specialization_ar),
                          ] as [string, string],
                        ]
                      : []),
                    ...(s.categories.length
                      ? [
                          [
                            t('sup.categories'),
                            s.categories.map((c) => L(c.name_en, c.name_ar)).join(', '),
                          ] as [string, string],
                        ]
                      : []),
                    ...(s.production_capacity
                      ? [[t('sup.capacity'), s.production_capacity] as [string, string]]
                      : []),
                  ]}
                />
                <p className="muted small">{t('sup.private_note')}</p>
              </Section>
              {s.capabilities_en || s.capabilities_ar || s.fulfilment_en || s.fulfilment_ar ? (
                <Section id="sf-cap" title={t('sup.capabilities')}>
                  {s.capabilities_en || s.capabilities_ar ? (
                    <p className="prewrap">{L(s.capabilities_en, s.capabilities_ar)}</p>
                  ) : null}
                  {s.fulfilment_en || s.fulfilment_ar ? (
                    <p className="prewrap">
                      <strong>{t('pd.fulfilment')}: </strong>
                      {L(s.fulfilment_en, s.fulfilment_ar)}
                    </p>
                  ) : null}
                </Section>
              ) : null}
            </div>
            {s.certifications.length ? (
              <Section id="sf-cert" title={t('pd.certifications')}>
                <ul className="plain-list">
                  {s.certifications.map((c, n) => (
                    <li key={n}>
                      <strong>{c.name}</strong>
                      {c.issuer ? ` · ${c.issuer}` : ''}
                      {c.valid_until ? ` · ${formatDate(c.valid_until.slice(0, 10), locale)}` : ''}
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
            {facilities.length ? (
              <Section id="sf-fac" title={t('sup.facilities')}>
                <ul className="sf-gallery">
                  {facilities.map((g) => (
                    <li key={g.id}>
                      <figure>
                        <MediaImg
                          src={g.url}
                          alt={L(g.caption_en, g.caption_ar) || t(`mkind.${g.kind}` as MessageKey)}
                        />
                        {g.caption_en || g.caption_ar ? (
                          <figcaption className="small">{L(g.caption_en, g.caption_ar)}</figcaption>
                        ) : null}
                      </figure>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
            <SupplierReviews id={s.id} />
            <Section id="sf-cat" title={t('sup.catalogue')}>
              <Suspense fallback={<Skeleton lines={6} />}>
                <SearchResults fixed={{ storefront_id: s.id }} />
              </Suspense>
            </Section>
          </>
        );
      }}
    </Resource>
  );
}

export default function SupplierPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <MarketShell>
      <Supplier id={id} />
    </MarketShell>
  );
}
