'use client';
import type { MeResponse, NotificationPreferences } from '@app/contracts';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { AppShell, useSession } from '@/components/session';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  Field,
  PageHeader,
  SelectField,
  useFieldError,
} from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type SessionItem = {
  id: string;
  current: boolean;
  created_at: string;
  last_seen_at: string;
  expires_at: string;
  ip: string | null;
  user_agent: string | null;
};

function Profile() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const { me, reload } = useSession();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [name, setName] = useState(me.user.full_name ?? '');
  const [lang, setLang] = useState<string>(me.user.locale);
  const [saved, setSaved] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaved(false);
    const r = await m.run<MeResponse>('/me', {
      method: 'PATCH',
      body: { full_name: name, locale: lang },
    });
    if (r.ok) {
      setSaved(true);
      reload();
      if (lang !== locale) router.replace(`/${lang}/app/settings`);
    }
  }

  return (
    <section className="card" aria-labelledby="profile-heading">
      <h2 id="profile-heading">{t('settings.profile')}</h2>
      {saved ? <Alert kind="success">{t('common.saved')}</Alert> : null}
      {m.error && !Object.keys(m.error.fieldErrors).length ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      <form onSubmit={submit} className="form" noValidate>
        <Field label={t('auth.email')} value={me.user.email} readOnly dir="ltr" />
        <Field
          label={t('auth.full_name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fe('full_name')}
          autoComplete="name"
        />
        <SelectField
          label={t('settings.language')}
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'العربية' },
          ]}
        />
        <Button type="submit" busy={m.busy}>
          {t('common.save')}
        </Button>
      </form>
    </section>
  );
}

function Password({ onChanged }: { onChanged: () => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [v, setV] = useState({ current_password: '', new_password: '' });
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setDone(false);
    const r = await m.run('/me/password', { method: 'POST', body: v });
    if (r.ok) {
      setDone(true);
      setV({ current_password: '', new_password: '' });
      onChanged();
    }
  }

  return (
    <section className="card" aria-labelledby="pw-heading">
      <h2 id="pw-heading">{t('settings.password')}</h2>
      {done ? <Alert kind="success">{t('settings.password_changed')}</Alert> : null}
      {m.error && !Object.keys(m.error.fieldErrors).length ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      <form onSubmit={submit} className="form" noValidate>
        <input type="text" name="username" autoComplete="username" hidden readOnly />
        <Field
          label={t('settings.current_password')}
          type="password"
          autoComplete="current-password"
          value={v.current_password}
          onChange={(e) => setV({ ...v, current_password: e.target.value })}
          error={fe('current_password')}
          required
        />
        <Field
          label={t('auth.new_password')}
          type="password"
          autoComplete="new-password"
          hint={t('auth.password_hint')}
          value={v.new_password}
          onChange={(e) => setV({ ...v, new_password: e.target.value })}
          error={fe('new_password')}
          required
        />
        <Button type="submit" busy={m.busy}>
          {t('common.save')}
        </Button>
      </form>
    </section>
  );
}

function Sessions({ tick }: { tick: number }) {
  const { locale } = useApp();
  const t = useT();
  const sessions = useResource<SessionItem[]>('/me/sessions');
  const { reload } = sessions;
  useEffect(() => {
    if (tick) reload();
  }, [tick, reload]);
  const m = useMutation();
  const [target, setTarget] = useState<SessionItem | 'others' | null>(null);

  return (
    <section className="card" aria-labelledby="sessions-heading">
      <h2 id="sessions-heading">{t('settings.sessions')}</h2>
      <p className="muted">{t('settings.sessions_intro')}</p>
      <Resource state={sessions.state} reload={sessions.reload}>
        {(list) => (
          <>
            <ul className="doc-list">
              {list.map((s) => (
                <li key={s.id} className="doc">
                  <div>
                    <strong>
                      {s.user_agent ? (
                        <bdi>{s.user_agent.slice(0, 90)}</bdi>
                      ) : (
                        t('settings.unknown_device')
                      )}
                    </strong>
                    {s.current ? <span className="tag">{t('settings.this_device')}</span> : null}
                    <div className="muted">
                      {t('settings.last_seen')}: {formatDubaiTime(s.last_seen_at, locale)}
                      {s.ip ? (
                        <>
                          {' · '}
                          <bdi>{s.ip}</bdi>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {!s.current ? (
                    <Button type="button" variant="link" onClick={() => setTarget(s)}>
                      {t('settings.revoke')}
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
            {list.some((s) => !s.current) ? (
              <Button type="button" variant="secondary" onClick={() => setTarget('others')}>
                {t('settings.revoke_others')}
              </Button>
            ) : null}
          </>
        )}
      </Resource>
      <ConfirmDialog
        open={target !== null}
        title={target === 'others' ? t('settings.revoke_others') : t('settings.revoke')}
        confirmLabel={t('common.confirm')}
        danger
        busy={m.busy}
        error={m.error}
        onClose={() => {
          setTarget(null);
          m.setError(null);
        }}
        onConfirm={async () => {
          if (!target) return;
          const r =
            target === 'others'
              ? await m.run('/me/sessions/revoke-others', { method: 'POST' })
              : await m.run(`/me/sessions/${target.id}`, { method: 'DELETE' });
          if (r.ok) {
            setTarget(null);
            sessions.reload();
          }
        }}
      />
    </section>
  );
}

const PREF_KEYS = ['email_rfqs', 'email_quotes', 'email_messages'] as const;

/** Activity email preferences. In-app notifications are always kept. */
function EmailPreferences() {
  const t = useT();
  const prefs = useResource<NotificationPreferences>('/notifications/preferences');
  const m = useMutation();
  const [saved, setSaved] = useState(false);
  return (
    <section className="card" aria-labelledby="prefs-heading">
      <h2 id="prefs-heading">{t('settings.email_prefs')}</h2>
      <p className="muted small">{t('settings.email_prefs_hint')}</p>
      {saved ? <Alert kind="success">{t('common.saved')}</Alert> : null}
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      <Resource state={prefs.state} reload={prefs.reload}>
        {(p) => (
          <fieldset disabled={m.busy}>
            <legend className="sr-only">{t('settings.email_prefs')}</legend>
            {PREF_KEYS.map((k) => (
              <label key={k} className="check">
                <input
                  type="checkbox"
                  checked={p[k]}
                  onChange={async (e) => {
                    setSaved(false);
                    const r = await m.run<NotificationPreferences>('/notifications/preferences', {
                      method: 'PATCH',
                      body: { [k]: e.target.checked },
                    });
                    if (r.ok) {
                      prefs.setData(r.data);
                      setSaved(true);
                    }
                  }}
                />
                <span>{t(`settings.pref.${k}` as MessageKey)}</span>
              </label>
            ))}
          </fieldset>
        )}
      </Resource>
    </section>
  );
}

function Settings() {
  const t = useT();
  const [tick, setTick] = useState(0);
  return (
    <>
      <PageHeader title={t('settings.title')} />
      <Profile />
      <Password onChanged={() => setTick((n) => n + 1)} />
      <Sessions tick={tick} />
      <EmailPreferences />
    </>
  );
}

export default function SettingsPage() {
  return (
    <AppShell allowUnverified>
      <Settings />
    </AppShell>
  );
}
