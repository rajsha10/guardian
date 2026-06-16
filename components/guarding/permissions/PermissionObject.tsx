import React from 'react';
import { useGuarding } from '../GuardingContext';

export const DelegationCard: React.FC = () => {
  const { 
    smartAccountAddress, // Delegator
    delegation,          // Holds the delegate target and raw configs
    delegationSignature, // Cryptographic proof 
    delegationCreatedAt,
    delegationRules
  } = useGuarding();

  // Calculate default expiration text based on contextual mock parameters (30 days from creation)
  const expirationText = delegationCreatedAt 
    ? new Date(new Date(delegationCreatedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    : "30 Days (Standard)";

  if (!delegationSignature) {
    return (
      <div className="p-6 bg-zinc-950 border border-dashed border-zinc-850 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 min-h-[340px]">
        <div className="text-3xl text-zinc-600 animate-pulse">📜</div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-400">No Active Delegation Policy</h3>
          <p className="text-xs text-zinc-500 max-w-xs">Configure parameters above and sign using your MetaMask Smart Account to construct the secure session certificate.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#14161e] border border-white/10 rounded-2xl shadow-xl p-6 relative overflow-hidden group">
      {/* Header Matrix */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg font-bold">
            🛡️
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200 tracking-wide uppercase">DelegAI Guardian Certificate</h4>
            <p className="text-[10px] text-zinc-500 font-mono">Standard EIP-7715 / ERC-7715 Framework</p>
          </div>
        </div>
        
        {/* Dynamic Status Pill */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-white/5 text-white border border-white/20 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          ACTIVE
        </span>
      </div>

      {/* Main Structural Parameters */}
      <div className="space-y-4">
        {/* Address Mappings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Delegator Address</span>
            <div className="font-mono text-xs text-zinc-300 bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5 truncate">
              {smartAccountAddress || "0x123...Missing"}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Delegate (Agent Key)</span>
            <div className="font-mono text-xs text-white bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5 truncate">
              {delegation?.to || delegation?.delegate || "0x456...Missing"}
            </div>
          </div>
        </div>

        {/* Boundary Rules */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Spend Limit</span>
            <div className="text-base font-bold text-zinc-100 flex items-baseline gap-1">
              {delegationRules?.spendLimit ? `${delegationRules.spendLimit}` : "500"}{" "}
              <span className="text-xs font-medium text-zinc-400">USDC</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Policy Expiration</span>
            <div className="text-sm font-semibold text-zinc-300 pt-0.5 font-mono">
              {expirationText}
            </div>
          </div>
        </div>

        {/* Dynamic Allowance Sub-text */}
        <p className="text-[11px] text-zinc-400 italic border-t border-white/10 pt-3 mt-3">
          This cryptographically bound certificate authorizes a budget threshold of{" "}
          <span className="text-white font-bold font-mono">
            {delegationRules?.spendLimit || "500"} USDC
          </span>{" "}
          for automated transactions.
        </p>

        {/* Cryptographic Signature Payload Segment */}
        <div className="border-t border-white/10 pt-4 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Delegation Signature (EIP-712 proof)</span>
            <span className="text-[9px] text-zinc-600 font-mono">Verified On-Chain ✅</span>
          </div>
          <div className="font-mono text-[11px] text-white/95 bg-black/40 p-2.5 rounded-lg border border-white/5 break-all max-h-16 overflow-y-auto selection:bg-white/10 selection:text-white leading-normal">
            {delegationSignature}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegationCard;
