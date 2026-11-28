'use client';
import type { SandboxSession } from '@app/contracts';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { errorText, useApp, useT } from '@/components/app-context';
import { Money } from '@/components/catalog-ui';
import { SandboxNotice } from '@/components/commerce-ui';
import { Resource } from '@/components/resource';
import { AppShell } from '@/components/session';
import { Alert, Button, DefinitionList, PageHeader } from '@/components/ui';
import { useMutation, useResource } from '@/lib/use-resource';

/** Internal app paths only (the session's return URL is written by the server). */
function safeReturn(p: string): string | null {
  return /^\/app\/[A-Za-z0-9/_-]+$/.test(p) ? p : null;
}

/**
 * Sandbox hosted payment page (PAYMENT_MODE=mock only). Clearly labelled; no card data is asked
 * for and no money moves. Choosing an outcome queues a signed webhook; the order is confirmed only
 * after the API verifies and the worker processes that webhook.
 */
function Pay() {
  const t = useT();
  const { locale } = useApp();
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();
  const api = `/sandbox/psp/sessions/${sessionId}`;
  const { state, reload } = useResource<SandboxSession>(api);
  const m = useMutation();
  const back = (s: SandboxSession) => {
    const p = safeReturn(s.return_url);
    return p ? `/${locale}${p}` : `/${locale}/app`;
  };
  const complete = async (s: SandboxSession, outcome: 'success' | 'failure') => {
    const r = await m.run(`${api}/complete`, { method: 'POST', body: { outcome } });
    if (r.ok) router.push(back(s));
    else if (r.status === 409) reload();
  };
  return (
    <div className="narrow">
      <PageHeader title={t('sandbox.title')} />
      <SandboxNotice />
      <Resource state={state} reload={reload}>
        {(s) => (
          <section className="card" data-testid="sandbox-pay">
            <DefinitionList
              items={[
                [t('sandbox.reference'), <bdi key="r">{s.reference}</bdi>],
                [
                  t('sandbox.amount'),
                  <strong key="a">
                    <Money fils={s.amount_fils} />
                  </strong>,
                ],
                [t('sandbox.state'), t(`sandbox.state.${s.state}`)],
              ]}
            />
            {m.error ? <Alert kind="error">{errorText(locale, m.error)}</Alert> : null}
            {s.state === 'OPEN' ? (
              <div className="row-actions">
                <Button type="button" busy={m.busy} onClick={() => complete(s, 'success')}>
                  {t('sandbox.simulate_success')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  busy={m.busy}
                  onClick={() => complete(s, 'failure')}
                >
                  {t('sandbox.simulate_failure')}
                </Button>
                <Link className="btn btn-link" href={back(s)}>
                  {t('sandbox.return_without_paying')}
                </Link>
              </div>
            ) : (
              <p>
                <Link className="btn btn-primary" href={back(s)}>
                  {t('sandbox.return')}
                </Link>
              </p>
            )}
          </section>
        )}
      </Resource>
    </div>
  );
}

export default function SandboxPayPage() {
  return (
    <AppShell>
      <Pay />
    </AppShell>
  );
}
