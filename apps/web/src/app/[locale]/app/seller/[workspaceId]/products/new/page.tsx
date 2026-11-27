'use client';
import type { CategoryNode } from '@app/contracts';
import { QUANTITY_UNITS } from '@app/contracts';
import { useRouter } from 'next/navigation';
import { type FormEvent } from 'react';
import { useApp, useT, fieldText } from '@/components/app-context';
import { useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import { ApiErrorAlert, Button, Field, PageHeader, SelectField } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

function NewProduct({ ws, base }: { ws: Workspace; base: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const router = useRouter();
  const cats = useResource<CategoryNode[]>('/marketplace/categories');
  const m = useMutation();
  const fe = (k: string) => fieldText(locale, m.error?.fieldErrors[k]);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const r = await m.run<{ id: string }>(`${sellerApi(ws)}/products`, {
      method: 'POST',
      body: {
        title_en: s('title_en'),
        title_ar: s('title_ar') || null,
        category_id: s('category_id'),
        mode: s('mode'),
        sku_code: s('sku_code'),
        unit: s('unit'),
      },
    });
    if (r.ok) router.push(`${base}/products/${r.data.id}`);
  };
  return (
    <>
      <PageHeader title={t('seller.new_title')} />
      <p className="lead">{t('seller.new_body')}</p>
      <Resource state={cats.state} reload={cats.reload}>
        {(list) => (
          <form className="card form-narrow" onSubmit={submit} noValidate>
            <Field
              label={t('seller.title_en')}
              name="title_en"
              required
              minLength={3}
              maxLength={150}
              error={fe('title_en')}
            />
            <Field
              label={t('seller.title_ar')}
              name="title_ar"
              dir="rtl"
              lang="ar"
              maxLength={150}
              optional
              error={fe('title_ar')}
            />
            <div className={`field ${fe('category_id') ? 'field-invalid' : ''}`}>
              <label htmlFor="np-cat">{t('seller.category')}</label>
              <select
                id="np-cat"
                name="category_id"
                required
                defaultValue=""
                aria-invalid={fe('category_id') ? true : undefined}
              >
                <option value="" disabled>
                  {t('seller.choose_category')}
                </option>
                {list.map((c) =>
                  c.children.length ? (
                    <optgroup key={c.id} label={L(c.name_en, c.name_ar)}>
                      {c.children.map((s) => (
                        <option key={s.id} value={s.id}>
                          {L(s.name_en, s.name_ar)}
                          {s.restriction === 'REVIEW_REQUIRED'
                            ? ` · ${t('restriction.REVIEW_REQUIRED')}`
                            : ''}
                        </option>
                      ))}
                    </optgroup>
                  ) : (
                    <option key={c.id} value={c.id}>
                      {L(c.name_en, c.name_ar)}
                    </option>
                  ),
                )}
              </select>
              {fe('category_id') ? <p className="field-error">{fe('category_id')}</p> : null}
            </div>
            <SelectField
              label={t('seller.mode')}
              name="mode"
              defaultValue="READY_STOCK"
              options={[
                { value: 'READY_STOCK', label: t('mode.READY_STOCK') },
                { value: 'MADE_TO_ORDER', label: t('mode.MADE_TO_ORDER') },
              ]}
            />
            <fieldset>
              <legend>{t('seller.first_sku')}</legend>
              <Field
                label={t('pd.sku')}
                name="sku_code"
                required
                hint={t('seller.first_sku_hint')}
                error={fe('sku_code')}
                dir="ltr"
              />
              <SelectField
                label={t('seller.unit')}
                name="unit"
                defaultValue="PIECE"
                options={QUANTITY_UNITS.map((u) => ({
                  value: u,
                  label: t(`unit.${u}` as MessageKey),
                }))}
              />
            </fieldset>
            {m.error ? <ApiErrorAlert error={m.error} /> : null}
            <Button type="submit" busy={m.busy}>
              {t('seller.create')}
            </Button>
          </form>
        )}
      </Resource>
    </>
  );
}

export default function NewProductPage() {
  return <SellerShell>{(ws, base) => <NewProduct ws={ws} base={base} />}</SellerShell>;
}
