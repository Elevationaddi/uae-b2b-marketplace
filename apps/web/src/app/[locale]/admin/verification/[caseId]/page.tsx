'use client';
import type { VerificationCaseResponse } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { Timeline } from '@/components/timeline';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  DefinitionList,
  Empty,
  PageHeader,
  StatusBadge,
  TextArea,
} from '@/components/ui';
import { formatDate, formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type CaseDetail = {
  case_id: string;
  kind: 'INITIAL' | 'RENEWAL';
  state: string;
  submitted_at: string | null;
  decided_at: string | null;
  reason: string | null;
  proposed: VerificationCaseResponse['proposed'];
  assigned_admin: { id: string; email: string } | null;
  company: {
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
    contact_email: string;
    contact_phone: string;
    terms_version: string | null;
  };
  documents: VerificationCaseResponse['documents'];
  events: VerificationCaseResponse['events'];
};

type Decision = 'APPROVED' | 'NEEDS_INFO' | 'REJECTED';

function CaseBody({ caseId }: { caseId: string }) {
  const { locale } = useApp();
  const t = useT();
  const { state, reload, setData } = useResource<CaseDetail>(`/admin/verification/${caseId}`);
  const start = useMutation();
  const decide = useMutation();
  const [decision, setDecision] = useState<Decision>('APPROVED');
  const [reason, setReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [recorded, setRecorded] = useState(false);

  return (
    <Resource state={state} reload={reload} backHref={`/${locale}/admin/verification`}>
      {(c) => {
        const reasonMissing = decision !== 'APPROVED' && reason.trim().length < 5;
        return (
          <>
            <PageHeader title={`${t('admin.case_title')}: ${c.company.display_name}`}>
              <StatusBadge value={c.state} label={t(`cstatus.${c.state}` as MessageKey)} />
            </PageHeader>
            <p className="muted">
              {t(`admin.case_kind.${c.kind}`)}
              {c.submitted_at
                ? ` · ${t('admin.submitted_at')}: ${formatDubaiTime(c.submitted_at, locale)}`
                : ''}
              {' · '}
              {t('admin.assigned_to')}:{' '}
              {c.assigned_admin ? <bdi>{c.assigned_admin.email}</bdi> : t('admin.unassigned')}
            </p>
            {recorded ? <Alert kind="success">{t('admin.decision_recorded')}</Alert> : null}

            <div className="grid-2 align-start">
              <section className="card" aria-labelledby="co-heading">
                <h2 id="co-heading">{t('company.details')}</h2>
                <DefinitionList
                  items={[
                    [t('company.legal_name'), c.company.legal_name],
                    [t('company.licence_number'), <bdi key="ln">{c.company.licence_number}</bdi>],
                    [t('company.licence_issuer'), c.company.licence_issuer],
                    [
                      t('company.licence_expiry'),
                      <span key="le">
                        {formatDate(c.company.licence_expiry, locale)}
                        {c.company.licence_expired ? (
                          <>
                            {' '}
                            · <StatusBadge value="EXPIRED" label={t('team.invite_state.EXPIRED')} />
                          </>
                        ) : null}
                      </span>,
                    ],
                    [t('company.activity'), c.company.activity],
                    [t('company.emirate'), t(`emirate.${c.company.emirate}` as MessageKey)],
                    [
                      t('company.trn'),
                      c.company.trn ? <bdi key="trn">{c.company.trn}</bdi> : t('common.none'),
                    ],
                    [
                      t('admin.contact'),
                      <bdi key="ct">{`${c.company.contact_email} · ${c.company.contact_phone}`}</bdi>,
                    ],
                    [
                      t('company.kinds'),
                      c.company.kinds.map((k) => t(`kind.${k}` as MessageKey)).join(', '),
                    ],
                    [t('admin.terms_version'), c.company.terms_version ?? t('common.none')],
                  ]}
                />
                <Link href={`/${locale}/admin/companies/${c.company.id}`}>
                  {t('common.details')}
                </Link>
              </section>

              <section className="card" aria-labelledby="docs-heading">
                <h2 id="docs-heading">{t('company.documents')}</h2>
                {c.proposed ? (
                  <Alert kind="info" title={t('company.renewal_proposed')}>
                    <p>
                      <bdi>{c.proposed.licence_number}</bdi> · {c.proposed.licence_issuer} ·{' '}
                      {formatDate(c.proposed.licence_expiry, locale)}
                    </p>
                  </Alert>
                ) : null}
                {c.documents.length === 0 ? (
                  <Empty>{t('company.no_documents')}</Empty>
                ) : (
                  <ul className="doc-list">
                    {c.documents.map((d) => (
                      <li key={d.id} className="doc">
                        <div>
                          <strong>{t(`doc.${d.type}`)}</strong>
                          <div className="muted">
                            <bdi>{d.file.original_name}</bdi>
                            {d.expires_at
                              ? ` · ${t('company.document_expiry')}: ${formatDate(d.expires_at, locale)}`
                              : ''}
                          </div>
                        </div>
                        <div className="doc-actions">
                          <StatusBadge
                            value={d.file.scan_state}
                            label={t(`company.scan.${d.file.scan_state}`)}
                          />
                          {d.file.scan_state === 'CLEAN' ? (
                            <a
                              className="btn btn-link"
                              href={`/api/v1/admin/files/${d.file.id}/download`}
                              download
                            >
                              {t('common.download')}
                            </a>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {c.state === 'SUBMITTED' ? (
              <section className="card">
                {start.error ? <ApiErrorAlert error={start.error} onRetry={reload} /> : null}
                <Button
                  type="button"
                  busy={start.busy}
                  onClick={async () => {
                    const r = await start.run<CaseDetail>(
                      `/admin/verification/${c.case_id}/start-review`,
                      {
                        method: 'POST',
                        body: { expected_state: c.state },
                      },
                    );
                    if (r.ok) reload();
                  }}
                >
                  {t('admin.start_review')}
                </Button>
              </section>
            ) : null}

            {c.state === 'UNDER_REVIEW' ? (
              <section className="card" aria-labelledby="decision-heading">
                <h2 id="decision-heading">{t('admin.decision')}</h2>
                <form
                  className="form"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!reasonMissing) setConfirming(true);
                  }}
                >
                  <fieldset className="fieldset">
                    <legend>{t('admin.decision')}</legend>
                    {(['APPROVED', 'NEEDS_INFO', 'REJECTED'] as const).map((d) => (
                      <label key={d} className="check">
                        <input
                          type="radio"
                          name="decision"
                          value={d}
                          checked={decision === d}
                          onChange={() => setDecision(d)}
                        />
                        <span>{t(`admin.decision.${d}`)}</span>
                      </label>
                    ))}
                  </fieldset>
                  <TextArea
                    label={t('common.reason')}
                    hint={t('admin.decision_reason_hint')}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={2000}
                    error={
                      reasonMissing && reason.length > 0 ? t('field.reason_required') : undefined
                    }
                  />
                  <Button type="submit" disabled={reasonMissing}>
                    {t('admin.record_decision')}
                  </Button>
                </form>
              </section>
            ) : null}

            {c.reason && c.state !== 'UNDER_REVIEW' ? (
              <Alert kind="info" title={t('common.reason')}>
                <p className="pre-wrap">{c.reason}</p>
              </Alert>
            ) : null}

            <section className="card" aria-labelledby="tl-heading">
              <h2 id="tl-heading">{t('company.history')}</h2>
              <Timeline events={c.events} audience="admin" />
            </section>

            <ConfirmDialog
              open={confirming}
              title={t('admin.decision')}
              body={t('admin.confirm_decision', {
                decision: t(`admin.decision.${decision}`),
                company: c.company.display_name,
              })}
              confirmLabel={t('common.confirm')}
              danger={decision === 'REJECTED'}
              busy={decide.busy}
              error={decide.error}
              onClose={() => {
                setConfirming(false);
                decide.setError(null);
              }}
              onConfirm={async () => {
                const r = await decide.run<CaseDetail>(
                  `/admin/verification/${c.case_id}/decision`,
                  {
                    method: 'POST',
                    body: { decision, reason: reason.trim() || undefined, expected_state: c.state },
                  },
                );
                if (r.ok) {
                  setConfirming(false);
                  setRecorded(true);
                  setReason('');
                  if (r.data && 'case_id' in r.data) setData(r.data);
                  else reload();
                } else if (r.messageKey === 'common.stale_state') reload();
              }}
            />
          </>
        );
      }}
    </Resource>
  );
}

export default function AdminCasePage() {
  const params = useParams<{ caseId: string }>();
  return (
    <AdminShell require="admin.verification.review">
      <CaseBody caseId={params.caseId} />
    </AdminShell>
  );
}
