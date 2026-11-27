'use client';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useApp, useT } from '@/components/app-context';
import { PublicShell } from '@/components/public-shell';
import {
  Alert,
  ApiErrorAlert,
  Button,
  Field,
  PageHeader,
  Skeleton,
  useFieldError,
} from '@/components/ui';
import { takeFragmentToken } from '@/lib/nav';
import { useMutation } from '@/lib/use-resource';

export default function ResetPasswordPage() {
  const { locale } = useApp();
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => setToken((prev) => prev ?? takeFragmentToken()), []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = await m.run('/auth/password-reset/confirm', {
      method: 'POST',
      body: { token, new_password: password },
    });
    if (r.ok) setDone(true);
  }

  return (
    <PublicShell>
      <PageHeader title={t('auth.reset_title')} />
      {token === undefined ? <Skeleton lines={2} /> : null}
      {token === null ? (
        <>
          <Alert kind="error">{t('auth.token_missing')}</Alert>
          <Link href={`/${locale}/forgot-password`}>{t('auth.forgot_title')}</Link>
        </>
      ) : null}
      {done ? (
        <>
          <Alert kind="success">{t('auth.reset_done')}</Alert>
          <Link className="btn btn-primary" href={`/${locale}/login`}>
            {t('auth.go_to_login')}
          </Link>
        </>
      ) : null}
      {token && !done ? (
        <>
          {m.error && m.error.code !== 'VALIDATION_FAILED' ? (
            <ApiErrorAlert error={m.error} />
          ) : null}
          {m.error?.messageKey === 'auth.token_invalid' ? (
            <>
              <ApiErrorAlert error={m.error} />
              <Link href={`/${locale}/forgot-password`}>{t('auth.forgot_title')}</Link>
            </>
          ) : null}
          <form onSubmit={submit} noValidate className="form">
            <Field
              label={t('auth.new_password')}
              type="password"
              autoComplete="new-password"
              minLength={12}
              hint={t('auth.password_hint')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fe('new_password')}
              required
            />
            <Button type="submit" busy={m.busy}>
              {t('auth.reset_submit')}
            </Button>
          </form>
        </>
      ) : null}
    </PublicShell>
  );
}
