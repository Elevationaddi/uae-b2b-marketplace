'use client';
import type { NotificationItem } from '@app/contracts';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { errorText, useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { AppShell } from '@/components/session';
import { Button, Empty, PageHeader, Pager, Skeleton } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useCursor, useMutation, useResource } from '@/lib/use-resource';

/** Only internal app paths written by the server are linked (never an absolute URL). */
function safePath(p: unknown): string | null {
  return typeof p === 'string' && /^\/app\/[A-Za-z0-9/_-]+$/.test(p) ? p : null;
}

function List() {
  const t = useT();
  const { locale } = useApp();
  const c = useCursor();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { state, reload, setData } = useResource<NotificationItem[]>('/notifications', {
    unread: unreadOnly ? 'true' : undefined,
    cursor: c.cursor || undefined,
  });
  const m = useMutation();
  const markRead = async (n: NotificationItem) => {
    if (n.read_at || state.status !== 'ready') return;
    const r = await m.run(`/notifications/${n.id}/read`, { method: 'POST' });
    if (r.ok)
      setData(
        state.data.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)),
      );
  };
  return (
    <>
      <PageHeader title={t('nav.notifications')}>
        <Button
          type="button"
          variant="secondary"
          busy={m.busy}
          onClick={async () => {
            const r = await m.run('/notifications/read-all', { method: 'POST' });
            if (r.ok) reload();
          }}
        >
          {t('notif.mark_all_read')}
        </Button>
      </PageHeader>
      <label className="check">
        <input
          type="checkbox"
          checked={unreadOnly}
          onChange={(e) => {
            setUnreadOnly(e.target.checked);
            c.first();
          }}
        />
        <span>{t('notif.unread_only')}</span>
      </label>
      {m.error ? <p className="field-error">{errorText(locale, m.error)}</p> : null}
      <Resource state={state} reload={reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('notif.empty')}</p>
            </Empty>
          ) : (
            <>
              <ul className="notif-list" data-testid="notifications">
                {items.map((n) => {
                  const path = safePath(n.payload.path);
                  const label = t(`notif.type.${n.type}` as MessageKey, {
                    number: String(
                      n.payload.rfq_number ??
                        n.payload.order_number ??
                        n.payload.dispute_number ??
                        n.payload.payout_number ??
                        n.payload.ticket_number ??
                        '',
                    ),
                    title: String(n.payload.title ?? ''),
                    company: String(n.payload.company ?? ''),
                    rate: String(n.payload.rate ?? ''),
                    date: String(n.payload.effective_date ?? ''),
                  });
                  return (
                    <li key={n.id} className={n.read_at ? undefined : 'unread'}>
                      {!n.read_at ? <span className="sr-only">{t('notif.unread')}</span> : null}
                      {path ? (
                        <Link href={`/${locale}${path}`} onClick={() => void markRead(n)}>
                          {label}
                        </Link>
                      ) : (
                        <span>{label}</span>
                      )}
                      <time className="muted small" dateTime={n.created_at}>
                        {formatDubaiTime(n.created_at, locale)}
                      </time>
                      {!n.read_at ? (
                        <Button type="button" variant="link" onClick={() => void markRead(n)}>
                          {t('notif.mark_read')}
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              <Pager hasPrev={c.hasPrev} nextCursor={next} onFirst={c.first} onNext={c.next} />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function NotificationsPage() {
  return (
    <AppShell>
      <Suspense fallback={<Skeleton />}>
        <List />
      </Suspense>
    </AppShell>
  );
}
