'use client';
import { WorkspaceDispute } from '@/components/dispute-pages';
import { BuyerShell } from '@/components/buyer-shell';

export default function BuyerDisputePage() {
  return (
    <BuyerShell>
      {(ws, base) => <WorkspaceDispute apiBase={`/buyer/workspaces/${ws.id}`} base={base} />}
    </BuyerShell>
  );
}
