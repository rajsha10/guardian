// app/guarding/transactions/page.tsx
'use client';

import SectionHeader from '@/components/guarding/shared/SectionHeader';
import TransactionBuilder from '@/components/guarding/transactions/TransactionBuilder';
import RelayerBroadcast from '@/components/guarding/transactions/RelayerBroadcast';
import { useGuardingState } from '@/components/guarding/GuardingContext';

export default function TransactionsPage() {
  const { relayReadyPayload, incrementRelayed } = useGuardingState();

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Transaction Relayer" 
        description="Compile pre-approved transaction payloads into immutable raw EVM transaction block data and broadcast them gaslessly." 
      />

      <div className="grid grid-cols-1 gap-8">
        <TransactionBuilder />
        <RelayerBroadcast 
          relayReadyPayload={relayReadyPayload} 
          onRelayConfirmed={incrementRelayed}
        />
      </div>
    </div>
  );
}
