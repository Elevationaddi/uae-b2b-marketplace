'use client';
import Link from 'next/link';
import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import type { ApiError } from '@/lib/client';
import { errorText, fieldText, useApp, useT } from './app-context';

const noop = () => () => undefined;
/**
 * False during server render and hydration, true afterwards. Inputs and buttons stay disabled
 * until React is attached, so nothing typed before hydration is silently discarded.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export function Button({
  variant = 'primary',
  busy = false,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  busy?: boolean;
}) {
  const hydrated = useHydrated();
  return (
    <button
      {...rest}
      className={`btn btn-${variant} ${rest.className ?? ''}`}
      disabled={rest.disabled || busy || !hydrated}
      aria-busy={busy || undefined}
    >
      {children}
    </button>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
};

export function Field({
  label,
  error,
  hint,
  optional,
  ref,
  ...input
}: FieldProps & InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> }) {
  const id = useId();
  const t = useT();
  const hydrated = useHydrated();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className={`field ${error ? 'field-invalid' : ''}`}>
      <label htmlFor={id}>
        {label}
        {optional ? <span className="muted"> ({t('common.optional')})</span> : null}
      </label>
      <input
        id={id}
        ref={ref}
        {...input}
        disabled={input.disabled || !hydrated}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errId].filter(Boolean).join(' ') || undefined}
      />
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  error,
  hint,
  options,
  ...select
}: FieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  const id = useId();
  const hydrated = useHydrated();
  const errId = error ? `${id}-err` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={`field ${error ? 'field-invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        {...select}
        disabled={select.disabled || !hydrated}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errId].filter(Boolean).join(' ') || undefined}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  error,
  hint,
  ...rest
}: FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const errId = error ? `${id}-err` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={`field ${error ? 'field-invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={4}
        {...rest}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errId].filter(Boolean).join(' ') || undefined}
      />
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Alert({
  kind,
  title,
  children,
}: {
  kind: 'error' | 'success' | 'info' | 'warning';
  title?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (kind === 'error') ref.current?.focus();
  }, [kind, children]);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={`alert alert-${kind}`}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      {title ? <p className="alert-title">{title}</p> : null}
      {children}
    </div>
  );
}

/** Error from the API, translated, with the support reference. */
export function ApiErrorAlert({ error, onRetry }: { error: ApiError; onRetry?: () => void }) {
  const { locale } = useApp();
  const t = useT();
  return (
    <Alert kind="error" title={t('common.error_title')}>
      <p>{errorText(locale, error)}</p>
      {error.requestId ? (
        <p className="muted">
          {t('common.reference')}: <code>{error.requestId}</code>
        </p>
      ) : null}
      {onRetry ? (
        <Button variant="secondary" type="button" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      ) : null}
    </Alert>
  );
}

