'use client';
import { BuyerShell } from '@/components/buyer-shell';
import { WorkspaceSupportDetail } from '@/components/support-ui';

export default function BuyerSupportTicketPage() {
  return (
    <BuyerShell>
      {(ws, base) => (
        <WorkspaceSupportDetail wsId={ws.id} base={base} canWrite={ws.role !== 'VIEWER'} />
      )}
    </BuyerShell>
  );
}
