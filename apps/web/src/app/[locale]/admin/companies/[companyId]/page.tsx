'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  DefinitionList,
  Empty,
  Field,
  PageHeader,
  SelectField,
  StatusBadge,
  TextArea,
  useFieldError,
} from '@/components/ui';
import { formatDate, formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type CompanyDetail = {
  id: string;
  legal_name: string;
  display_name: string;
  licence_number: string;
  licence_issuer: string;
  licence_expiry: string;
  licence_expired: boolean;
  emirate: string;
  status: string;
  kinds: string[];
  activity: string;
  trn: string | null;
  vat_status: 'UNKNOWN' | 'REGISTERED' | 'NOT_REGISTERED';
  vat_status_confirmed_at: string | null;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  members: {
    membership_id: string;
    workspace_kind: string;
    role: string;
    status: string;
    user: { id: string; email: string };
  }[];
  cases: {
    case_id: string;
    kind: 'INITIAL' | 'RENEWAL';
    state: string;
    submitted_at: string | null;
  }[];
};

/** F05: compliance confirms (or corrects and confirms) the company's VAT registration. */
function VatStatus({ c, onDone }: { c: CompanyDetail; onDone: (c: CompanyDetail) => void }) {
  const t = useT();
  const { locale } = useApp();
  const me = useAdmin();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [status, setStatus] = useState(
    c.vat_status === 'NOT_REGISTERED' ? 'NOT_REGISTERED' : 'REGISTERED',
  );
  const [trn, setTrn] = useState(c.trn ?? '');
  const [reason, setReason] = useState('');
  const [ok, setOk] = useState(false);
  const canConfirm = me.capabilities.includes('admin.verification.review');
  return (
    <section className="card" aria-labelledby="vat-heading" data-testid="admin-vat">
      <h2 id="vat-heading" className="h3">
        {t('admin.vat.title')}
      </h2>
      <p>
        {t(`vat.${c.vat_status}` as MessageKey)}{' '}
        <span className="muted small">
          {c.vat_status_confirmed_at
            ? t('company.vat_confirmed', {
                date: formatDubaiTime(c.vat_status_confirmed_at, locale),
              })
            : t('company.vat_unconfirmed')}
        </span>
      </p>
      {canConfirm ? (
        <form
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            setOk(false);
            const r = await m.run<CompanyDetail>(`/admin/companies/${c.id}/vat-status`, {
              method: 'POST',
              body: {
                vat_status: status,
                ...(status === 'REGISTERED' && trn.trim() ? { trn: trn.trim() } : {}),
                reason,
              },
            });
            if (r.ok) {
              setOk(true);
              setReason('');
              onDone(r.data);
            }
          }}
        >
          {ok ? <Alert kind="success">{t('admin.vat.confirmed')}</Alert> : null}
          {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
            <ApiErrorAlert error={m.error} />
          ) : null}
          <SelectField
            label={t('company.vat_status')}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={(['REGISTERED', 'NOT_REGISTERED'] as const).map((s) => ({
              value: s,
              label: t(`vat.${s}`),
            }))}
          />
          {status === 'REGISTERED' ? (
            <Field
              label={t('company.trn')}
              inputMode="numeric"
              dir="ltr"
              value={trn}
              onChange={(e) => setTrn(e.target.value)}
              error={fe('trn')}
            />
          ) : null}
          <TextArea
            label={t('admin.vat.reason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={2}
            error={fe('reason')}
          />
          <Button type="submit" busy={m.busy}>
            {t('admin.vat.confirm')}
          </Button>
        </form>
      ) : null}
    </section>
  );
}

