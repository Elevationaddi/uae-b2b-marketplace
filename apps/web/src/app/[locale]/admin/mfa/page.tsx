'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import { AdminFrame } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Alert, ApiErrorAlert, Button, Field, PageHeader, Skeleton, useFieldError } from '@/components/ui';
import { api, type ApiError } from '@/lib/client';
import { useMutation } from '@/lib/use-resource';

type Enrolment = { otpauth_url: string; secret: string; qr_svg: string };

function Enroll({ onAlreadyEnrolled }: { onAlreadyEnrolled: () => void }) {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const [enrolment, setEnrolment] = useState<Enrolment | null>(null);
  const [loadError, setLoadError] = useState<ApiError | null>(null);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [code, setCode] = useState('');
  const started = useRef(false);
  const m = useMutation();
  const fe = useFieldError(m.error);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void api<Enrolment>('/admin/auth/mfa/enroll/start', { method: 'POST' }).then((r) => {
      if (r.ok) setEnrolment(r.data);
      else if (r.messageKey === 'admin.mfa_already_enrolled') onAlreadyEnrolled();
      else if (r.status === 401) router.replace(`/${locale}/admin/login`);
      else setLoadError(r);
    });
  }, [locale, router, onAlreadyEnrolled]);

  async function confirm(e: FormEvent) {
    e.preventDefault();
    const r = await m.run<{ recovery_codes: string[] }>('/admin/auth/mfa/enroll/confirm', { method: 'POST', body: { code } });
    if (r.ok) setCodes(r.data.recovery_codes);
  }

  if (codes) {
    return (
      <>
        <PageHeader title={t('admin.recovery_title')} />
        <Alert kind="warning">{t('admin.recovery_intro')}</Alert>
        <ol className="codes" dir="ltr" data-testid="recovery-codes">
          {codes.map((c) => (
            <li key={c}>
              <code>{c}</code>
            </li>
          ))}
        </ol>
        <Button type="button" onClick={() => router.replace(`/${locale}/admin`)}>
          {t('admin.recovery_saved')}
        </Button>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t('admin.mfa_enroll_title')} />
      <p>{t('admin.mfa_enroll_intro')}</p>
      {loadError ? <ApiErrorAlert error={loadError} /> : null}
      {!enrolment && !loadError ? <Skeleton /> : null}
      {enrolment ? (
        <>
          {/* Rendered as an image so the SVG cannot run script in the page; next/image adds nothing for a data URL. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="qr"
            width={200}
            height={200}
            alt={t('admin.mfa_qr_alt')}
            src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(enrolment.qr_svg)}`}
          />
          <p>
            {t('admin.mfa_secret')}: <code dir="ltr" data-testid="mfa-secret">{enrolment.secret}</code>
          </p>
          {m.error && !m.error.fieldErrors.code ? <ApiErrorAlert error={m.error} /> : null}
          <form onSubmit={confirm} noValidate className="form">
            <Field
              label={t('admin.mfa_code')}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              dir="ltr"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              error={m.error?.fieldErrors.code ? t('error.admin.mfa_code_invalid') : fe('code')}
              required
            />
            <Button type="submit" busy={m.busy}>
              {t('admin.mfa_confirm')}
            </Button>
          </form>
        </>
      ) : null}
    </>
  );
}

function Verify() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const m = useMutation();
  const [useRecovery, setUseRecovery] = useState(false);
  const [value, setValue] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const body = useRecovery ? { recovery_code: value } : { code: value };
    const r = await m.run('/admin/auth/mfa/verify', { method: 'POST', body });
    if (r.ok) router.replace(`/${locale}/admin`);
    else if (r.status === 401 && r.messageKey === 'auth.unauthenticated') router.replace(`/${locale}/admin/login`);
  }

  const invalid = m.error?.messageKey === 'admin.mfa_code_invalid' || m.error?.code === 'VALIDATION_FAILED';
  return (
    <>
      <PageHeader title={t('admin.mfa_verify_title')} />
      <p>{t('admin.mfa_verify_intro')}</p>
      {m.error && !invalid ? <ApiErrorAlert error={m.error} /> : null}
      <form onSubmit={submit} noValidate className="form">
        {useRecovery ? (
          <Field
            label={t('admin.recovery_code')}
            dir="ltr"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={invalid ? t('error.admin.mfa_code_invalid') : undefined}
            required
          />
        ) : (
          <Field
            label={t('admin.mfa_code')}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            dir="ltr"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
            error={invalid ? t('error.admin.mfa_code_invalid') : undefined}
            required
          />
        )}
        <Button type="submit" busy={m.busy}>
          {t('admin.verify')}
        </Button>
      </form>
      <Button
        type="button"
        variant="link"
        onClick={() => {
          setUseRecovery(!useRecovery);
          setValue('');
          m.setError(null);
        }}
      >
        {useRecovery ? t('admin.mfa_use_code') : t('admin.mfa_use_recovery')}
      </Button>
    </>
  );
}

function MfaInner() {
  const params = useSearchParams();
  const [step, setStep] = useState<'enroll' | 'verify'>(params?.get('step') === 'enroll' ? 'enroll' : 'verify');
  return step === 'enroll' ? <Enroll onAlreadyEnrolled={() => setStep('verify')} /> : <Verify />;
}

export default function AdminMfaPage() {
  return (
    <AdminFrame>
      <div className="container-narrow">
        <Suspense fallback={<Skeleton />}>
          <MfaInner />
        </Suspense>
      </div>
    </AdminFrame>
  );
}
