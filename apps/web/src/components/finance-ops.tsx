'use client';
import { useState } from 'react';
import { useMutation } from '@/lib/use-resource';
import { useT } from './app-context';
import { Button, ConfirmDialog, TextArea, useFieldError } from './ui';

/** Approve / reject with a recorded reason (dual control is enforced by the API). */
export function DecisionButtons({
  path,
  number,
  ns,
  onDone,
}: {
  path: string;
  number: string;
  ns: 'refund' | 'payout';
  onDone: () => void;
}) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [mode, setMode] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  return (
    <span className="row-actions">
      <Button variant="secondary" onClick={() => setMode('approve')}>
        {t('refund.approve')}
      </Button>
      <Button variant="link" onClick={() => setMode('reject')}>
        {t('refund.reject')}
      </Button>
      <ConfirmDialog
        open={mode !== null}
        title={t(`${ns}.${mode ?? 'approve'}_title`, { number })}
        confirmLabel={mode === 'reject' ? t('refund.reject') : t('refund.approve')}
        danger={mode === 'reject'}
        busy={m.busy}
        error={m.error && Object.keys(m.error.fieldErrors).length === 0 ? m.error : null}
        onClose={() => {
          setMode(null);
          m.setError(null);
        }}
        onConfirm={async () => {
          const r = await m.run(`${path}/${mode}`, { method: 'POST', body: { reason } });
          if (r.ok) {
            setMode(null);
            setReason('');
            onDone();
          }
        }}
      >
        <TextArea
          label={t('refund.decision_reason')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={2}
          error={fe('reason')}
        />
      </ConfirmDialog>
    </span>
  );
}

/** SANDBOX ONLY: stands in for the provider finishing a refund or payout (labelled). */
export function SandboxComplete({
  providerRef,
  onDone,
}: {
  providerRef: string;
  onDone: () => void;
}) {
  const t = useT();
  const m = useMutation();
  const go = async (outcome: 'success' | 'failure') => {
    const r = await m.run(`/admin/sandbox/operations/${providerRef}/complete`, {
      method: 'POST',
      body: { outcome },
    });
    if (r.ok) setTimeout(onDone, 2500);
  };
  return (
    <span className="row-actions sandbox-ops" data-testid="sandbox-ops">
      <span className="pill pill-warn small">{t('payment.sandbox_pill')}</span>
      <Button variant="secondary" busy={m.busy} onClick={() => go('success')}>
        {t('sandbox.complete_success')}
      </Button>
      <Button variant="link" busy={m.busy} onClick={() => go('failure')}>
        {t('sandbox.complete_failure')}
      </Button>
    </span>
  );
}
