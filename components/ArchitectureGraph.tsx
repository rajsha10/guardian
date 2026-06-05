'use client';

interface ArchitectureGraphProps {
  walletAddress: `0x${string}` | undefined;
  smartAccount: string | null;
  sessionAddress: string | null;
  delegationRules: {
    spendLimit: string;
    allowedAddress: string;
    expiryDays: number;
  } | null;
}

export default function ArchitectureGraph({
  walletAddress,
  smartAccount,
  sessionAddress,
  delegationRules,
}: ArchitectureGraphProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl col-span-1 md:col-span-2 mt-8">
      <h2 className="text-xl font-bold mb-6 tracking-tight text-emerald-400 font-mono">
        System Topology & Trust Boundary Mapping
      </h2>

      <div className="flex flex-col items-center space-y-4 font-mono text-xs max-w-xl mx-auto">
        
        {/* Node 1: Primary Signer Wallet */}
        <div className={`w-full p-3 rounded-lg border text-center transition-all ${
          walletAddress ? 'bg-slate-950 border-indigo-500 text-indigo-300' : 'bg-slate-950/40 border-slate-800 text-slate-600'
        }`}>
          <span className="block text-[10px] text-slate-500 font-bold">1. USER WALLET (EOA ROOT)</span>
          {walletAddress ? walletAddress : 'Not Connected'}
        </div>

        <div className="text-slate-600 text-base animate-pulse">↓</div>

        {/* Node 2: Core Account Container */}
        <div className={`w-full p-3 rounded-lg border text-center transition-all ${
          smartAccount ? 'bg-slate-950 border-blue-500 text-blue-300' : 'bg-slate-950/40 border-slate-800 text-slate-600'
        }`}>
          <span className="block text-[10px] text-slate-500 font-bold">2. METAMASK SMART ACCOUNT CONTAINER (ERC-4337/7710)</span>
          {smartAccount ? smartAccount : 'Awaiting Core Initialization'}
        </div>

        <div className="text-slate-600 text-base animate-pulse">↓</div>

        {/* Node 3: Generated Ephemeral AI Signer */}
        <div className={`w-full p-3 rounded-lg border text-center transition-all ${
          sessionAddress ? 'bg-slate-950 border-violet-500 text-violet-300' : 'bg-slate-950/40 border-slate-800 text-slate-600'
        }`}>
          <span className="block text-[10px] text-slate-500 font-bold">3. AGENT SESSION ACCOUNT (EPHEMERAL OPERATOR)</span>
          {sessionAddress ? sessionAddress : 'Awaiting Session Key Initialization'}
        </div>

        <div className="text-slate-600 text-base animate-pulse">↓</div>

        {/* Node 4: Requested Cryptographic Permission Scope */}
        <div className={`w-full p-4 rounded-lg border text-left transition-all ${
          delegationRules ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-slate-950/40 border-slate-800 text-slate-600'
        }`}>
          <span className="block text-[10px] text-slate-500 font-bold text-center mb-2">4. REQUESTED PERMISSION SCOPE</span>
          {delegationRules ? (
            <div className="space-y-1 text-[11px] bg-slate-950/80 p-3 rounded border border-emerald-900/60 font-mono">
              <div><span className="text-slate-500">Spend Limit Capability:</span> <span className="text-emerald-400 font-bold">{delegationRules.spendLimit} USDC</span></div>
              <div className="break-all"><span className="text-slate-500">Cryptographic Whitelist:</span> <span className="text-slate-300">{delegationRules.allowedAddress}</span></div>
              <div><span className="text-slate-500">Session Hard Expiry:</span> <span className="text-slate-300">{delegationRules.expiryDays} Days</span></div>
            </div>
          ) : (
            <p className="text-center italic text-slate-600">Awaiting Fine-Grained Permission Rules Allocation</p>
          )}
        </div>

      </div>
    </div>
  );
}
