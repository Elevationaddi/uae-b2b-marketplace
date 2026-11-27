'use client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AdminFrame } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { ApiErrorAlert, Button, Field, PageHeader, useFieldError } from '@/components/ui';
import { useMutation } from '@/lib/use-resource';

export default function AdminLoginPage() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [form, setForm] = useState({ email: '', password: '' });

  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = await m.run<{ mfa: 'ENROLL_REQUIRED' | 'VERIFY_REQUIRED' }>('/admin/auth/login', {
      method: 'POST',
      body: form,
    });
    if (r.ok)
      router.replace(
        `/${locale}/admin/mfa?step=${r.data.mfa === 'ENROLL_REQUIRED' ? 'enroll' : 'verify'}`,
      );
  }

  return (
    <AdminFrame>
      <div className="container-narrow">
        <PageHeader title={t('admin.login_title')} />
        <p>{t('admin.login_intro')}</p>
        {m.error ? <ApiErrorAlert error={m.error} /> : null}
        <form onSubmit={submit} noValidate className="form">
          <Field
            label={t('auth.email')}
            type="email"
            dir="ltr"
            autoComplete="username"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={fe('email')}
            required
          />
          <Field
            label={t('auth.password')}
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={fe('password')}
            required
          />
          <Button type="submit" busy={m.busy}>
            {t('auth.login_submit')}
          </Button>
        </form>
      </div>
    </AdminFrame>
  );
}
