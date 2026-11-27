'use client';
import type { CategoryNode } from '@app/contracts';
import { MARKETPLACE_SORTS } from '@app/contracts';
import { useState, type FormEvent } from 'react';
import { useApp, useT } from '@/components/app-context';
import { useLocalized } from '@/components/catalog-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { Alert, ApiErrorAlert, Button, PageHeader } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Prefs = {
  category_ids: string[];
  emirates: string[];
  default_view: 'GRID' | 'LIST';
  default_sort: string;
};
const EMIRATES = [
  'ABU_DHABI',
  'DUBAI',
  'SHARJAH',
  'AJMAN',
  'UMM_AL_QUWAIN',
  'RAS_AL_KHAIMAH',
  'FUJAIRAH',
] as const;

function Preferences() {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const { state, reload, setData } = useResource<Prefs>('/marketplace/preferences');
  const cats = useResource<CategoryNode[]>('/marketplace/categories');
  const m = useMutation();
  const [saved, setSaved] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaved(false);
    const fd = new FormData(e.currentTarget);
    const r = await m.run<Prefs>('/marketplace/preferences', {
      method: 'PATCH',
      body: {
        category_ids: fd.getAll('category_ids').map(String),
        emirates: fd.getAll('emirates').map(String),
        default_view: String(fd.get('default_view')),
        default_sort: String(fd.get('default_sort')),
      },
    });
    if (r.ok) {
      setData(r.data);
      setSaved(true);
    }
  };
  return (
    <>
      <PageHeader title={t('lists.prefs_title')} />
      <Resource
        state={state}
        reload={reload}
        loginHref={`/${locale}/login?next=${encodeURIComponent(`/${locale}/preferences`)}`}
      >
        {(p) => (
          <form className="card form-narrow" onSubmit={submit}>
            <fieldset>
              <legend>{t('lists.prefs_categories')}</legend>
              {cats.state.status === 'ready'
                ? cats.state.data.map((c) => (
                    <label key={c.id} className="check">
                      <input
                        type="checkbox"
                        name="category_ids"
                        value={c.id}
                        defaultChecked={p.category_ids.includes(c.id)}
                      />
                      {L(c.name_en, c.name_ar)}
                    </label>
                  ))
                : null}
            </fieldset>
            <fieldset>
              <legend>{t('lists.prefs_emirates')}</legend>
              {EMIRATES.map((e) => (
                <label key={e} className="check">
                  <input
                    type="checkbox"
                    name="emirates"
                    value={e}
                    defaultChecked={p.emirates.includes(e)}
                  />
                  {t(`emirate.${e}` as MessageKey)}
                </label>
              ))}
            </fieldset>
            <div className="field">
              <label htmlFor="pv">{t('lists.prefs_view')}</label>
              <select id="pv" name="default_view" defaultValue={p.default_view}>
                <option value="GRID">{t('mkt.view_grid')}</option>
                <option value="LIST">{t('mkt.view_list')}</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="ps">{t('lists.prefs_sort')}</label>
              <select id="ps" name="default_sort" defaultValue={p.default_sort}>
                {MARKETPLACE_SORTS.map((s) => (
                  <option key={s} value={s}>
                    {t(`mkt.sort.${s}` as MessageKey)}
                  </option>
                ))}
              </select>
            </div>
            {m.error ? <ApiErrorAlert error={m.error} /> : null}
            {saved ? <Alert kind="success">{t('lists.prefs_saved')}</Alert> : null}
            <Button type="submit" busy={m.busy}>
              {t('common.save')}
            </Button>
          </form>
        )}
      </Resource>
    </>
  );
}

export default function PreferencesPage() {
  return (
    <MarketShell>
      <Preferences />
    </MarketShell>
  );
}
