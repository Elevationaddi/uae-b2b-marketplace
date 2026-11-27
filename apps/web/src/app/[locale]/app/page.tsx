'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useApp, useT } from '@/components/app-context';
import { AppShell, useSession } from '@/components/session';
import { Alert, Empty, PageHeader, StatusBadge } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';

function Joined() {
  const t = useT();
  const params = useSearchParams();
  return params?.get('joined') ? <Alert kind="success">{t('invite.accepted')}</Alert> : null;
}

function Home() {
  const { locale } = useApp();
  const t = useT();
  const { me, selectWorkspace } = useSession();
  const name = me.user.full_name ?? me.user.email;

  // Group workspaces by company: one card per company, listing the caller's workspaces in it.
  const companies = new Map<
    string,
    { id: string; name: string; status: string; ws: typeof me.workspaces }
  >();
  for (const w of me.workspaces) {
    const c = companies.get(w.company.id) ?? {
      id: w.company.id,
      name: w.company.display_name,
      status: w.company.status,
      ws: [],
    };
    c.ws.push(w);
    companies.set(w.company.id, c);
  }

  return (
    <>
      <PageHeader title={t('home.title', { name })} />
      <Suspense>
        <Joined />
      </Suspense>
      {companies.size === 0 ? (
        <Empty>
          <h2>{t('home.no_company_title')}</h2>
          <p>{t('home.no_company_body')}</p>
          {me.can_create_company ? (
            <Link className="btn btn-primary" href={`/${locale}/app/onboarding`}>
              {t('home.create_company')}
            </Link>
          ) : null}
        </Empty>
      ) : (
        <section aria-labelledby="ws-heading">
          <h2 id="ws-heading">{t('home.your_workspaces')}</h2>
          <ul className="cards">
            {[...companies.values()].map((c) => (
              <li key={c.id} className="card">
                <div className="card-head">
                  <h3>{c.name}</h3>
                  <StatusBadge value={c.status} label={t(`cstatus.${c.status}` as MessageKey)} />
                </div>
                <ul className="inline-list">
                  {c.ws.map((w) => (
                    <li key={w.id}>
                      {t(`kind.${w.kind}`)} · {t(`role.${w.role}` as MessageKey)} ·{' '}
                      <StatusBadge
                        value={w.status}
                        label={t(`wstatus.${w.status}` as MessageKey)}
                      />
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>{t('home.next_step')}:</strong> {t(`home.next.${c.status}` as MessageKey)}
                </p>
                <Link
                  className="btn btn-secondary"
                  href={`/${locale}/app/company/${c.id}`}
                  onClick={() => c.ws[0] && selectWorkspace(c.ws[0].id)}
                >
                  {t('home.open_company')}
                </Link>
              </li>
            ))}
          </ul>
          {me.can_create_company ? (
            <p>
              <Link href={`/${locale}/app/onboarding`}>{t('home.add_company')}</Link>
            </p>
          ) : null}
        </section>
      )}
    </>
  );
}

export default function AppHomePage() {
  return (
    <AppShell>
      <Home />
    </AppShell>
  );
}