function Body({ companyId }: { companyId: string }) {
  const { locale } = useApp();
  const t = useT();
  const me = useAdmin();
  const { state, reload, setData } = useResource<CompanyDetail>(`/admin/companies/${companyId}`);
  const m = useMutation();
  const [action, setAction] = useState<'suspend' | 'reactivate' | null>(null);
  const [reason, setReason] = useState('');
  const [done, setDone] = useState(false);
  const canSuspend = me.capabilities.includes('admin.companies.suspend');
  const canReview = me.capabilities.includes('admin.verification.review');

  return (
    <Resource state={state} reload={reload} backHref={`/${locale}/admin/companies`}>
      {(c) => (
        <>
          <PageHeader title={c.display_name}>
            <StatusBadge value={c.status} label={t(`cstatus.${c.status}` as MessageKey)} />
            {canSuspend && c.status === 'APPROVED' ? (
              <Button type="button" variant="danger" onClick={() => setAction('suspend')}>
                {t('admin.suspend')}
              </Button>
            ) : null}
            {canSuspend && c.status === 'SUSPENDED' ? (
              <Button type="button" onClick={() => setAction('reactivate')}>
                {t('admin.reactivate')}
              </Button>
            ) : null}
          </PageHeader>
          {done ? <Alert kind="success">{t('common.saved')}</Alert> : null}
          {c.licence_expired ? <Alert kind="warning">{t('company.licence_expired')}</Alert> : null}
          <section className="card">
            <DefinitionList
              items={[
                [t('company.legal_name'), c.legal_name],
                [t('company.licence_number'), <bdi key="ln">{c.licence_number}</bdi>],
                [t('company.licence_issuer'), c.licence_issuer],
                [t('company.licence_expiry'), formatDate(c.licence_expiry, locale)],
                [t('company.activity'), c.activity],
                [t('company.emirate'), t(`emirate.${c.emirate}` as MessageKey)],
                [t('company.trn'), c.trn ? <bdi key="trn">{c.trn}</bdi> : t('common.none')],
                [
                  t('admin.contact'),
                  <bdi key="ct">{`${c.contact_email} · ${c.contact_phone}`}</bdi>,
                ],
                [t('company.kinds'), c.kinds.map((k) => t(`kind.${k}` as MessageKey)).join(', ')],
                [t('common.created'), formatDubaiTime(c.created_at, locale)],
              ]}
            />
          </section>
          <VatStatus c={c} onDone={setData} />
          <section className="card" aria-labelledby="members-heading">
            <h2 id="members-heading">{t('admin.members')}</h2>
            {c.members.length === 0 ? (
              <Empty>{t('common.empty')}</Empty>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">{t('common.email')}</th>
                      <th scope="col">{t('nav.workspace')}</th>
                      <th scope="col">{t('common.role')}</th>
                      <th scope="col">{t('common.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.members.map((mb) => (
                      <tr key={mb.membership_id}>
                        <td>
                          <bdi>{mb.user.email}</bdi>
                        </td>
                        <td>{t(`kind.${mb.workspace_kind}` as MessageKey)}</td>
                        <td>{t(`role.${mb.role}` as MessageKey)}</td>
                        <td>
                          <StatusBadge
                            value={mb.status}
                            label={t(`team.member_state.${mb.status}` as MessageKey)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <section className="card" aria-labelledby="cases-heading">
            <h2 id="cases-heading">{t('admin.cases')}</h2>
            {c.cases.length === 0 ? (
              <Empty>{t('common.empty')}</Empty>
            ) : (
              <ul className="doc-list">
                {c.cases.map((vc) => (
                  <li key={vc.case_id} className="doc">
                    <div>
                      {canReview ? (
                        <Link href={`/${locale}/admin/verification/${vc.case_id}`}>
                          {t(`admin.case_kind.${vc.kind}`)}
                        </Link>
                      ) : (
                        t(`admin.case_kind.${vc.kind}`)
                      )}
                      <div className="muted">
                        {vc.submitted_at ? formatDubaiTime(vc.submitted_at, locale) : '—'}
                      </div>
                    </div>
                    <StatusBadge value={vc.state} label={t(`cstatus.${vc.state}` as MessageKey)} />
                  </li>
                ))}
              </ul>
            )}
          </section>
          <ConfirmDialog
            open={action !== null}
            title={action === 'suspend' ? t('admin.suspend') : t('admin.reactivate')}
            confirmLabel={action === 'suspend' ? t('admin.suspend') : t('admin.reactivate')}
            danger={action === 'suspend'}
            busy={m.busy}
            error={m.error}
            onClose={() => {
              setAction(null);
              m.setError(null);
            }}
            onConfirm={async () => {
              if (!action) return;
              const r = await m.run<CompanyDetail>(`/admin/companies/${c.id}/${action}`, {
                method: 'POST',
                body: { reason },
              });
              if (r.ok) {
                setAction(null);
                setReason('');
                setDone(true);
                setData(r.data);
              }
            }}
          >
            <TextArea
              label={t('common.reason')}
              hint={t('admin.reason_hint')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              minLength={5}
              maxLength={2000}
            />
          </ConfirmDialog>
        </>
      )}
    </Resource>
  );
}

export default function AdminCompanyPage() {
  const params = useParams<{ companyId: string }>();
  return (
    <AdminShell require="admin.companies.read">
      <Body companyId={params.companyId} />
    </AdminShell>
  );
}
