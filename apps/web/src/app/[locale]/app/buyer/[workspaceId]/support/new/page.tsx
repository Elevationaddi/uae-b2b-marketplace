'use client';
import { Suspense } from 'react';
import { BuyerShell } from '@/components/buyer-shell';
import { WorkspaceSupportNew } from '@/components/support-ui';

export default function BuyerSupportNewPage() {
  return (
    <BuyerShell>
      {(ws, base) => (
        <Suspense>
          <WorkspaceSupportNew
            wsId={ws.id}
            base={base}
            kind="BUYER"
            canWrite={ws.role !== 'VIEWER'}
          />
        </Suspense>
      )}
    </BuyerShell>
  );
}
