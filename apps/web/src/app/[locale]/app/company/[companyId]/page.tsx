'use client';
import {
  ALLOWED_UPLOAD_MIME,
  CURRENT_TERMS_VERSION,
  DOCUMENT_TYPES,
  type CompanyResponse,
  type VerificationCaseResponse,
} from '@app/contracts';
import { useParams } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { errorText, useApp, useT, type Translate } from '@/components/app-context';
import { Timeline } from '@/components/timeline';
import { CompanyForm, initialCompanyValues } from '@/components/company-form';
import { Resource } from '@/components/resource';
import { AppShell, useSession } from '@/components/session';
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
  useFieldError,
} from '@/components/ui';
import { formatDate, formatDubaiTime, type Locale, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Overview = { current: VerificationCaseResponse | null; history: VerificationCaseResponse[] };
type Doc = VerificationCaseResponse['documents'][number];

function formatBytes(n: number, locale: Locale) {
  const nf = new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', { maximumFractionDigits: 1 });
  return n >= 1024 * 1024 ? `${nf.format(n / 1024 / 1024)} MB` : `${nf.format(Math.max(1, Math.round(n / 1024)))} KB`;
}

function CompanyPage({ companyId }: { companyId: string }) {
  const { locale } = useApp();
  const t = useT();
  const { me } = useSession();
  const company = useResource<CompanyResponse>(`/companies/${companyId}`);
  const verification = useResource<Overview>(`/companies/${companyId}/verification`);
  const mine = me.workspaces.filter((w) => w.company.id === companyId);
  const canManage = mine.some((w) => w.capabilities.includes('company.manage'));
  const canDownload = mine.some((w) => w.capabilities.includes('legal_documents.read'));
  const reloadAll = () => {
    company.reload();
    verification.reload();
  };

  return (
    <Resource state={company.state} reload={company.reload} backHref={`/${locale}/app`}>
      {(c) => (
        <>
          <PageHeader title={c.display_name}>
            <StatusBadge value={c.status} label={t(`cstatus.${c.status}` as MessageKey)} />
          </PageHeader>
          {c.licence_expired ? <Alert kind="warning">{t('company.licence_expired')}</Alert> : null}
          <p className="muted">
            <strong>{t('home.next_step')}:</strong> {t(`home.next.${c.status}` as MessageKey)}
          </p>
          <Details company={c} canManage={canManage} onSaved={company.setData} onStale={reloadAll} />
          <section className="card" aria-labelledby="ver-heading">
            <h2 id="ver-heading">{t('company.verification')}</h2>
            <Resource state={verification.state} reload={verification.reload}>
              {(v) => (
                <>
                  {v.current ? (
                    <CurrentCase
                      company={c}
                      vc={v.current}
                      canManage={canManage}
                      canDownload={canDownload}
                      onChange={reloadAll}
                    />
                  ) : canManage && (c.status === 'APPROVED' || (c.status === 'SUSPENDED' && c.licence_expired)) ? (
                    <Renewal companyId={c.id} onStarted={reloadAll} />
                  ) : (
                    <p className="muted">{t('common.none')}</p>
                  )}
                  {v.history.length ? (
                    <details className="history">
                      <summary>{t('company.history')}</summary>
                      {v.history.map((h) => (
                        <div key={h.id} className="history-case">
                          <p>
                            <strong>{t(`admin.case_kind.${h.kind}`)}</strong> ·{' '}
                            <StatusBadge value={h.state} label={t(`cstatus.${h.state}` as MessageKey)} />
                          </p>
                          <Timeline events={h.events} />
                        </div>
                      ))}
                    </details>
                  ) : null}
                </>
              )}
            </Resource>
          </section>
          <section className="card" aria-labelledby="wsa-heading">
            <h2 id="wsa-heading">{t('company.workspace_access')}</h2>
            <ul className="inline-list">
              {c.workspaces.map((w) => (
                <li key={w.id}>
                  {t(`kind.${w.kind}`)} · <StatusBadge value={w.status} label={t(`wstatus.${w.status}` as MessageKey)} />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </Resource>
  );
}

function Details({
  company: c,
  canManage,
  onSaved,
  onStale,
}: {
  company: CompanyResponse;
  canManage: boolean;
  onSaved: (c: CompanyResponse) => void;
  onStale: () => void;
}) {
  const { locale } = useApp();
  const t = useT();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const m = useMutation();
  return (
    <section className="card" aria-labelledby="details-heading">
      <div className="card-head">
        <h2 id="details-heading">{t('company.details')}</h2>
        {canManage && c.editable && !editing ? (
          <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
            {t('company.edit')}
          </Button>
        ) : null}
      </div>
      {saved ? <Alert kind="success">{t('common.saved')}</Alert> : null}
      {!c.editable ? <p className="muted">{t('company.locked')}</p> : null}
      {editing ? (
        <CompanyForm
          initial={initialCompanyValues(c)}
          submitLabel={t('common.save')}
          busy={m.busy}
          error={m.error}
          onCancel={() => setEditing(false)}
          onSubmit={async (v) => {
            const r = await m.run<CompanyResponse>(`/companies/${c.id}`, {
              method: 'PATCH',
              body: { ...v, expected_version: c.version },
            });
            if (r.ok) {
              onSaved(r.data);
              setEditing(false);
              setSaved(true);
            } else if (r.messageKey === 'common.stale_version') onStale();
          }}
        />
      ) : (
        <DefinitionList
          items={[
            [t('company.legal_name'), c.legal_name],
            [t('company.display_name'), c.display_name],
            [t('company.licence_number'), <bdi key="ln">{c.licence_number}</bdi>],
            [t('company.licence_issuer'), c.licence_issuer],
            [t('company.licence_expiry'), formatDate(c.licence_expiry, locale)],
            [t('company.activity'), c.activity],
            [t('company.emirate'), t(`emirate.${c.emirate}`)],
            [t('company.trn'), c.trn ? <bdi key="trn">{c.trn}</bdi> : t('common.none')],
            [t('company.contact_email'), <bdi key="em">{c.contact_email}</bdi>],
            [t('company.contact_phone'), <bdi key="ph">{c.contact_phone}</bdi>],
          ]}
        />
      )}
    </section>
  );
}

function docErrors(t: Translate, fieldErrors: Record<string, string>): string[] {
  return Object.entries(fieldErrors).map(([k, code]) => {
    const label = (DOCUMENT_TYPES as readonly string[]).includes(k) ? t(`doc.${k}` as MessageKey) : k === 'documents' ? t('company.documents') : k;
    const msg = code === 'required' ? t('field.required') : code === 'infected' ? t('field.infected') : code === 'future' ? t('field.future') : t('field.invalid');
    return `${label}: ${msg}`;
  });
}

function CurrentCase({
  company,
  vc,
  canManage,
  canDownload,
  onChange,
}: {
  company: CompanyResponse;
  vc: VerificationCaseResponse;
  canManage: boolean;
  canDownload: boolean;
  onChange: () => void;
}) {
  const { locale, uploadMaxBytes } = useApp();
  const t = useT();
  const submit = useMutation();
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canEdit = vc.editable && canManage;
  const isResubmit = vc.state === 'NEEDS_INFO' || vc.state === 'REJECTED';

  async function doSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accepted) return;
    const r = await submit.run(`/companies/${company.id}/verification`, {
      method: 'POST',
      body: { terms_version: CURRENT_TERMS_VERSION, expected_version: company.version },
    });
    if (r.ok) {
      setSubmitted(true);
      onChange();
    }
  }

  return (
    <>
      <p>
        <strong>{t(`admin.case_kind.${vc.kind}`)}</strong> · <StatusBadge value={vc.state} label={t(`cstatus.${vc.state}` as MessageKey)} />
        {vc.submitted_at ? (
          <span className="muted">
            {' '}
            · {t('admin.submitted_at')}: {formatDubaiTime(vc.submitted_at, locale)}
          </span>
        ) : null}
      </p>
      {vc.proposed ? (
        <DefinitionList
          items={[
            [t('company.renewal_proposed'), <bdi key="p">{vc.proposed.licence_number}</bdi>],
            [t('company.licence_issuer'), vc.proposed.licence_issuer],
            [t('company.licence_expiry'), formatDate(vc.proposed.licence_expiry, locale)],
          ]}
        />
      ) : null}
      {vc.reason && isResubmit ? (
        <Alert kind="warning" title={t('company.reason_from_compliance')}>
          <p className="pre-wrap">{vc.reason}</p>
        </Alert>
      ) : null}
      {submitted ? <Alert kind="success">{t('company.submitted_ok')}</Alert> : null}

      <h3>{t('company.documents')}</h3>
      {canEdit ? <p>{t('company.documents_intro', { size: Math.round(uploadMaxBytes / 1024 / 1024) })}</p> : null}
      <Documents companyId={company.id} docs={vc.documents} canEdit={canEdit} canDownload={canDownload} onChange={onChange} />
      {canEdit ? <UploadForm companyId={company.id} onUploaded={onChange} /> : null}

      {canEdit ? (
        <form onSubmit={doSubmit} className="form submit-box" noValidate>
          {submit.error ? (
            <Alert kind="error" title={t('common.error_title')}>
              <p>{errorText(locale, submit.error)}</p>
              {Object.keys(submit.error.fieldErrors).length ? (
                <ul>
                  {docErrors(t, submit.error.fieldErrors).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : null}
              {submit.error.requestId ? (
                <p className="muted">
                  {t('common.reference')}: <code>{submit.error.requestId}</code>
                </p>
              ) : null}
            </Alert>
          ) : null}
          <label className="check">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} required />
            <span>{t('company.terms_accept', { version: CURRENT_TERMS_VERSION })}</span>
          </label>
          <p className="muted">{t('company.terms_pending_note')}</p>
          <Button type="submit" busy={submit.busy} disabled={!accepted}>
            {isResubmit ? t('company.resubmit') : t('company.submit')}
          </Button>
        </form>
      ) : null}

      <h3>{t('company.history')}</h3>
      <Timeline events={vc.events} />
    </>
  );
}

function Documents({
  companyId,
  docs,
  canEdit,
  canDownload,
  onChange,
}: {
  companyId: string;
  docs: Doc[];
  canEdit: boolean;
  canDownload: boolean;
  onChange: () => void;
}) {
  const { locale } = useApp();
  const t = useT();
  const [removing, setRemoving] = useState<Doc | null>(null);
  const m = useMutation();
  if (docs.length === 0) return <Empty>{t('company.no_documents')}</Empty>;
  return (
    <>
      <ul className="doc-list">
        {docs.map((d) => (
          <li key={d.id} className="doc">
            <div>
              <strong>{t(`doc.${d.type}`)}</strong>
              <div className="muted">
                <bdi>{d.file.original_name}</bdi> · <bdi>{formatBytes(d.file.bytes, locale)}</bdi>
                {d.expires_at ? ` · ${t('company.document_expiry')}: ${formatDate(d.expires_at, locale)}` : ''}
              </div>
            </div>
            <div className="doc-actions">
              <StatusBadge value={d.file.scan_state} label={t(`company.scan.${d.file.scan_state}`)} />
              {canDownload && d.file.scan_state === 'CLEAN' ? (
                <a className="btn btn-link" href={`/api/v1/files/${d.file.id}/download`} download>
                  {t('common.download')}
                </a>
              ) : null}
              {canEdit ? (
                <Button type="button" variant="link" onClick={() => setRemoving(d)}>
                  {t('common.remove')}
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={removing !== null}
        title={t('common.remove')}
        body={removing ? `${t('company.confirm_remove_doc')} ${removing.file.original_name}` : undefined}
        confirmLabel={t('common.remove')}
        danger
        busy={m.busy}
        error={m.error}
        onClose={() => {
          setRemoving(null);
          m.setError(null);
        }}
        onConfirm={async () => {
          if (!removing) return;
          const r = await m.run(`/companies/${companyId}/documents/${removing.id}`, { method: 'DELETE' });
          if (r.ok) {
            setRemoving(null);
            onChange();
          }
        }}
      />
    </>
  );
}

function UploadForm({ companyId, onUploaded }: { companyId: string; onUploaded: () => void }) {
  const { locale, uploadMaxBytes } = useApp();
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const fileRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<string>('TRADE_LICENCE');
  const [expires, setExpires] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [done, setDone] = useState<'clean' | 'blocked' | null>(null);

  async function upload(e: FormEvent) {
    e.preventDefault();
    setDone(null);
    setLocalError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setLocalError(t('field.required'));
      return;
    }
    // Advisory only: the server re-checks size and sniffs the real file type.
    if (file.size > uploadMaxBytes) {
      setLocalError(t('field.too_large'));
      return;
    }
    const form = new FormData();
    form.append('type', type);
    if (expires) form.append('expires_at', expires);
    form.append('file', file);
    const r = await m.run<Doc>(`/companies/${companyId}/documents`, { method: 'POST', form });
    if (r.ok) {
      setDone(r.data.file.scan_state === 'INFECTED' ? 'blocked' : 'clean');
      setExpires('');
      if (fileRef.current) fileRef.current.value = '';
      onUploaded();
    }
  }

  const fileError = localError ?? fe('file');
  return (
    <form onSubmit={upload} className="form upload-form" noValidate>
      {m.error && !m.error.fieldErrors.file ? <ApiErrorAlert error={m.error} /> : null}
      {done === 'clean' ? <Alert kind="success">{t('company.uploaded')}</Alert> : null}
      {done === 'blocked' ? <Alert kind="error">{t('company.upload_blocked')}</Alert> : null}
      <div className="grid-3">
        <SelectField
          label={t('company.document_type')}
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={DOCUMENT_TYPES.map((d) => ({ value: d, label: t(`doc.${d}`) }))}
          error={fe('type')}
        />
        <Field
          label={t('company.document_expiry')}
          optional
          type="date"
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
          error={fe('expires_at')}
        />
        <Field
          label={t('company.file')}
          type="file"
          ref={fileRef}
          accept={ALLOWED_UPLOAD_MIME.join(',')}
          error={fileError}
          lang={locale}
        />
      </div>
      <Button type="submit" variant="secondary" busy={m.busy}>
        {m.busy ? t('company.uploading') : t('company.upload')}
      </Button>
    </form>
  );
}

function Renewal({ companyId, onStarted }: { companyId: string; onStarted: () => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [v, setV] = useState({ licence_number: '', licence_issuer: '', licence_expiry: '' });
  return (
    <form
      className="form"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await m.run(`/companies/${companyId}/renewal`, { method: 'POST', body: v });
        if (r.ok) onStarted();
      }}
    >
      <h3>{t('company.renewal_title')}</h3>
      <p>{t('company.renewal_intro')}</p>
      {m.error && m.error.code !== 'VALIDATION_FAILED' ? <ApiErrorAlert error={m.error} /> : null}
      <div className="grid-3">
        <Field
          label={t('company.licence_number')}
          dir="ltr"
          value={v.licence_number}
          onChange={(e) => setV({ ...v, licence_number: e.target.value })}
          error={fe('licence_number')}
          required
        />
        <Field
          label={t('company.licence_issuer')}
          value={v.licence_issuer}
          onChange={(e) => setV({ ...v, licence_issuer: e.target.value })}
          error={fe('licence_issuer')}
          required
        />
        <Field
          label={t('company.licence_expiry')}
          type="date"
          value={v.licence_expiry}
          onChange={(e) => setV({ ...v, licence_expiry: e.target.value })}
          error={fe('licence_expiry')}
          required
        />
      </div>
      <Button type="submit" busy={m.busy}>
        {t('company.renewal_start')}
      </Button>
    </form>
  );
}

export default function CompanyRoute() {
  const params = useParams<{ companyId: string }>();
  return (
    <AppShell>
      <CompanyPage companyId={params.companyId} />
    </AppShell>
  );
}
