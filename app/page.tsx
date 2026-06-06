'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import WalletConnect from '../components/WalletConnect';
import DelegationForm from '../components/DelegationForm';
import PermissionObject from '../components/PermissionObject';
import ArchitectureGraph from '../components/ArchitectureGraph';
import ExecutionSimulator from '../components/ExecutionSimulator';
import AgentIntent from '../components/AgentIntent';
import TransactionBuilder from '../components/TransactionBuilder';
import RelayerBroadcast from '../components/RelayerBroadcast';

type DelegationRules = {
  spendLimit: string;
  allowedAddress: string;
  expiryDays: number;
};

export default function Home() {
  const { address } = useAccount();
  const [smartAccount, setSmartAccount] = useState<string | null>(null);
  const [sessionAddress, setSessionAddress] = useState<string | null>(null);
  const [sessionPrivateKey, setSessionPrivateKey] = useState<string | null>(null);
  const [delegationRules, setDelegationRules] = useState<DelegationRules | null>(null);
  const [activeContextId, setActiveContextId] = useState<string | null>(null);

  // ADD THIS FRESH STATE HOOK TRACKER HERE
  const [parsedIntentTx, setParsedIntentTx] = useState<{
    amount: number;
    target: string;
    token: string;
    label: string;
  } | null>(null);

  const [currentSimResult, setCurrentSimResult] = useState<any | null>(null);
  
  // ADD THIS STATE TRACKER
  const [relayReadyPayload, setRelayReadyPayload] = useState<any | null>(null);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      <header className="mb-12 text-center md:text-left border-b border-slate-900 pb-6">
        <div className="inline-block bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 rounded-full px-3 py-1 text-xs font-medium mb-3 font-mono">
          Phase 5 • Step 2 Active
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          DelegAI Guardian
        </h1>
        <p className="text-slate-400 mt-2 text-md max-w-2xl">
          Sovereign autonomous workflows. Issue fine-grained boundaries to local browser execution keys before committing them on-chain.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <WalletConnect
          onSmartAccountCreated={(addr, sAddress, sPKey) => {
            setSmartAccount(addr);
            setSessionAddress(sAddress);
            setSessionPrivateKey(sPKey);
          }}
        />

        <DelegationForm
          sessionAddress={sessionAddress}
          onRulesSaved={(rules) => setDelegationRules(rules)}
        />
      </div>

      <div className="mt-8">
        <PermissionObject
          sessionAddress={sessionAddress}
          delegationRules={delegationRules}
          onPermissionsConfirmed={(contextId) => setActiveContextId(contextId)}
        />
      </div>

      <ArchitectureGraph
        walletAddress={address}
        smartAccount={smartAccount}
        sessionAddress={sessionAddress}
        delegationRules={delegationRules}
      />

      {/* INSERT STEP 6 INTENT CARD HERE */}
      <AgentIntent
        sessionAddress={sessionAddress}
        delegationRules={delegationRules}
        onIntentParsed={(parsedTx) => {
          // 1. CRITICAL RESET MECHANISM: Evict stale blocks from memory instantly
          setCurrentSimResult(null);
          setRelayReadyPayload(null);
          
          // 2. Introduce the fresh intent request context down the loop
          setParsedIntentTx(parsedTx);
        }}
      />

      {/* UPDATE EXECUTION SIMULATOR COMPONENT MOUNT TO RECEIVE THE PASSED STATE PROPS */}
      <ExecutionSimulator
        sessionAddress={sessionAddress}
        delegationRules={delegationRules}
        overrideTxPayload={parsedIntentTx}
        onSimulationEvaluated={(result) => setCurrentSimResult(result)}
      />

      {/* MOUNT TRANSACTION BUILDER CARD */}
      <TransactionBuilder
        simResult={currentSimResult}
        onPayloadGenerated={(payload) => setRelayReadyPayload(payload)}
      />

      {/* RENDER THE RE-WRITTEN BROADCASTER TARGET MODULE */}
      <RelayerBroadcast 
        relayReadyPayload={relayReadyPayload} 
      />

      {delegationRules && (
        <div className="mt-8 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 font-mono text-xs animate-fadeIn">
          🚀 <strong>Step 1 & Step 2 Complete.</strong> Active parameters registered in React engine state. Ready for <strong>Step 3: Triggering the actual `wallet_grantPermissions` (ERC-7715) request window</strong>.
          <div className="mt-3 space-y-1 text-[11px]">
            <div>Smart Account: {smartAccount}</div>
            <div>Session Account: {sessionAddress}</div>
            <div>Session Key Ready: {sessionPrivateKey ? 'true' : 'false'}</div>
            <div>Permission Context: {activeContextId ?? 'awaiting signature'}</div>
          </div>
        </div>
      )}
    </main>
  );
}
