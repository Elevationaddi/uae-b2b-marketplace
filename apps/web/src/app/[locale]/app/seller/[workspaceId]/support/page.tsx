'use client';
import { SellerShell } from '@/components/seller-shell';
import { WorkspaceSupportList } from '@/components/support-ui';

export default function SellerSupportPage() {
  return (
    <SellerShell>
      {(ws, base) => (
        <WorkspaceSupportList wsId={ws.id} base={base} canWrite={ws.role !== 'VIEWER'} />
      )}
    </SellerShell>
  );
}
