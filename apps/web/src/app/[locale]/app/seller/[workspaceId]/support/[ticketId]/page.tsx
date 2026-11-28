'use client';
import { SellerShell } from '@/components/seller-shell';
import { WorkspaceSupportDetail } from '@/components/support-ui';

export default function SellerSupportTicketPage() {
  return (
    <SellerShell>
      {(ws, base) => (
        <WorkspaceSupportDetail wsId={ws.id} base={base} canWrite={ws.role !== 'VIEWER'} />
      )}
    </SellerShell>
  );
}