export function useFieldError(error: ApiError | null) {
  const { locale } = useApp();
  return (name: string) => fieldText(locale, error?.fieldErrors[name]);
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  const t = useT();
  return (
    <div className="skeleton" aria-busy="true" aria-live="polite">
      <span className="sr-only">{t('common.loading')}</span>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="skeleton-line" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}

export function Forbidden() {
  const t = useT();
  return (
    <div className="empty" role="alert">
      <p className="alert-title">{t('common.forbidden_title')}</p>
      <p>{t('common.forbidden_body')}</p>
    </div>
  );
}

export function NotFound({ backHref }: { backHref?: string }) {
  const t = useT();
  return (
    <div className="empty" role="alert">
      <p className="alert-title">{t('error.common.not_found')}</p>
      {backHref ? <Link href={backHref}>{t('common.back')}</Link> : null}
    </div>
  );
}

const TONE: Record<string, 'ok' | 'warn' | 'bad' | 'neutral' | 'info'> = {
  APPROVED: 'ok',
  ACTIVE: 'ok',
  CLEAN: 'ok',
  ACCEPTED: 'ok',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'info',
  PENDING: 'info',
  NEEDS_INFO: 'warn',
  RESTRICTED: 'warn',
  EXPIRED: 'warn',
  DRAFT: 'neutral',
  CLOSED: 'neutral',
  REVOKED: 'neutral',
  REJECTED: 'bad',
  SUSPENDED: 'bad',
  INFECTED: 'bad',
  DISABLED: 'bad',
  PUBLISHED: 'ok',
  PENDING_REVIEW: 'info',
  CHANGES_REQUESTED: 'warn',
  UNPUBLISHED: 'neutral',
  ARCHIVED: 'neutral',
  SUPERSEDED: 'neutral',
  WITHDRAWN: 'neutral',
  REMOVED: 'bad',
  OPEN: 'info',
  AWARDED: 'ok',
  CANCELLED: 'neutral',
  DECLINED: 'bad',
  // Phase 4–5 order, payment and settlement states.
  AWAITING_PAYMENT: 'warn',
  CONFIRMED: 'ok',
  PROCESSING: 'info',
  DISPATCHED: 'info',
  DELIVERED: 'info',
  COMPLETED: 'ok',
  NOT_ELIGIBLE: 'neutral',
  ELIGIBLE: 'ok',
  HELD: 'warn',
  IN_PAYOUT: 'info',
  PAID_OUT: 'ok',
  AWAITING_EVIDENCE: 'warn',
  RESOLUTION_PROPOSED: 'info',
  RESOLVING: 'info',
  REQUESTED: 'warn',
  SUCCEEDED: 'ok',
  PAID: 'ok',
  FAILED: 'bad',
  HIDDEN: 'neutral',
  PARTIALLY_REFUNDED: 'warn',
  REFUNDED: 'neutral',
  // Phase 6 support tickets and exports.
  ASSIGNED: 'info',
  WAITING_CUSTOMER: 'warn',
  RESOLVED: 'ok',
  READY: 'ok',
};

/** Status shown as text plus colour, never colour alone (docs/05-ui.md). */
export function StatusBadge({ value, label }: { value: string; label: string }) {
  return (
    <span className={`status status-${TONE[value] ?? 'neutral'}`} data-status={value}>
      {label}
    </span>
  );
}

/**
 * Confirmation using the native <dialog> element (focus trapped, Esc closes).
 * The action runs only after explicit confirmation; errors are shown inside the dialog.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  danger,
  busy,
  error,
  onConfirm,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  error?: ApiError | null;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = useT();
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="dialog" aria-labelledby={titleId} onClose={onClose}>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm();
        }}
      >
        <h2 id={titleId}>{title}</h2>
        {body ? <p>{body}</p> : null}
        {children}
        {error ? <ApiErrorAlert error={error} /> : null}
        <div className="actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant={danger ? 'danger' : 'primary'} busy={busy}>
            {confirmLabel}
          </Button>
        </div>
      </form>
    </dialog>
  );
}

export function Pager({
  hasPrev,
  nextCursor,
  onFirst,
  onNext,
}: {
  hasPrev: boolean;
  nextCursor: string | null;
  onFirst: () => void;
  onNext: (cursor: string) => void;
}) {
  const t = useT();
  if (!hasPrev && !nextCursor) return null;
  return (
    <nav className="pager" aria-label={t('common.pagination')}>
      <Button type="button" variant="secondary" disabled={!hasPrev} onClick={onFirst}>
        {t('common.first_page')}
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={!nextCursor}
        onClick={() => nextCursor && onNext(nextCursor)}
      >
        {t('common.next_page')}
      </Button>
    </nav>
  );
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="page-header">
      <h1 tabIndex={-1}>{title}</h1>
      {children ? <div className="page-header-actions">{children}</div> : null}
    </div>
  );
}

export function DefinitionList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="dl">
      {items.map(([k, v]) => (
        <div key={k} className="dl-row">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
