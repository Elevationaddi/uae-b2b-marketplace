'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useApp, useT } from '@/components/app-context';
import { PublicShell } from '@/components/public-shell';
import { Alert, ApiErrorAlert, Button, Field, PageHeader, SelectField, useFieldError } from '@/components/ui';
import { useMutation } from '@/lib/use-resource';

export default function RegisterPage() {
  const { locale } = useApp();
  const t = useT();
  const m = useMutation();
  const resend = useMutation();
  const fe = useFieldError(m.error);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', locale: locale as string });
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = await m.run('/auth/register', { method: 'POST', body: form });
    if (r.ok) setSentTo(form.email.trim());
  }

  if (sentTo) {
    return (
      <PublicShell>
        <PageHeader title={t('auth.check_email_title')} />
        <p>{t('auth.check_email_body')}</p>
        <p>
          <strong dir="ltr">{sentTo}</strong>
        </p>
        {resent ? <Alert kind="success">{t('auth.resent')}</Alert> : null}
        {resend.error ? <ApiErrorAlert error={resend.error} /> : null}
        <div className="actions">
          <Button
            type="button"
            variant="secondary"
            busy={resend.busy}
            onClick={async () => {
              const r = await resend.run('/auth/resend-verification', { method: 'POST', body: { email: sentTo } });
              if (r.ok) setResent(true);
            }}
          >
            {t('auth.resend_verification')}
          </Button>
          <Link href={`/${locale}/login`}>{t('auth.go_to_login')}</Link>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <PageHeader title={t('auth.register_title')} />
      <p>{t('auth.register_intro')}</p>
      {m.error && m.error.code !== 'VALIDATION_FAILED' ? <ApiErrorAlert error={m.error} /> : null}
      {m.error?.code === 'VALIDATION_FAILED' ? <Alert kind="error">{t('error.common.validation_failed')}</Alert> : null}
      <form onSubmit={submit} noValidate className="form">
        <Field
          label={t('auth.full_name')}
          name="full_name"
          autoComplete="name"
          required
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          error={fe('full_name')}
        />
        <Field
          label={t('auth.email')}
          name="email"
          type="email"
          autoComplete="email"
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
          autoComplete="new-password"
          required
          minLength={12}
          hint={t('auth.password_hint')}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={fe('password')}
        />
        <SelectField
          label={t('auth.preferred_language')}
          name="locale"
          value={form.locale}
          onChange={(e) => setForm({ ...form, locale: e.target.value })}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'العربية' },
          ]}
        />
        <Button type="submit" busy={m.busy}>
          {t('auth.register_submit')}
        </Button>
      </form>
      <p>
        {t('auth.have_account')} <Link href={`/${locale}/login`}>{t('nav.sign_in')}</Link>
      </p>
    </PublicShell>
  );
}
