'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useApp, useT } from '@/components/app-context';
import { PublicShell } from '@/components/public-shell';
import { Alert, ApiErrorAlert, Button, Field, PageHeader, Skeleton } from '@/components/ui';
import type { ApiError } from '@/lib/client';
import { api } from '@/lib/client';
import { takeFragmentToken } from '@/lib/nav';
import { useMutation } from '@/lib/use-resource';

type State =
  | { kind: 'verifying' }
  | { kind: 'verified' }
  | { kind: 'missing' }
  | { kind: 'failed'; error: ApiError };

export default function VerifyEmailPage() {
  const { locale } = useApp();
  const t = useT();
  const [state, setState] = useState<State>({ kind: 'verifying' });
  const started = useRef(false);
  const resend = useMutation();
  const [email, setEmail] = useState('');
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const token = takeFragmentToken();
    if (!token) {
      setState({ kind: 'missing' });
      return;
    }
    void api('/auth/verify-email', { method: 'POST', body: { token } }).then((r) =>
      setState(r.ok ? { kind: 'verified' } : { kind: 'failed', error: r }),
    );
  }, []);

  async function submitResend(e: FormEvent) {
    e.preventDefault();
    const r = await resend.run('/auth/resend-verification', { method: 'POST', body: { email } });
    if (r.ok) setResent(true);
  }

  return (
    <PublicShell>
      <PageHeader title={t('auth.verify_title')} />
      {state.kind === 'verifying' ? (
        <>
          <p>{t('auth.verifying')}</p>
          <Skeleton lines={1} />
        </>
      ) : null}
      {state.kind === 'verified' ? (
        <>
          <Alert kind="success">{t('auth.verified')}</Alert>
          <Link className="btn btn-primary" href={`/${locale}/app`}>
            {t('auth.continue')}
          </Link>
        </>
      ) : null}
      {state.kind === 'missing' ? <Alert kind="error">{t('auth.token_missing')}</Alert> : null}
      {state.kind === 'failed' ? <ApiErrorAlert error={state.error} /> : null}
      {state.kind === 'missing' || state.kind === 'failed' ? (
        <form onSubmit={submitResend} className="form" noValidate>
          {resent ? <Alert kind="success">{t('auth.resent')}</Alert> : null}
          {resend.error ? <ApiErrorAlert error={resend.error} /> : null}
          <Field
            label={t('auth.email')}
            type="email"
            dir="ltr"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="secondary" busy={resend.busy}>
            {t('auth.resend_verification')}
          </Button>
        </form>
      ) : null}
    </PublicShell>
  );
}
