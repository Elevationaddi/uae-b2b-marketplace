'use client';
import type { CaughtEmailItem } from '@app/contracts';
import { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { Empty, PageHeader, Pager } from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

/** Staging mail catcher (C-20): emails the platform would have sent; nothing leaves staging. */
function Mailbox() {
  const t = useT();
  const { locale } = useApp();
  const [to, setTo] = useState('');
  const pager = useCursor();
  const res = useResource<CaughtEmailItem[]>('/admin/staging/emails', {
    to: to || undefined,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('admin.nav.mailbox')} />
      <p className="muted">{t('mailbox.intro')}</p>
      <label className="inline-field">
        <span>{t('mailbox.filter_to')}</span>
        <input
          type="search"
          dir="ltr"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            pager.first();
          }}
        />
      </label>
      <Resource state={res.state} reload={res.reload} lines={5}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('mailbox.empty')}</p>
            </Empty>
          ) : (
            <>
              <ul className="doc-list" data-testid="staging-mailbox">
                {items.map((m) => (
                  <li key={m.id} className="card">
                    <details>
                      <summary>
                        <strong>{m.subject}</strong>
                        <span className="muted small block">
                          <bdi dir="ltr">{m.to}</bdi> · {formatDubaiTime(m.created_at, locale)}
                        </span>
                      </summary>
                      <pre className="mail-body" dir={m.locale === 'ar' ? 'rtl' : 'ltr'}>
                        {m.body}
                      </pre>
                    </details>
                  </li>
                ))}
              </ul>
              <Pager
                hasPrev={pager.hasPrev}
                nextCursor={next}
                onFirst={pager.first}
                onNext={pager.next}
              />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function StagingMailboxPage() {
  return (
    <AdminShell require="admin.support.read">
      <Mailbox />
    </AdminShell>
  );
}
