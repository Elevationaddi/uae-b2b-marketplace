'use client';
import type { ConversationDetail, MessageItem } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { errorText, useApp, useT } from '@/components/app-context';
import { MessagesShell } from '@/components/messages-shell';
import { Resource } from '@/components/resource';
import type { Workspace } from '@/components/session';
import { Alert, Button, PageHeader, Skeleton, TextArea } from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { api } from '@/lib/client';
import { useMutation, useResource } from '@/lib/use-resource';

/** New messages are fetched every 15 seconds while the thread is open (no realtime channel yet). */
const POLL_MS = 15_000;

function Thread({ ws }: { ws: Workspace }) {
  const t = useT();
  const { locale } = useApp();
  const { conversationId } = useParams<{ conversationId: string }>();
  const capi = `/workspaces/${ws.id}/conversations/${conversationId}`;
  const conv = useResource<ConversationDetail>(capi);
  const latest = useResource<MessageItem[]>(`${capi}/messages`);
  const [older, setOlder] = useState<MessageItem[]>([]);
  const [olderCursor, setOlderCursor] = useState<string | null | undefined>(undefined);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sent, setSent] = useState<MessageItem[]>([]);
  const [body, setBody] = useState('');
  const m = useMutation();
  const lastRead = useRef<string | null>(null);
  const reloadLatest = latest.reload;

  useEffect(() => {
    const id = window.setInterval(reloadLatest, POLL_MS);
    return () => window.clearInterval(id);
  }, [reloadLatest]);

  const firstPage = latest.state.status === 'ready' ? latest.state.data : [];
  const nextCursor =
    olderCursor === undefined
      ? latest.state.status === 'ready'
        ? latest.state.nextCursor
        : null
      : olderCursor;
  // Pages arrive newest first; show oldest first. Messages sent here appear until the next poll.
  const byId = new Map<string, MessageItem>();
  for (const x of [...older, ...firstPage, ...sent]) byId.set(x.id, x);
  const all = [...byId.values()].sort((a, b) => a.created_at.localeCompare(b.created_at));
  const newest = all[all.length - 1];

  useEffect(() => {
    if (!newest || newest.id === lastRead.current) return;
    lastRead.current = newest.id;
    void api(`${capi}/read`, { method: 'POST', body: { last_message_id: newest.id } });
  }, [newest, capi]);

  const loadOlder = async () => {
    if (!nextCursor) return;
    setLoadingOlder(true);
    const r = await api<MessageItem[]>(`${capi}/messages`, { query: { cursor: nextCursor } });
    setLoadingOlder(false);
    if (r.ok) {
      setOlder((o) => [...r.data, ...o]);
      setOlderCursor(r.nextCursor);
    }
  };

  return (
    <Resource state={conv.state} reload={conv.reload} backHref={`/${locale}/app/messages/${ws.id}`}>
      {(c) => (
        <>
          <PageHeader title={c.counterpart.company_name} />
          <p className="muted">
            <Link href={`/${locale}/app/messages/${ws.id}`}>{t('nav.messages')}</Link>
            {c.rfq ? (
              <>
                {' · '}
                <Link
                  href={`/${locale}/app/${c.my_side === 'BUYER' ? 'buyer' : 'seller'}/${ws.id}/rfqs/${c.rfq.id}`}
                >
                  <bdi>{c.rfq.number}</bdi> {c.rfq.title}
                </Link>
              </>
            ) : null}
          </p>
          <p className="muted small">{t('messages.privacy_note')}</p>
          <section className="card chat" aria-label={t('messages.thread')}>
            {nextCursor ? (
              <Button type="button" variant="link" busy={loadingOlder} onClick={loadOlder}>
                {t('messages.load_older')}
              </Button>
            ) : null}
            {latest.state.status === 'loading' ? <Skeleton /> : null}
            {latest.state.status === 'error' ? (
              <Alert kind="error">{errorText(locale, latest.state.error)}</Alert>
            ) : null}
            {latest.state.status === 'ready' && all.length === 0 ? (
              <p className="muted">{t('messages.no_messages')}</p>
            ) : null}
            <ol className="chat-list" aria-live="polite" data-testid="chat-messages">
              {all.map((x) => (
                <li key={x.id} className={x.mine ? 'chat-msg mine' : 'chat-msg'}>
                  <div className="chat-meta muted small">
                    {x.sender_name} ·{' '}
                    <time dateTime={x.created_at}>{formatDubaiTime(x.created_at, locale)}</time>
                  </div>
                  <p className="pre-wrap">{x.body ?? t('messages.attachment')}</p>
                </li>
              ))}
            </ol>
          </section>
          {c.can_send ? (
            <form
              className="card"
              onSubmit={async (e) => {
                e.preventDefault();
                const r = await m.run<MessageItem>(`${capi}/messages`, {
                  method: 'POST',
                  body: { body },
                });
                if (r.ok) {
                  setSent((s) => [...s, r.data]);
                  setBody('');
                }
              }}
            >
              <TextArea
                label={t('messages.your_message')}
                value={body}
                rows={3}
                maxLength={4000}
                required
                onChange={(e) => setBody(e.target.value)}
              />
              {m.error ? <p className="field-error">{errorText(locale, m.error)}</p> : null}
              <Button type="submit" busy={m.busy} disabled={!body.trim()}>
                {t('messages.send')}
              </Button>
            </form>
          ) : (
            <Alert kind="info">
              {errorText(locale, {
                messageKey: c.send_blocked_reason ?? 'messages.counterpart_unavailable',
              })}
            </Alert>
          )}
        </>
      )}
    </Resource>
  );
}

export default function ConversationPage() {
  return (
    <MessagesShell>
      {(ws) => (
        <Suspense fallback={<Skeleton />}>
          <Thread ws={ws} />
        </Suspense>
      )}
    </MessagesShell>
  );
}
