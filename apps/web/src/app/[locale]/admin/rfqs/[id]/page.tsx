'use client';
import type { AdminRfqDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { fieldText, useApp, useT } from '@/components/app-context';
import { useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { QuoteState, RfqState } from '@/components/rfq-ui';
import {
  Alert,
  Button,
  ConfirmDialog,
  DefinitionList,
  PageHeader,
  TextArea,
} from '@/components/ui';
import { formatDate, formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

function Detail() {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const me = useAdmin();
  const { id } = useParams<{ id: string }>();
  const { state, reload, setData } = useResource<AdminRfqDetail>(`/admin/rfqs/${id}`);
  const m = useMutation();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const canModerate = me.capabilities.includes('admin.rfqs.moderate');
  return (
    <Resource state={state} reload={reload} backHref={`/${locale}/admin/rfqs`}>
      {(d) => (
        <>
          <PageHeader title={d.title}>
            <RfqState value={d.state} />
            {canModerate ? (
              <Button
                type="button"
                variant={d.hidden ? 'secondary' : 'danger'}
                onClick={() => {
                  m.setError(null);
                  setOpen(true);
                }}
              >
                {t(d.hidden ? 'admin.rfq.unhide' : 'admin.rfq.hide')}
              </Button>
            ) : null}
          </PageHeader>
          <p className="muted">
            <Link href={`/${locale}/admin/rfqs`}>{t('admin.nav.rfqs')}</Link> ·{' '}
            <bdi>{d.number}</bdi>
          </p>
          {d.hidden ? (
            <Alert kind="warning" title={t('acat.hidden')}>
              {d.hidden_reason}
            </Alert>
          ) : null}
          <section className="card">
            <DefinitionList
              items={[
                [t('rfq.buyer'), d.buyer_company_name],
                [t('rfq.category'), L(d.category_name_en, d.category_name_ar)],
                [t('rfq.quantity'), `${d.quantity} × ${t(`unit.${d.unit}` as MessageKey)}`],
                [t('rfq.delivery_emirate'), t(`emirate.${d.emirate}` as MessageKey)],
                [t('rfq.visibility'), t(`rfq.visibility.${d.visibility}` as MessageKey)],
                [t('rfq.target_date'), formatDate(d.target_date, locale)],
                [t('rfq.deadline'), formatDubaiTime(d.deadline, locale)],
                [t('rfq.invited_suppliers'), String(d.invitee_count)],
                [t('rfq.attachments'), String(d.file_count)],
              ]}
            />
            <h2 className="h4">{t('rfq.specs')}</h2>
            <p className="pre-wrap">{d.specs}</p>
          </section>
          <section className="card" aria-labelledby="adm-q">
            <h2 id="adm-q" className="h3">
              {t('rfq.quotes')} ({d.quotes.length})
            </h2>
            <p className="muted small">{t('admin.rfq.prices_private')}</p>
            {d.quotes.length === 0 ? (
              <p className="muted">{t('rfq.no_quotes')}</p>
            ) : (
              <ul>
                {d.quotes.map((q) => (
                  <li key={q.id}>
                    {q.seller_company_name} · v{q.version} · <QuoteState value={q.state} /> ·{' '}
                    <span className="muted small">{formatDubaiTime(q.updated_at, locale)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <ConfirmDialog
            open={open}
            title={t(d.hidden ? 'admin.rfq.unhide' : 'admin.rfq.hide')}
            body={t(d.hidden ? 'admin.rfq.unhide_body' : 'admin.rfq.hide_body')}
            confirmLabel={t(d.hidden ? 'admin.rfq.unhide' : 'admin.rfq.hide')}
            danger={!d.hidden}
            busy={m.busy}
            error={m.error}
            onClose={() => {
              setOpen(false);
              setReason('');
            }}
            onConfirm={async () => {
              const r = await m.run<AdminRfqDetail>(
                `/admin/rfqs/${d.id}/${d.hidden ? 'unhide' : 'hide'}`,
                {
                  method: 'POST',
                  body: { reason: reason.trim() },
                },
              );
              if (r.ok) {
                setData(r.data);
                setOpen(false);
                setReason('');
              }
            }}
          >
            <TextArea
              label={t('common.reason')}
              value={reason}
              required
              minLength={5}
              maxLength={2000}
              onChange={(e) => setReason(e.target.value)}
              error={fieldText(locale, m.error?.fieldErrors?.reason)}
            />
          </ConfirmDialog>
        </>
      )}
    </Resource>
  );
}

export default function AdminRfqPage() {
  return (
    <AdminShell require="admin.rfqs.read">
      <Detail />
    </AdminShell>
  );
}
