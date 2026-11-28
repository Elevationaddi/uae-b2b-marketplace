'use client';
import type { ConversationItem } from '@app/contracts';
import Link from 'next/link';
import { Suspense } from 'react';
import { useApp, useT } from '@/components/app-context';
import { MessagesShell } from '@/components/messages-shell';
import { Resource } from '@/components/resource';
import type { Workspace } from '@/components/session';
import { Empty, PageHeader, Pager, Skeleton } from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

function List({ ws }: { ws: Workspace }) {
  const t = useT();
  const { locale } = useApp();
  const c = useCursor();
  const { state, reload } = useResource<ConversationItem[]>(`/workspaces/${ws.id}/conversations`, {
    cursor: c.cursor || undefined,
  });
  const base = `/${locale}/app/messages/${ws.id}`;
  return (
    <>
      <PageHeader title={t('nav.messages')} />
      <p className="muted">
        {ws.company.display_name} · {t(ws.kind === 'BUYER' ? 'kind.BUYER' : 'kind.SELLER')}
      </p>
      <Resource state={state} reload={reload} lines={5}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t(ws.kind === 'BUYER' ? 'messages.empty_buyer' : 'messages.empty_seller')}</p>
            </Empty>
          ) : (
            <>
              <ul className="conv-list" data-testid="conversations">
                {items.map((cv) => (
                  <li key={cv.id} className={cv.unread ? 'unread' : undefined}>
                    <Link href={`${base}/${cv.id}`}>
                      <span className="conv-title">
                        <strong>{cv.counterpart.company_name}</strong>
                        {cv.unread ? (
                          <span
                            className="nav-badge"
                            aria-label={t('nav.unread', { count: cv.unread })}
                          >
                            {cv.unread}
                          </span>
                        ) : null}
                      </span>
                      {cv.rfq ? (
                        <span className="muted small">
                          <bdi>{cv.rfq.number}</bdi> · {cv.rfq.title}
                        </span>
                      ) : null}
                      {cv.last_message ? (
                        <span className="conv-preview muted small">
                          {cv.last_message.mine ? `${t('messages.you')}: ` : ''}
                          {cv.last_message.body ?? t('messages.attachment')}
                        </span>
                      ) : null}
                      <time className="muted small" dateTime={cv.last_message_at}>
                        {formatDubaiTime(cv.last_message_at, locale)}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
              <Pager hasPrev={c.hasPrev} nextCursor={next} onFirst={c.first} onNext={c.next} />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function MessagesPage() {
  return (
    <MessagesShell>
      {(ws) => (
        <Suspense fallback={<Skeleton />}>
          <List ws={ws} />
        </Suspense>
      )}
    </MessagesShell>
  );
}
