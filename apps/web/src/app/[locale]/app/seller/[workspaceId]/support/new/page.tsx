'use client';
import { Suspense } from 'react';
import { SellerShell } from '@/components/seller-shell';
import { WorkspaceSupportNew } from '@/components/support-ui';

export default function SellerSupportNewPage() {
  return (
    <SellerShell>
      {(ws, base) => (
        <Suspense>
          <WorkspaceSupportNew
            wsId={ws.id}
            base={base}
            kind="SELLER"
            canWrite={ws.role !== 'VIEWER'}
          />
        </Suspense>
      )}
    </SellerShell>
  );
}
