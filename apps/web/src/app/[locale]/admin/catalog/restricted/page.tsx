'use client';
import type { AdminCategoryItem } from '@app/contracts';
import { type FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { fieldText, useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { ApiErrorAlert, Button, Empty, Field, PageHeader, SelectField } from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Term = {
  id: string;
  term: string;
  action: 'BLOCK' | 'REVIEW';
  category: { id: string; name_en: string; name_ar: string } | null;
  note: string | null;
  active: boolean;
  created_at: string;
};

function Restricted() {
  const { locale } = useApp();
  const t = useT();
  const me = useAdmin();
  const { state, reload } = useResource<Term[]>('/admin/restricted-terms');
  const cats = useResource<AdminCategoryItem[]>('/admin/categories');
  const m = useMutation();
  const can = me.capabilities.includes('admin.restricted.manage');
  const fe = (k: string) => fieldText(locale, m.error?.fieldErrors[k]);
  const add = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const r = await m.run('/admin/restricted-terms', {
      method: 'POST',
      body: {
        term: s('term'),
        action: s('action'),
        category_id: s('category_id') || null,
        note: s('note') || null,
      },
    });
    if (r.ok) {
      form.reset();
      reload();
    }
  };
  const patch = async (term: Term, body: Record<string, unknown>) => {
    const r = await m.run(`/admin/restricted-terms/${term.id}`, { method: 'PATCH', body });
    if (r.ok) reload();
  };
  return (
    <>
      <PageHeader title={t('acat.restricted_title')} />
      <p className="muted">{t('acat.restricted_note')}</p>
      {can ? (
        <form className="card grid-4 inline-add" onSubmit={add} noValidate>
          <Field
            label={t('acat.term')}
            name="term"
            required
            minLength={2}
            maxLength={60}
            error={fe('term')}
          />
          <SelectField
            label={t('acat.action')}
            name="action"
            defaultValue="REVIEW"
            options={[
              { value: 'REVIEW', label: 'REVIEW' },
              { value: 'BLOCK', label: 'BLOCK' },
            ]}
          />
          <SelectField
            label={t('seller.category')}
            name="category_id"
            defaultValue=""
            options={[
              { value: '', label: t('common.all') },
              ...(cats.state.status === 'ready'
                ? cats.state.data.map((c) => ({
                    value: c.id,
                    label: locale === 'ar' ? c.name_ar : c.name_en,
                  }))
                : []),
            ]}
          />
          <Field label={t('acat.note')} name="note" maxLength={300} optional />
          <Button type="submit" variant="secondary" busy={m.busy}>
            {t('acat.add_term')}
          </Button>
        </form>
      ) : null}
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      <Resource state={state} reload={reload}>
        {(terms) =>
          terms.length === 0 ? (
            <Empty>{t('common.empty')}</Empty>
          ) : (
            <div className="table-wrap">
              <table className="table" data-testid="restricted-terms">
                <thead>
                  <tr>
                    <th scope="col">{t('acat.term')}</th>
                    <th scope="col">{t('acat.action')}</th>
                    <th scope="col">{t('seller.category')}</th>
                    <th scope="col">{t('acat.note')}</th>
                    <th scope="col">{t('common.status')}</th>
                    <th scope="col">{t('common.created')}</th>
                  </tr>
                </thead>
                <tbody>
                  {terms.map((x) => (
                    <tr key={x.id}>
                      <td>
                        <bdi>{x.term}</bdi>
                      </td>
                      <td>
                        {x.action}
                        {can ? (
                          <Button
                            type="button"
                            variant="link"
                            disabled={m.busy}
                            onClick={() =>
                              patch(x, { action: x.action === 'BLOCK' ? 'REVIEW' : 'BLOCK' })
                            }
                          >
                            → {x.action === 'BLOCK' ? 'REVIEW' : 'BLOCK'}
                          </Button>
                        ) : null}
                      </td>
                      <td>
                        {x.category
                          ? locale === 'ar'
                            ? x.category.name_ar
                            : x.category.name_en
                          : t('common.all')}
                      </td>
                      <td>{x.note ?? '—'}</td>
                      <td>
                        {x.active ? t('acat.active') : t('acat.inactive')}
                        {can ? (
                          <Button
                            type="button"
                            variant="link"
                            disabled={m.busy}
                            onClick={() => patch(x, { active: !x.active })}
                          >
                            {x.active ? t('seller.deactivate') : t('seller.activate')}
                          </Button>
                        ) : null}
                      </td>
                      <td className="small">{formatDubaiTime(x.created_at, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </Resource>
    </>
  );
}

export default function RestrictedPage() {
  return (
    <AdminShell require="admin.catalog.read">
      <Restricted />
    </AdminShell>
  );
}
