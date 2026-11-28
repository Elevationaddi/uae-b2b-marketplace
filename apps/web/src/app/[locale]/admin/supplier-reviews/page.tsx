'use client';
import { REVIEW_STATES, type AdminReviewItem } from '@app/contracts';
import { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { StateBadge, Stars } from '@/components/fulfilment-ui';
import { Resource } from '@/components/resource';
import {
  Button,
  ConfirmDialog,
  Empty,
  PageHeader,
  Pager,
  TextArea,
  useFieldError,
} from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useCursor, useMutation, useResource } from '@/lib/use-resource';

function Moderate({ r, onDone }: { r: AdminReviewItem; onDone: () => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const hide = r.state === 'PUBLISHED';
  return (
    <>
      <Button variant={hide ? 'secondary' : 'link'} onClick={() => setOpen(true)}>
        {hide ? t('review.hide') : t('review.unhide')}
      </Button>
      <ConfirmDialog
        open={open}
        title={hide ? t('review.hide_title') : t('review.unhide_title')}
        confirmLabel={hide ? t('review.hide') : t('review.unhide')}
        danger={hide}
        busy={m.busy}
        error={m.error && Object.keys(m.error.fieldErrors).length === 0 ? m.error : null}
        onClose={() => {
          setOpen(false);
          m.setError(null);
        }}
        onConfirm={async () => {
          const res = await m.run(`/admin/reviews/${r.id}/${hide ? 'hide' : 'unhide'}`, {
            method: 'POST',
            body: { reason },
          });
          if (res.ok) {
            setOpen(false);
            setReason('');
            onDone();
          }
        }}
      >
        <TextArea
          label={t('review.reason')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={2}
          error={fe('reason')}
        />
      </ConfirmDialog>
    </>
  );
}

function Reviews() {
  const t = useT();
  const { locale } = useApp();
  const [state, setState] = useState('');
  const pager = useCursor();
  const res = useResource<AdminReviewItem[]>('/admin/reviews', {
    state: state || undefined,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('admin.nav.supplier_reviews')} />
      <p className="muted">{t('review.admin_intro')}</p>
      <label className="inline-field">
        <span>{t('common.status')}</span>
        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            pager.first();
          }}
        >
          <option value="">{t('common.all')}</option>
          {REVIEW_STATES.map((s) => (
            <option key={s} value={s}>
              {t(`review.state.${s}`)}
            </option>
          ))}
        </select>
      </label>
      <Resource state={res.state} reload={res.reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('review.empty_admin')}</p>
            </Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="admin-reviews">
                  <thead>
                    <tr>
                      <th scope="col">{t('review.rating')}</th>
                      <th scope="col">{t('order.supplier')}</th>
                      <th scope="col">{t('order.buyer')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <Stars rating={r.rating} />
                          {r.comment ? <span className="small block">{r.comment}</span> : null}
                          <span className="muted small block">
                            <bdi>{r.order_number}</bdi> · {formatDubaiTime(r.created_at, locale)}
                          </span>
                        </td>
                        <td>{r.seller_company_name}</td>
                        <td>{r.buyer_company_name}</td>
                        <td>
                          <StateBadge ns="review" value={r.state} />
                        </td>
                        <td>
                          <Moderate r={r} onDone={res.reload} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager
                hasPrev={pager.hasPrev}
                nextCursor={next}
                onFirst={pager.first}
                onNext={pager.next}
              />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function AdminSupplierReviewsPage() {
  return (
    <AdminShell require="admin.reviews.moderate">
      <Reviews />
    </AdminShell>
  );
}
