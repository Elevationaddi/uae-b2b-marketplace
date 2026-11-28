'use client';
import type { ConversationDetail } from '@app/contracts';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { errorText, useApp, useT } from '@/components/app-context';
import { AppShell, useSession } from '@/components/session';
import { Button, PageHeader, Skeleton, TextArea } from '@/components/ui';
import { useMutation } from '@/lib/use-resource';

/**
 * Entry point from a supplier storefront: the user's buyer workspace starts (or continues) a
 * conversation with that supplier. Eligibility is checked by the API.
 */
function NewConversation() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const storefront = params?.get('storefront') ?? '';
  const { me, workspace } = useSession();
  const buyers = me.workspaces.filter((w) => w.kind === 'BUYER' && w.role !== 'VIEWER');
  const ws = buyers.find((w) => w.id === workspace?.id) ?? buyers[0];
  const [body, setBody] = useState('');
  const m = useMutation();
  if (!ws || !/^[0-9a-f-]{36}$/i.test(storefront))
    return (
      <div className="empty" role="alert">
        <h1>{t('rfq.need_buyer_title')}</h1>
        <p>{t('messages.need_buyer_body')}</p>
        <Link className="btn btn-primary" href={`/${locale}/app`}>
          {t('nav.home')}
        </Link>
      </div>
    );
  return (
    <>
      <PageHeader title={t('messages.message_supplier')} />
      <p className="muted">
        {ws.company.display_name} · {t('kind.BUYER')}
      </p>
      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault();
          const r = await m.run<ConversationDetail>(`/workspaces/${ws.id}/conversations`, {
            method: 'POST',
            body: { storefront_id: storefront, body },
          });
          if (r.ok) router.replace(`/${locale}/app/messages/${ws.id}/${r.data.id}`);
        }}
      >
        <TextArea
          label={t('messages.your_message')}
          value={body}
          rows={4}
          maxLength={4000}
          required
          hint={t('messages.privacy_note')}
          onChange={(e) => setBody(e.target.value)}
        />
        {m.error ? <p className="field-error">{errorText(locale, m.error)}</p> : null}
        <Button type="submit" busy={m.busy} disabled={!body.trim()}>
          {t('messages.send')}
        </Button>
      </form>
    </>
  );
}

export default function NewConversationPage() {
  return (
    <AppShell>
      <Suspense fallback={<Skeleton />}>
        <NewConversation />
      </Suspense>
    </AppShell>
  );
}
