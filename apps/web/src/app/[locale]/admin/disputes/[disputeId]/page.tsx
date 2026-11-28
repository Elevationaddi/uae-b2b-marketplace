'use client';
import { DISPUTE_PROPOSALS, parseAedToFils, type DisputeDetail } from '@app/contracts';
import { useParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { DisputeView, StateBadge } from '@/components/fulfilment-ui';
import { Resource } from '@/components/resource';
import {
  ApiErrorAlert,
  Button,
  Field,
  PageHeader,
  SelectField,
  TextArea,
  useFieldError,
} from '@/components/ui';
import { useMutation, useResource } from '@/lib/use-resource';

function Actions({ d, onDone }: { d: DisputeDetail; onDone: (d: DisputeDetail) => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [proposal, setProposal] = useState<string>('NO_ACTION');
  const path = `/admin/disputes/${d.id}`;
  const post = async (step: string, body?: unknown) => {
    const r = await m.run<DisputeDetail>(`${path}/${step}`, { method: 'POST', body });
    if (r.ok) onDone(r.data);
    return r.ok;
  };
  if (d.state === 'CLOSED') return null;
  return (
    <section className="card" aria-labelledby="dsp-act" data-testid="dispute-actions">
      <h2 id="dsp-act" className="h3">
        {t('common.actions')}
      </h2>
      {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      {!d.assigned_to_me ? (
        <Button busy={m.busy} onClick={() => post('assign')}>
          {t('dispute.assign')}
        </Button>
      ) : (
        <div className="stack">
          {d.state === 'UNDER_REVIEW' || d.state === 'RESOLUTION_PROPOSED' ? (
            <form
              className="subcard"
              noValidate
              onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const form = e.currentTarget;
                const msg = String(new FormData(form).get('message') ?? '');
                if (await post('request-evidence', { message: msg })) form.reset();
              }}
            >
              <TextArea
                label={t('dispute.note')}
                name="message"
                required
                rows={2}
                error={fe('message')}
              />
              <Button type="submit" variant="secondary" busy={m.busy}>
                {t('dispute.request_evidence')}
              </Button>
            </form>
          ) : null}
          {d.state === 'UNDER_REVIEW' || d.state === 'AWAITING_EVIDENCE' ? (
            <form
              className="subcard"
              data-testid="propose-form"
              noValidate
              onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const aed = String(fd.get('amount') ?? '');
                const fils = proposal === 'REFUND' ? parseAedToFils(aed) : null;
                await post('propose', {
                  proposal,
                  note: String(fd.get('note') ?? ''),
                  ...(proposal === 'REFUND'
                    ? { amount_fils: fils === null ? aed : String(fils) }
                    : {}),
                });
              }}
            >
              <SelectField
                label={t('dispute.proposal')}
                name="proposal"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                options={DISPUTE_PROPOSALS.map((p) => ({
                  value: p,
                  label: t(`dispute.proposal.${p}`),
                }))}
              />
              {proposal === 'REFUND' ? (
                <Field
                  label={t('dispute.proposal_amount')}
                  name="amount"
                  inputMode="decimal"
                  hint={t('dispute.amount_hint')}
                  error={fe('amount_fils')}
                />
              ) : null}
              <TextArea
                label={t('dispute.note')}
                name="note"
                required
                rows={2}
                error={fe('note')}
              />
              <Button type="submit" busy={m.busy}>
                {t('dispute.propose')}
              </Button>
            </form>
          ) : null}
          {d.state === 'RESOLUTION_PROPOSED' && d.proposal === 'NO_ACTION' ? (
            <form
              className="subcard"
              noValidate
              onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                await post('close', {
                  resolution: String(new FormData(e.currentTarget).get('resolution') ?? ''),
                });
              }}
            >
              <h3 className="h4">{t('dispute.close_title')}</h3>
              <TextArea
                label={t('dispute.resolution')}
                name="resolution"
                required
                rows={2}
                error={fe('resolution')}
              />
              <Button type="submit" busy={m.busy}>
                {t('dispute.close')}
              </Button>
            </form>
          ) : null}
          {d.state === 'RESOLUTION_PROPOSED' && d.proposal === 'REFUND' ? (
            <p className="muted">{t('dispute.refund_hint')}</p>
          ) : null}
        </div>
      )}
    </section>
  );
}

function Detail() {
  const t = useT();
  const { locale } = useApp();
  const me = useAdmin();
  const canManage = me.capabilities.includes('admin.disputes.manage');
  const { disputeId } = useParams<{ disputeId: string }>();
  const res = useResource<DisputeDetail>(`/admin/disputes/${disputeId}`);
  return (
    <Resource state={res.state} reload={res.reload} backHref={`/${locale}/admin/disputes`}>
      {(d) => (
        <>
          <PageHeader title={t('dispute.number_title', { number: d.number })}>
            <StateBadge ns="dispute" value={d.state} />
          </PageHeader>
          {canManage ? <Actions d={d} onDone={res.setData} /> : null}
          <DisputeView
            d={d}
            orderHref={`/${locale}/admin/orders/${d.order_id}`}
            postPath={`/admin/disputes/${d.id}/messages`}
            fileHref={(f) => `/admin/disputes/${d.id}/files/${f}`}
            allowFiles={false}
            onUpdated={res.setData}
          />
        </>
      )}
    </Resource>
  );
}

export default function AdminDisputePage() {
  return (
    <AdminShell require="admin.disputes.read">
      <Detail />
    </AdminShell>
  );
}
