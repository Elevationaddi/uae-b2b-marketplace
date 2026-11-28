'use client';
import { BuyerShell } from '@/components/buyer-shell';
import { WorkspaceSupportList } from '@/components/support-ui';

export default function BuyerSupportPage() {
  return (
    <BuyerShell>
      {(ws, base) => (
        <WorkspaceSupportList wsId={ws.id} base={base} canWrite={ws.role !== 'VIEWER'} />
      )}
    </BuyerShell>
  );
}
