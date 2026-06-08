// app/guarding/sessions/page.tsx
'use client';

import { useGuardingState } from '@/components/guarding/GuardingContext';
import SectionHeader from '@/components/guarding/shared/SectionHeader';
import Panel from '@/components/guarding/shared/Panel';
import StatusPill from '@/components/guarding/shared/StatusPill';

export default function SessionsPage() {
  const { 
    smartAccount, 
    sessionAddress, 
    sessionPrivateKey, 
    delegationRules, 
    activeContextId 
  } = useGuardingState();

  const isSessionActive = !!sessionAddress && !!activeContextId;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Session Keys Operator" 
        description="Monitor active ephemeral operator session keys, private key delegation status, and cryptographic lifecycles." 
        badge={
          <StatusPill 
            status={isSessionActive ? "success" : "idle"} 
            label={isSessionActive ? "Session Active" : "No Active Session"} 
          />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Session Status Overview Panel */}
        <Panel className="space-y-4">
          <h3 className="text-lg font-bold text-[#050816] font-heading uppercase tracking-wide">
            Operator Session Credentials
          </h3>
          
          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[9px] font-bold">OPERATOR PUBLIC KEY (ADDRESS)</span>
              <span className="text-slate-300 break-all block mt-0.5 select-all">
                {sessionAddress ? sessionAddress : 'Awaiting initialization...'}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[9px] font-bold">OPERATOR PRIVATE KEY</span>
              <span className="text-slate-300 break-all block mt-0.5 select-all">
                {sessionPrivateKey ? '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••' : 'Awaiting initialization...'}
              </span>
              {sessionPrivateKey && (
                <p className="text-rose-400 text-[8px] mt-1.5 font-sans font-semibold uppercase tracking-wider">
                  ⚠️ Warning: Ephemeral key saved in browser engine memory only. Never export to persistent logs.
                </p>
              )}
            </div>
          </div>
        </Panel>

        {/* Smart Account Context details */}
        <Panel className="space-y-4">
          <h3 className="text-lg font-bold text-[#050816] font-heading uppercase tracking-wide">
            Smart Account Bindings
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[9px] font-bold">SMART ACCOUNT (ERC-4337)</span>
              <span className="text-slate-300 break-all block mt-0.5 select-all">
                {smartAccount ? smartAccount : 'Smart Account not generated'}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[9px] font-bold">ERC-7715 CONTEXT ID</span>
              <span className="text-slate-300 break-all block mt-0.5 select-all">
                {activeContextId ? activeContextId : 'Awaiting signature approval'}
              </span>
            </div>
          </div>
        </Panel>

        {/* Delegation Constraints Status */}
        {delegationRules && (
          <Panel className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-[#050816] font-heading uppercase tracking-wide">
              Active Session Limits Ledger
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-slate-300">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] font-bold mb-1">CAPACITY CONSTRAINT</span>
                <span className="text-emerald-400 font-black text-sm">{delegationRules.spendLimit} USDC</span>
                <span className="block text-[8px] text-slate-500 mt-1">Maximum transfer size capacity.</span>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] font-bold mb-1">TARGET CONTRACT WHITELIST</span>
                <span className="text-slate-200 font-bold block truncate" title={delegationRules.allowedAddress}>
                  {delegationRules.allowedAddress}
                </span>
                <span className="block text-[8px] text-slate-500 mt-1">Authorized transaction target contract.</span>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[9px] font-bold mb-1">SESSION LIFECYCLE</span>
                <span className="text-indigo-400 font-black text-sm">{delegationRules.expiryDays} Days</span>
                <span className="block text-[8px] text-slate-500 mt-1">Time remaining before self-destruction.</span>
              </div>
            </div>
          </Panel>
        )}

      </div>
    </div>
  );
}
