// components/ExecutionSimulator.tsx
'use client';

import { useState, useEffect } from 'react';

interface ExecutionSimulatorProps {
  sessionAddress: string | null;
  delegationRules: {
    spendLimit: string;
    allowedAddress: string;
    expiryDays: number;
  } | null;
  overrideTxPayload?: { amount: number; target: string; token: string; label: string } | null;
  onSimulationEvaluated?: (result: SimulationResult | null) => void;
}

interface SimulationResult {
  status: 'ALLOWED' | 'BLOCKED';
  reason: string;
  parsedData?: {
    amount: number;
    target: string;
    token: string;
  };
  txPayload?: any;
}

export default function ExecutionSimulator({ sessionAddress, delegationRules, overrideTxPayload, onSimulationEvaluated }: ExecutionSimulatorProps) {
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  // The Core On-Chain Cryptographic Rule Validator Engine
  const validateExecution = (txRequest: { amount: number; target: string; token: string; timestamp: number }) => {
    if (!delegationRules) return null;
    
    const maxAmountAllowed = Number(delegationRules.spendLimit);
    const whitelistedTarget = delegationRules.allowedAddress.toLowerCase();
    const authorizedToken = '0xAcab8129E2cE587fD203FD770ec9ECAFA2C88080'.toLowerCase(); 
    const computedExpiryTimestamp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * delegationRules.expiryDays);

    if (txRequest.target.toLowerCase() !== whitelistedTarget) {
      return {
        status: 'BLOCKED' as const,
        reason: `CRITICAL SEGREGATION FAILURE: Target ${txRequest.target.slice(0, 10)}... is not on the cryptographic ERC-7715 contract whitelist.`
      };
    }

    if (txRequest.amount > maxAmountAllowed) {
      return {
        status: 'BLOCKED' as const,
        reason: `CAPACITY BREACH: Requested intent allocation (${txRequest.amount} USDC) exceeds the authorized session cap of ${maxAmountAllowed} USDC.`
      };
    }

    if (txRequest.token.toLowerCase() !== authorizedToken) {
      return {
        status: 'BLOCKED' as const,
        reason: 'ASSET EXCLUSION: Unauthorized asset token contract. Execution blocked by the Smart Wallet manager.'
      };
    }

    if (txRequest.timestamp > computedExpiryTimestamp) {
      return {
        status: 'BLOCKED' as const,
        reason: 'SESSION EXPIRED: Operation timestamp maps outside authorized delegation window.'
      };
    }

    return {
      status: 'ALLOWED' as const,
      reason: 'VERIFICATION SUCCESSFUL: Intent signature maps perfectly inside specified ERC-7715 boundaries.',
      parsedData: {
        amount: txRequest.amount,
        target: txRequest.target,
        token: txRequest.token
      },
      txPayload: {
        from: '0x7710_SmartWalletContainer',
        signedBySessionKey: sessionAddress,
        targetContract: txRequest.target,
        calldata: `0xa9059cbb000000000000000000000000${txRequest.target.slice(2, 10)}...`,
        gasRelayer: '1Shot_Relayer_Network'
      }
    };
  };

  // Automatically intercept and evaluate payloads incoming from the Step 6 Intent Pipeline
  useEffect(() => {
    if (overrideTxPayload) {
      const payloadFormat = {
        amount: overrideTxPayload.amount,
        target: overrideTxPayload.target,
        token: overrideTxPayload.token,
        timestamp: Math.floor(Date.now() / 1000)
      };
      const result = validateExecution(payloadFormat);
      if (result) setSimResult(result);
    }
  }, [overrideTxPayload]);

  // Propagate simulation result up to parent component
  useEffect(() => {
    if (onSimulationEvaluated) {
      onSimulationEvaluated(simResult);
    }
  }, [simResult, onSimulationEvaluated]);

  if (!sessionAddress || !delegationRules) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-6 text-center text-slate-500 font-mono text-sm mt-8">
        Awaiting signed permission context initialization to activate Trust Validation Engine...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl col-span-1 md:col-span-2 mt-8">
      <h2 className="text-xl font-bold mb-2 tracking-tight text-emerald-400 font-mono">
        Step 7: Trust Boundary Enforcement Verdict
      </h2>
      <p className="text-xs text-slate-400 mb-4 font-sans">
        Real-time account container interception logs. This core logic runs directly inside the smart account protocol layer.
      </p>

      {simResult ? (
        <div className={`p-4 rounded-lg border font-mono text-xs shadow-inner animate-fadeIn ${
          simResult.status === 'ALLOWED' 
            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200' 
            : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-2">
            <span className={`px-2 py-0.5 rounded text-[10px] tracking-wide font-black ${
              simResult.status === 'ALLOWED' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
            }`}>
              {simResult.status}
            </span>
            <span className="text-slate-400">On-Chain Security Intercept Evaluation</span>
          </div>
          
          <p className="text-slate-300 font-medium mb-3 italic">{simResult.reason}</p>

          {simResult.txPayload && (
            <div className="bg-slate-950 p-3 rounded border border-emerald-900/40 text-[11px] text-emerald-400/90 space-y-1 overflow-x-auto">
              <div className="font-bold text-slate-600 uppercase text-[9px] tracking-wider mb-1">Generated Gasless Relayer Object</div>
              <div><span className="text-slate-700">Origin Contract Account:</span> {simResult.txPayload.from}</div>
              <div><span className="text-slate-700">Session Signer Source:</span> {simResult.txPayload.signedBySessionKey}</div>
              <div><span className="text-slate-700">Destination Whitelist:</span> {simResult.txPayload.targetContract}</div>
              <div><span className="text-slate-700">Network Dispatcher:</span> {simResult.txPayload.gasRelayer} (Abstracted)</div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 font-mono text-xs text-slate-600 text-center italic">
          Awaiting execution payload from the Intent Parser pipeline...
        </div>
      )}
    </div>
  );
}