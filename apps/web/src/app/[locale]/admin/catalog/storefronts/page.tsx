'use client';
import Link from 'next/link';
import { useState } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { fieldText, useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { Button, ConfirmDialog, Empty, PageHeader, Pager, TextArea } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useCursor, useMutation, useResource } from '@/lib/use-resource';

type Item = {
  id: string;
  company: { id: string; display_name: string; status: string };
  status: 'DRAFT' | 'PUBLISHED';
  business_type: string | null;
  public: boolean;
  admin_hidden: boolean;
  admin_hidden_reason: string | null;
  product_count: number;
  updated_at: string;
};

function Storefronts() {
  const { locale } = useApp();
  const t = useT();
  const me = useAdmin();
  const [q, setQ] = useState('');
  const [hidden, setHidden] = useState('');
  const pager = useCursor();
  const { state, reload } = useResource<Item[]>('/admin/storefronts', {
    q,
    hidden,
    cursor: pager.cursor,
  });
  const [target, setTarget] = useState<Item | null>(null);
  const [reason, setReason] = useState('');
  const m = useMutation();
  const canEnforce = me.capabilities.includes('admin.catalog.enforce');
  const run = async () => {
    if (!target) return;
    const r = await m.run(
      `/admin/storefronts/${target.id}/${target.admin_hidden ? 'restore' : 'hide'}`,
      {
        method: 'POST',
        body: { reason: reason.trim() },
      },
    );
    if (r.ok) {
      setTarget(null);
      setReason('');
      reload();
    }
  };
  return (
    <>
      <PageHeader title={t('acat.storefronts_title')} />
      <form
        className="inline-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setQ(String(new FormData(e.currentTarget).get('q') ?? '').trim());
          pager.first();
        }}
      >
        <label className="inline-field">
          <span>{t('common.filter')}</span>
          <select
            value={hidden}
            onChange={(e) => {
              setHidden(e.target.value);
              pager.first();
            }}
          >
            <option value="">{t('common.all')}</option>
            <option value="true">{t('acat.hidden')}</option>
            <option value="false">{t('acat.visible')}</option>
          </select>
        </label>
        <label className="sr-only" htmlFor="as-q">
          {t('common.search')}
        </label>
        <input id="as-q" name="q" type="search" placeholder={t('common.search')} maxLength={100} />
        <button type="submit" className="btn btn-secondary">
          {t('common.search')}
        </button>
      </form>
      <Resource state={state} reload={reload}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>{t('common.empty')}</Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">{t('nav.company')}</th>
                      <th scope="col">{t('seller.business_type')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('acat.listings')}</th>
                      <th scope="col">{t('common.updated_at')}</th>
                      <th scope="col">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <Link href={`/${locale}/admin/companies/${s.company.id}`}>
                            {s.company.display_name}
                          </Link>
                        </td>
                        <td>
                          {s.business_type ? t(`btype.${s.business_type}` as MessageKey) : '—'}
                        </td>
                        <td>
                          {s.admin_hidden ? (
                            <span className="pill pill-warn">{t('acat.hidden')}</span>
                          ) : s.public ? (
                            <Link href={`/${locale}/suppliers/${s.id}`}>
                              {t('seller.storefront_public')}
                            </Link>
                          ) : (
                            t('seller.storefront_not_public')
                          )}
                          {s.admin_hidden_reason ? (
                            <span className="muted small block">{s.admin_hidden_reason}</span>
                          ) : null}
                        </td>
                        <td>{s.product_count}</td>
                        <td className="small">{formatDubaiTime(s.updated_at, locale)}</td>
                        <td>
                          {canEnforce ? (
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => {
                                m.setError(null);
                                setTarget(s);
                              }}
                            >
                              {s.admin_hidden ? t('acat.restore') : t('acat.hide')}
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
      <ConfirmDialog
        open={target !== null}
        title={
          target
            ? `${target.admin_hidden ? t('acat.restore') : t('acat.hide')}: ${target.company.display_name}`
            : ''
        }
        confirmLabel={target?.admin_hidden ? t('acat.restore') : t('acat.hide')}
        danger={!target?.admin_hidden}
        busy={m.busy}
        error={m.error}
        onConfirm={run}
        onClose={() => setTarget(null)}
      >
        <TextArea
          label={t('acat.enforce_reason')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          required
          minLength={5}
          maxLength={2000}
          error={fieldText(locale, m.error?.fieldErrors.reason)}
        />
      </ConfirmDialog>
    </>
  );
}

export default function AdminStorefrontsPage() {
  return (
    <AdminShell require="admin.catalog.read">
      <Storefronts />
    </AdminShell>
  );
}
