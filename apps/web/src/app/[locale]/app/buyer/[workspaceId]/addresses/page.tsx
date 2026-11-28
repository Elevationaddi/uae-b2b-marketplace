'use client';
import { EMIRATES, type AddressItem } from '@app/contracts';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import { errorText, fieldText, useApp, useT } from '@/components/app-context';
import { buyerApi, BuyerShell } from '@/components/buyer-shell';
import { AddressBlock } from '@/components/commerce-ui';
import { Resource } from '@/components/resource';
import type { Workspace } from '@/components/session';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  Empty,
  Field,
  PageHeader,
  SelectField,
  Skeleton,
} from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

function Addresses({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { locale } = useApp();
  const params = useSearchParams();
  const api = `${buyerApi(ws)}/addresses`;
  const { state, reload } = useResource<AddressItem[]>(api);
  const canEdit = ws.capabilities.includes('buyer.purchase');
  const m = useMutation();
  const [notice, setNotice] = useState<string | null>(null);
  const [archive, setArchive] = useState<AddressItem | null>(null);
  const fe = (k: string) => fieldText(locale, m.error?.fieldErrors?.[k]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const r = await m.run<AddressItem>(api, {
      method: 'POST',
      body: {
        label: s('label'),
        recipient: s('recipient'),
        phone: s('phone'),
        line1: s('line1'),
        line2: s('line2') || undefined,
        city: s('city'),
        emirate: s('emirate'),
        is_default: fd.get('is_default') === 'on',
      },
    });
    if (r.ok) {
      form.reset();
      setNotice(t('address.saved'));
      reload();
    }
  };

  const makeDefault = async (a: AddressItem) => {
    const { id: _id, is_default: _d, line2, ...rest } = a;
    const r = await m.run<AddressItem>(`${api}/${a.id}`, {
      method: 'PATCH',
      body: { ...rest, line2: line2 ?? undefined, is_default: true },
    });
    if (r.ok) reload();
  };

  return (
    <>
      <PageHeader title={t('buyer.nav.addresses')} />
      <p className="muted">{t('address.intro')}</p>
      {notice ? (
        <Alert kind="success">
          {notice}{' '}
          {params?.get('next') === 'checkout' ? (
            <Link href={`${base}/checkout`}>{t('address.back_to_checkout')}</Link>
          ) : null}
        </Alert>
      ) : null}
      <div className="two-col">
        <div>
          <Resource state={state} reload={reload} lines={4}>
            {(list) =>
              list.length === 0 ? (
                <Empty>
                  <p>{t('address.empty')}</p>
                </Empty>
              ) : (
                <ul className="address-list" data-testid="addresses">
                  {list.map((a) => (
                    <li key={a.id} className="card">
                      <AddressBlock a={a} />
                      {a.is_default ? (
                        <span className="pill pill-ok small">{t('address.default')}</span>
                      ) : null}
                      {canEdit ? (
                        <div className="row-actions">
                          {!a.is_default ? (
                            <Button
                              type="button"
                              variant="secondary"
                              busy={m.busy}
                              onClick={() => makeDefault(a)}
                            >
                              {t('address.make_default')}
                            </Button>
                          ) : null}
                          <Button type="button" variant="link" onClick={() => setArchive(a)}>
                            {t('address.remove')}
                          </Button>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )
            }
          </Resource>
        </div>
        {canEdit ? (
          <section className="card" aria-labelledby="addr-new">
            <h2 id="addr-new" className="h3">
              {t('address.add')}
            </h2>
            <form onSubmit={submit} className="form-grid" noValidate data-testid="address-form">
              {m.error && !Object.keys(m.error.fieldErrors ?? {}).length ? (
                <ApiErrorAlert error={m.error} />
              ) : null}
              <Field
                label={t('address.label')}
                name="label"
                required
                maxLength={60}
                error={fe('label')}
              />
              <Field
                label={t('address.recipient')}
                name="recipient"
                required
                maxLength={120}
                error={fe('recipient')}
              />
              <Field
                label={t('address.phone')}
                name="phone"
                type="tel"
                dir="ltr"
                required
                maxLength={20}
                error={fe('phone')}
              />
              <Field
                label={t('address.line1')}
                name="line1"
                required
                maxLength={200}
                error={fe('line1')}
              />
              <Field
                label={t('address.line2')}
                name="line2"
                optional
                maxLength={200}
                error={fe('line2')}
              />
              <div className="field-row">
                <Field
                  label={t('address.city')}
                  name="city"
                  required
                  maxLength={80}
                  error={fe('city')}
                />
                <SelectField
                  label={t('address.emirate')}
                  name="emirate"
                  defaultValue="DUBAI"
                  options={EMIRATES.map((e) => ({
                    value: e,
                    label: t(`emirate.${e}` as MessageKey),
                  }))}
                />
              </div>
              <label className="check">
                <input type="checkbox" name="is_default" />
                <span>{t('address.make_default')}</span>
              </label>
              <div className="actions">
                <Button type="submit" busy={m.busy}>
                  {t('address.save')}
                </Button>
              </div>
            </form>
          </section>
        ) : null}
      </div>
      <ConfirmDialog
        open={archive !== null}
        title={t('address.remove')}
        body={t('address.remove_body')}
        confirmLabel={t('address.remove')}
        danger
        busy={m.busy}
        error={m.error}
        onClose={() => setArchive(null)}
        onConfirm={async () => {
          if (!archive) return;
          const r = await m.run(`${api}/${archive.id}`, { method: 'DELETE' });
          if (r.ok) {
            setArchive(null);
            reload();
          }
        }}
      />
      {m.error && archive === null ? (
        <p className="sr-only" role="status">
          {errorText(locale, m.error)}
        </p>
      ) : null}
    </>
  );
}

export default function AddressesPage() {
  return (
    <BuyerShell>
      {(ws, base) => (
        <Suspense fallback={<Skeleton />}>
          <Addresses ws={ws} base={base} />
        </Suspense>
      )}
    </BuyerShell>
  );
}
