'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useApp, useT } from '@/components/app-context';
import { PublicShell } from '@/components/public-shell';
import { Alert, ApiErrorAlert, Button, Field, PageHeader, useFieldError } from '@/components/ui';
import { useMutation } from '@/lib/use-resource';

export default function ForgotPasswordPage() {
  const { locale } = useApp();
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = await m.run('/auth/password-reset/request', { method: 'POST', body: { email } });
    if (r.ok) setSent(true);
  }

  return (
    <PublicShell>
      <PageHeader title={t('auth.forgot_title')} />
      {sent ? (
        // Same message whether or not the account exists (no account enumeration).
        <Alert kind="success">{t('auth.forgot_sent')}</Alert>
      ) : (
        <>
          <p>{t('auth.forgot_intro')}</p>
          {m.error && m.error.code !== 'VALIDATION_FAILED' ? (
            <ApiErrorAlert error={m.error} />
          ) : null}
          <form onSubmit={submit} noValidate className="form">
            <Field
              label={t('auth.email')}
              type="email"
              dir="ltr"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fe('email')}
              required
            />
            <Button type="submit" busy={m.busy}>
              {t('auth.forgot_submit')}
            </Button>
          </form>
        </>
      )}
      <p>
        <Link href={`/${locale}/login`}>{t('auth.go_to_login')}</Link>
      </p>
    </PublicShell>
  );
}
