// app/guarding/sessions/page.tsx
'use client';

import { useGuarding } from '@/components/guarding/GuardingContext';
import SectionHeader from '@/components/guarding/shared/SectionHeader';
import Panel from '@/components/guarding/shared/Panel';
import StatusPill from '@/components/guarding/shared/StatusPill';

export default function SessionsPage() {
  const { 
    smartAccountAddress, 
    sessionAddress, 
    sessionPrivateKey, 
    delegationRules, 
    activeContextId,
    sessionsList,
    setActiveContextId
  } = useGuarding();

  const isSessionActive = !!activeContextId && !!sessionAddress;

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
          <h3 className="text-lg font-bold text-guardian-pearl font-heading uppercase tracking-wide">
            Operator Session Credentials
          </h3>
          
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-white/5">
              <span className="text-xs font-mono text-guardian-ash">SESSION STATUS</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                isSessionActive 
                  ? "bg-white/10 text-white border border-white/20 animate-pulse" 
                  : "bg-transparent text-white/40 border border-white/10"
              }`}>
                {isSessionActive ? "● ACTIVE_RUNNING" : "Awaiting signature approval"}
              </span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5">
              <span className="text-guardian-ash block text-[9px] font-bold">OPERATOR PUBLIC KEY (ADDRESS)</span>
              <span className="text-guardian-ash/90 break-all block mt-0.5 select-all">
                {sessionAddress ? sessionAddress : 'Awaiting initialization...'}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5">
              <span className="text-guardian-ash block text-[9px] font-bold">OPERATOR PRIVATE KEY</span>
              <span className="text-guardian-ash/90 break-all block mt-0.5 select-all">
                {sessionPrivateKey ? '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••' : 'Awaiting initialization...'}
              </span>
              {sessionPrivateKey && (
                <p className="text-white/60 text-[8px] mt-1.5 font-sans font-semibold uppercase tracking-wider">
                  ⚠️ Warning: Ephemeral key saved in browser engine memory only. Never export to persistent logs.
                </p>
              )}
            </div>
          </div>
        </Panel>

        {/* Smart Account Context details */}
        <Panel className="space-y-4">
          <h3 className="text-lg font-bold text-guardian-pearl font-heading uppercase tracking-wide">
            Smart Account Bindings
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5">
              <span className="text-guardian-ash block text-[9px] font-bold">SMART ACCOUNT (ERC-4337)</span>
              <span className="text-guardian-ash/90 break-all block mt-0.5 select-all">
                {smartAccountAddress ? smartAccountAddress : 'Smart Account not generated'}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5">
              <span className="text-guardian-ash block text-[9px] font-bold">ERC-7715 CONTEXT ID</span>
              <span className="text-guardian-ash/90 break-all block mt-0.5 select-all">
                {activeContextId ? activeContextId : 'Awaiting signature approval'}
              </span>
            </div>
          </div>
        </Panel>

        {/* Registered Active Sessions Grid */}
        <Panel className="col-span-1 md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-guardian-pearl font-heading uppercase tracking-wide">
            Registered Cryptographic Session Keys
          </h3>
          <p className="text-xs text-guardian-ash">
            Click on any session to select it as the active context for simulator checks and validation gates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessionsList.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-guardian-ash italic font-mono text-xs p-5 bg-slate-950/80 rounded-xl border border-white/5 text-center">
                No Active Sessions Found. Go to Permissions to create one.
              </div>
            ) : (
              sessionsList.map((session) => (
                <div 
                  key={session.id} 
                  onClick={() => setActiveContextId(session.id)} // Select this session for testing in the simulator!
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    activeContextId === session.id 
                      ? "border-white bg-white/[0.02] shadow-md" 
                      : "border-white/5 bg-transparent hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono text-white font-bold">{session.id.toUpperCase()}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-white border border-white/20">
                      {session.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs text-guardian-ash font-mono">
                    <div><span className="text-slate-600">Max Budget:</span> {session.spendLimit} USDC</div>
                    <div><span className="text-slate-600">Target Whitelist:</span> {session.targetContract ? (session.targetContract.slice(0, 12) + "...") : "None"}</div>
                    <div className="text-[10px] text-slate-600 mt-2">Signed: {new Date(session.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* Selected Session Constraints Status */}
        {delegationRules && (
          <Panel className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-guardian-pearl font-heading uppercase tracking-wide">
              Active Constraints Ledger ({activeContextId?.toUpperCase()})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-guardian-ash/90">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5">
                <span className="text-guardian-ash block text-[9px] font-bold mb-1">CAPACITY CONSTRAINT</span>
                <span className="text-white font-black text-sm">{delegationRules.spendLimit} USDC</span>
                <span className="block text-[8px] text-guardian-ash mt-1">Maximum transfer size capacity.</span>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5">
                <span className="text-guardian-ash block text-[9px] font-bold mb-1">TARGET CONTRACT WHITELIST</span>
                <span className="text-slate-200 font-bold block truncate" title={delegationRules.allowedAddress}>
                  {delegationRules.allowedAddress}
                </span>
                <span className="block text-[8px] text-guardian-ash mt-1">Authorized transaction target contract.</span>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5">
                <span className="text-guardian-ash block text-[9px] font-bold mb-1">SESSION LIFECYCLE</span>
                <span className="text-white font-black text-sm">{delegationRules.expiryDays} Days</span>
                <span className="block text-[8px] text-guardian-ash mt-1">Time remaining before self-destruction.</span>
              </div>
            </div>
          </Panel>
        )}

      </div>
    </div>
  );
}
