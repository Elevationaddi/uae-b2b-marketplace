'use client';
import type { CompanyResponse } from '@app/contracts';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp, useT } from '@/components/app-context';
import { CompanyForm, initialCompanyValues } from '@/components/company-form';
import { AppShell, useSession } from '@/components/session';
import { PageHeader, useFieldError } from '@/components/ui';
import { useMutation } from '@/lib/use-resource';

function Onboarding() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const { selectWorkspace } = useSession();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [kinds, setKinds] = useState<('BUYER' | 'SELLER')[]>(['BUYER']);
  const toggle = (k: 'BUYER' | 'SELLER') =>
    setKinds((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  return (
    <>
      <PageHeader title={t('company.create_title')} />
      <p>{t('company.create_intro')}</p>
      <CompanyForm
        initial={initialCompanyValues()}
        submitLabel={t('company.create_submit')}
        busy={m.busy}
        error={m.error}
        onSubmit={async (v) => {
          const r = await m.run<CompanyResponse>('/companies', {
            method: 'POST',
            body: { ...v, kinds },
          });
          if (r.ok) {
            if (r.data.workspaces[0]) selectWorkspace(r.data.workspaces[0].id);
            router.push(`/${locale}/app/company/${r.data.id}`);
          }
        }}
        extra={
          <fieldset className="fieldset" aria-describedby={fe('kinds') ? 'kinds-err' : undefined}>
            <legend>{t('company.kinds')}</legend>
            {(['BUYER', 'SELLER'] as const).map((k) => (
              <label key={k} className="check">
                <input type="checkbox" checked={kinds.includes(k)} onChange={() => toggle(k)} />
                <span>
                  <strong>{t(`kind.${k}`)}</strong>
                  <br />
                  <span className="muted">
                    {t(k === 'BUYER' ? 'company.kind_buyer_hint' : 'company.kind_seller_hint')}
                  </span>
                </span>
              </label>
            ))}
            {fe('kinds') ? (
              <p id="kinds-err" className="field-error">
                {fe('kinds')}
              </p>
            ) : null}
          </fieldset>
        }
      />
    </>
  );
}

export default function OnboardingPage() {
  return (
    <AppShell>
      <Onboarding />
    </AppShell>
  );
}
