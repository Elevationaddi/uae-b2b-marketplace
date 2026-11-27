'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import { useApp, useT } from '@/components/app-context';
import { PublicShell } from '@/components/public-shell';
import { ApiErrorAlert, Button, Field, PageHeader, Skeleton, useFieldError } from '@/components/ui';
import { safeNext } from '@/lib/nav';
import { useMutation } from '@/lib/use-resource';

function LoginForm() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get('next') ?? null;
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [form, setForm] = useState({ email: '', password: '' });

  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = await m.run('/auth/login', { method: 'POST', body: form });
    if (r.ok) router.replace(safeNext(locale, next));
  }

  return (
    <>
      <PageHeader title={t('auth.login_title')} />
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      <form onSubmit={submit} noValidate className="form">
        <Field
          label={t('auth.email')}
          name="email"
          type="email"
          autoComplete="username"
          dir="ltr"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={fe('email')}
        />
        <Field
          label={t('auth.password')}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={fe('password')}
        />
        <Button type="submit" busy={m.busy}>
          {t('auth.login_submit')}
        </Button>
      </form>
      <p>
        <Link href={`/${locale}/forgot-password`}>{t('auth.forgot_link')}</Link>
      </p>
      <p>
        {t('auth.no_account')}{' '}
        <Link href={`/${locale}/register${next ? `?next=${encodeURIComponent(next)}` : ''}`}>
          {t('nav.register')}
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <PublicShell>
      <Suspense fallback={<Skeleton />}>
        <LoginForm />
      </Suspense>
    </PublicShell>
  );
}
