'use client';
import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { t, tDynamic, type Locale, type MessageKey } from '@/i18n/messages';
import type { ApiError } from '@/lib/client';

export type AppConfig = {
  locale: Locale;
  appName: string;
  sandbox: boolean;
  uploadMaxBytes: number;
};

const AppCtx = createContext<AppConfig | null>(null);

export function AppProvider({ value, children }: { value: AppConfig; children: ReactNode }) {
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): AppConfig {
  const v = useContext(AppCtx);
  if (!v) throw new Error('AppProvider missing');
  return v;
}

export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

export function useT(): Translate {
  const { locale } = useApp();
  return useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => t(locale, key, vars),
    [locale],
  );
}

/** Translate an API message_key; unknown keys fall back to a generic message (never raw keys). */
export function errorText(locale: Locale, err: Pick<ApiError, 'messageKey'>): string {
  return tDynamic(locale, `error.${err.messageKey}`, 'error.common.internal_error');
}

const FIELD_CODE_ALIASES: Record<string, string> = {
  too_small: 'min',
  too_big: 'max',
  invalid_type: 'required',
  invalid_string: 'invalid',
  invalid_format: 'invalid',
  invalid_value: 'invalid',
  invalid_enum_value: 'invalid',
  recovery_code: 'invalid',
  one_of: 'code',
};

export function fieldText(locale: Locale, code: string | undefined): string | undefined {
  if (!code) return undefined;
  const mapped = FIELD_CODE_ALIASES[code] ?? code;
  return tDynamic(locale, `field.${mapped}`, 'field.invalid');
}
