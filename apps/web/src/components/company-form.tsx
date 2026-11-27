'use client';
import { EMIRATES, type CompanyResponse } from '@app/contracts';
import { useState, type FormEvent } from 'react';
import type { ApiError } from '@/lib/client';
import { useT } from './app-context';
import { Alert, ApiErrorAlert, Button, Field, SelectField, useFieldError } from './ui';

export type CompanyFormValues = {
  legal_name: string;
  display_name: string;
  licence_number: string;
  licence_issuer: string;
  licence_expiry: string;
  activity: string;
  emirate: string;
  trn: string;
  contact_email: string;
  contact_phone: string;
};

export function initialCompanyValues(c?: CompanyResponse): CompanyFormValues {
  return {
    legal_name: c?.legal_name ?? '',
    display_name: c?.display_name ?? '',
    licence_number: c?.licence_number ?? '',
    licence_issuer: c?.licence_issuer ?? '',
    licence_expiry: c?.licence_expiry ?? '',
    activity: c?.activity ?? '',
    emirate: c?.emirate ?? 'DUBAI',
    trn: c?.trn ?? '',
    contact_email: c?.contact_email ?? '',
    contact_phone: c?.contact_phone ?? '',
  };
}

/** Company legal details form, shared by onboarding (create) and the company page (edit). */
export function CompanyForm({
  initial,
  submitLabel,
  busy,
  error,
  onSubmit,
  extra,
  onCancel,
}: {
  initial: CompanyFormValues;
  submitLabel: string;
  busy: boolean;
  error: ApiError | null;
  onSubmit: (values: CompanyFormValues) => void;
  extra?: React.ReactNode;
  onCancel?: () => void;
}) {
  const t = useT();
  const fe = useFieldError(error);
  const [v, setV] = useState(initial);
  const set = (k: keyof CompanyFormValues) => (e: { target: { value: string } }) => setV({ ...v, [k]: e.target.value });

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit(v);
  }

  return (
    <form onSubmit={submit} noValidate className="form">
      {error && error.code === 'VALIDATION_FAILED' ? (
        <Alert kind="error">{t('error.common.validation_failed')}</Alert>
      ) : error ? (
        <ApiErrorAlert error={error} />
      ) : null}
      <div className="grid-2">
        <Field label={t('company.legal_name')} value={v.legal_name} onChange={set('legal_name')} error={fe('legal_name')} required />
        <Field label={t('company.display_name')} value={v.display_name} onChange={set('display_name')} error={fe('display_name')} required />
        <Field
          label={t('company.licence_number')}
          dir="ltr"
          value={v.licence_number}
          onChange={set('licence_number')}
          error={fe('licence_number')}
          required
        />
        <Field label={t('company.licence_issuer')} value={v.licence_issuer} onChange={set('licence_issuer')} error={fe('licence_issuer')} required />
        <Field
          label={t('company.licence_expiry')}
          type="date"
          value={v.licence_expiry}
          onChange={set('licence_expiry')}
          error={fe('licence_expiry')}
          required
        />
        <SelectField
          label={t('company.emirate')}
          value={v.emirate}
          onChange={set('emirate')}
          error={fe('emirate')}
          options={EMIRATES.map((e) => ({ value: e, label: t(`emirate.${e}`) }))}
        />
        <Field label={t('company.activity')} value={v.activity} onChange={set('activity')} error={fe('activity')} required />
        <Field
          label={t('company.trn')}
          optional
          inputMode="numeric"
          dir="ltr"
          hint={t('company.trn_hint')}
          value={v.trn}
          onChange={set('trn')}
          error={fe('trn')}
        />
        <Field
          label={t('company.contact_email')}
          type="email"
          dir="ltr"
          value={v.contact_email}
          onChange={set('contact_email')}
          error={fe('contact_email')}
          required
        />
        <Field
          label={t('company.contact_phone')}
          type="tel"
          dir="ltr"
          hint={t('company.phone_hint')}
          value={v.contact_phone}
          onChange={set('contact_phone')}
          error={fe('contact_phone')}
          required
        />
      </div>
      {extra}
      <div className="actions">
        <Button type="submit" busy={busy}>
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
