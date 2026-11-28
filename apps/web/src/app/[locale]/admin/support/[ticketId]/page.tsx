'use client';
import type { SupportTicketDetail } from '@app/contracts';
import { useParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { SupportBadge, SupportView } from '@/components/support-ui';
import { ApiErrorAlert, Button, PageHeader, TextArea, useFieldError } from '@/components/ui';
import { useMutation, useResource } from '@/lib/use-resource';

function Actions({
  s,
  onDone,
}: {
  s: SupportTicketDetail;
  onDone: (s: SupportTicketDetail) => void;
}) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const path = `/admin/support/${s.id}`;
  const post = async (step: string, body?: unknown) => {
    const r = await m.run<SupportTicketDetail>(`${path}/${step}`, { method: 'POST', body });
    if (r.ok) onDone(r.data);
    return r.ok;
  };
  if (s.state === 'CLOSED') return null;
  const live = s.state !== 'RESOLVED';
  return (
    <section className="card" aria-labelledby="sup-act" data-testid="support-actions">
      <h2 id="sup-act" className="h3">
        {t('common.actions')}
      </h2>
      {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      {live && !s.assigned_to_me ? (
        <>
          {s.assigned ? <p className="muted">{t('support.not_mine_note')}</p> : null}
          <Button busy={m.busy} onClick={() => post('assign')}>
            {s.assigned ? t('support.take_over') : t('support.assign')}
          </Button>
        </>
      ) : null}
      {live && s.assigned_to_me ? (
        <form
          className="subcard"
          noValidate
          onSubmit={async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget;
            const note = String(new FormData(form).get('note') ?? '').trim();
            if (await post('resolve', note ? { body: note } : {})) form.reset();
          }}
        >
          <TextArea
            label={t('support.resolve_note')}
            name="note"
            rows={2}
            maxLength={4000}
            optional
            error={fe('body')}
          />
          <Button type="submit" busy={m.busy}>
            {t('support.resolve')}
          </Button>
        </form>
      ) : null}
      {s.can_reopen ? (
        <Button variant="secondary" busy={m.busy} onClick={() => post('reopen')}>
          {t('support.reopen')}
        </Button>
      ) : null}
    </section>
  );
}

function Detail() {
  const t = useT();
  const { locale } = useApp();
  const me = useAdmin();
  const canManage = me.capabilities.includes('admin.support.manage');
  const canOrders = me.capabilities.includes('admin.orders.read');
  const { ticketId } = useParams<{ ticketId: string }>();
  const res = useResource<SupportTicketDetail>(`/admin/support/${ticketId}`);
  return (
    <Resource state={res.state} reload={res.reload} backHref={`/${locale}/admin/support`}>
      {(s) => (
        <>
          <PageHeader title={t('support.number_title', { number: s.number })}>
            <SupportBadge admin value={s.state} />
          </PageHeader>
          <h2 className="h3" dir="auto">
            {s.subject}
          </h2>
          {canManage ? <Actions s={s} onDone={res.setData} /> : null}
          <SupportView
            admin
            s={s}
            replyPath={`/admin/support/${s.id}/messages`}
            orderHref={s.order && canOrders ? `/${locale}/admin/orders/${s.order.id}` : undefined}
            onUpdated={res.setData}
            note={
              s.state === 'CLOSED'
                ? t('support.closed_note')
                : canManage && s.assigned && !s.assigned_to_me
                  ? t('support.not_mine_note')
                  : null
            }
          />
        </>
      )}
    </Resource>
  );
}

export default function AdminSupportTicketPage() {
  return (
    <AdminShell require="admin.support.read">
      <Detail />
    </AdminShell>
  );
}
