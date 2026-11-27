'use client';
import type { VerificationCaseResponse } from '@app/contracts';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useApp, useT } from './app-context';
import { StatusBadge } from './ui';

export function Timeline({
  events,
  audience = 'company',
}: {
  events: VerificationCaseResponse['events'];
  audience?: 'company' | 'admin';
}) {
  const { locale } = useApp();
  const t = useT();
  if (!events.length) return <p className="muted">{t('common.none')}</p>;
  return (
    <ol className="timeline">
      {[...events].reverse().map((e, i) => (
        <li key={`${e.created_at}-${i}`}>
          <time dateTime={e.created_at}>{formatDubaiTime(e.created_at, locale)}</time>
          <div>
            <StatusBadge value={e.to_state} label={t(`cstatus.${e.to_state}` as MessageKey)} />{' '}
            <span className="muted">{t(audience === 'admin' ? `admin.event_actor.${e.actor}` : `company.event_actor.${e.actor}`)}</span>
            {e.reason ? <p className="pre-wrap">{e.reason}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

