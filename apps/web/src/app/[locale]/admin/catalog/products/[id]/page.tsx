'use client';
import type { SellerProductDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { fieldText, useApp, useT } from '@/components/app-context';
import { MediaImg, Money, useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import {
  Alert,
  Button,
  ConfirmDialog,
  DefinitionList,
  PageHeader,
  StatusBadge,
  TextArea,
} from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Detail = Omit<SellerProductDetail, 'actions'> & {
  company: { id: string; display_name: string; status: string };
  actions: { suspend: boolean; restore: boolean; remove: boolean };
};
type Act = 'suspend' | 'restore' | 'remove';

function ProductView({ id }: { id: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const me = useAdmin();
  const path = `/admin/catalog/products/${id}`;
  const { state, reload, setData } = useResource<Detail>(path);
  const m = useMutation();
  const [act, setAct] = useState<Act | null>(null);
  const [reason, setReason] = useState('');
  const canEnforce = me.capabilities.includes('admin.catalog.enforce');
  const run = async () => {
    if (!act) return;
    const r = await m.run<Detail>(`${path}/${act}`, {
      method: 'POST',
      body: { reason: reason.trim() },
    });
    if (r.ok) {
      setData(r.data);
      setAct(null);
      setReason('');
    }
  };
  return (
    <Resource
      state={state}
      reload={reload}
      backHref={`/${locale}/admin/catalog/products`}
      lines={10}
    >
      {(p) => {
        const v = p.published_version ?? p.working_version;
        if (!v) return null;
        return (
          <>
            <p className="small">
              <Link href={`/${locale}/admin/catalog/products`}>← {t('acat.listings_title')}</Link>
            </p>
            <PageHeader title={L(v.title_en, v.title_ar)}>
              {canEnforce
                ? (['suspend', 'restore', 'remove'] as Act[])
                    .filter((a) => p.actions[a])
                    .map((a) => (
                      <Button
                        key={a}
                        type="button"
                        variant={a === 'restore' ? 'primary' : 'danger'}
                        onClick={() => {
                          m.setError(null);
                          setAct(a);
                        }}
                      >
                        {t(`acat.${a}` as MessageKey)}
                      </Button>
                    ))
                : null}
            </PageHeader>
            <div className="status-row">
              <StatusBadge value={p.status} label={t(`pstatus.${p.status}` as MessageKey)} />
              {p.public ? <span className="pill pill-ok">{t('seller.public_badge')}</span> : null}
              {p.working_version && p.working_version.state === 'PENDING_REVIEW' ? (
                <Link href={`/${locale}/admin/catalog/reviews/${p.working_version.id}`}>
                  {t('acat.review_title')}
                </Link>
              ) : null}
            </div>
            {p.status_reason ? (
              <Alert kind="warning" title={t('seller.status_reason')}>
                {p.status_reason}
              </Alert>
            ) : null}
            <p className="muted small">{t('acat.no_edit_note')}</p>
            <section className="card">
              <DefinitionList
                items={[
                  [
                    t('nav.company'),
                    <Link key="c" href={`/${locale}/admin/companies/${p.company.id}`}>
                      {p.company.display_name}
                    </Link>,
                  ],
                  [t('seller.category'), L(v.category.name_en, v.category.name_ar)],
                  [t('seller.mode'), t(`mode.${v.mode}` as MessageKey)],
                  [t('seller.price_type'), t(`ptype.${p.price_type}` as MessageKey)],
                  [t('common.created'), formatDubaiTime(p.created_at, locale)],
                ]}
              />
              <p className="prewrap small">{L(v.description_en, v.description_ar)}</p>
              {v.media.length ? (
                <ul className="media-grid">
                  {v.media.map((x) => (
                    <li key={x.id}>
                      <MediaImg
                        src={x.url}
                        alt={L(x.alt_en, x.alt_ar) || L(v.title_en, v.title_ar)}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
            <section className="card">
              <h2 className="h3">{t('seller.skus')}</h2>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">{t('pd.sku')}</th>
                      <th scope="col">{t('mkt.moq_label')}</th>
                      <th scope="col">{t('pd.tiers')}</th>
                      <th scope="col">{t('seller.available')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.skus.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <bdi>{s.code}</bdi>
                        </td>
                        <td>{s.moq}</td>
                        <td>
                          {s.tiers.map((x) => (
                            <span key={x.min_qty} className="block">
                              {x.min_qty}+ : <Money fils={x.unit_price_fils} />
                            </span>
                          ))}
                        </td>
                        <td>{s.inventory.available}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="card">
              <h2 className="h3">{t('seller.history')}</h2>
              <ol className="timeline-list">
                {p.history.map((h) => (
                  <li key={h.id}>
                    <span className="small muted">{formatDubaiTime(h.created_at, locale)}</span>{' '}
                    <strong>{h.action}</strong>
                    {h.reason ? <p className="small">{h.reason}</p> : null}
                  </li>
                ))}
              </ol>
            </section>
            <ConfirmDialog
              open={act !== null}
              title={act ? t(`acat.${act}` as MessageKey) : ''}
              confirmLabel={act ? t(`acat.${act}` as MessageKey) : ''}
              danger={act !== 'restore'}
              busy={m.busy}
              error={m.error}
              onConfirm={run}
              onClose={() => setAct(null)}
            >
              <TextArea
                label={t('acat.enforce_reason')}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
                minLength={5}
                maxLength={2000}
                error={fieldText(locale, m.error?.fieldErrors.reason)}
              />
            </ConfirmDialog>
          </>
        );
      }}
    </Resource>
  );
}

export default function AdminProductPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <AdminShell require="admin.catalog.read">
      <ProductView id={id} />
    </AdminShell>
  );
}
