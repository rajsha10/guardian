// components/TransactionBuilder.tsx
'use client';

import { useState, useEffect } from 'react';

interface TransactionBuilderProps {
  simResult: {
    status: 'ALLOWED' | 'BLOCKED';
    reason: string;
    parsedData?: {
      amount: number;
      target: string;
      token: string;
    };
    txPayload?: {
      from: string;
      signedBySessionKey: string | null;
      targetContract: string;
      calldata: string;
      gasRelayer: string;
    };
  } | null;
  onPayloadGenerated: (payload: any | null) => void;
}

export default function TransactionBuilder({ simResult, onPayloadGenerated }: TransactionBuilderProps) {
  const [isFinalized, setIsFinalized] = useState(false);

  // State listener to clear the freeze lock if a new intent stream arrives
  useEffect(() => {
    setIsFinalized(false);
  }, [simResult?.parsedData]); // Resets whenever the underlying parsed token payload changes

  if (!simResult) return null;

  // STRESS TEST: Safe rejection UI when the Validator drops a BLOCKED result or Zero action
  if (simResult.status === 'BLOCKED' || !simResult.parsedData || simResult.parsedData.amount === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl col-span-1 md:col-span-2 mt-8 opacity-60">
        <h2 className="text-xl font-bold tracking-tight text-rose-500 font-mono">Step 7: Transaction Builder Layer</h2>
        <p className="text-xs text-slate-400 mt-0.5">Pipeline execution frozen by security enforcement sub-system.</p>
        <div className="mt-4 bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg font-mono text-xs text-rose-300 italic">
          🛑 BUILDER LOCKED: Cannot compile an EVM payload container for invalid, blocked, or non-actionable intent requests.
        </div>
      </div>
    );
  }

  const { amount, target, token } = simResult.parsedData;

  // Compile ERC-20 transfer calldata: transfer(address,uint256)
  const paddedAddress = target.slice(2).padStart(64, '0');
  const hexAmount = (amount * 10 ** 6).toString(16).padStart(64, '0'); 
  const encodedTransfer = `0xa9059cbb${paddedAddress}${hexAmount}`;

  const txObject = {
    to: token, 
    value: 0,
    data: encodedTransfer,
    chainId: 5003, 
  };

  const handleFinalize = () => {
    setIsFinalized(true);
    onPayloadGenerated({
      chainId: txObject.chainId,
      to: txObject.to,
      data: txObject.data,
      value: txObject.value,
      from: simResult.txPayload?.from || '0x7710_SmartWalletContainer',
      sessionKeyContext: simResult.txPayload?.signedBySessionKey || '',
      status: "READY_FOR_RELAY"
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl col-span-1 md:col-span-2 mt-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-amber-400 font-mono">Step 7: Transaction Builder Layer</h2>
          <p className="text-xs text-slate-400 mt-0.5">Compiling verified AI intent parameters into an immutable raw EVM transaction block.</p>
        </div>
        <span className={`border rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
          isFinalized ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800/40'
        }`}>
          {isFinalized ? '✓ Freeze Lock Active' : 'Payload Assembled'}
        </span>
      </div>

      <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 mb-4 font-mono text-xs text-slate-300 space-y-3">
        <div className="text-emerald-400 font-bold flex items-center gap-1.5">
          <span>✓</span> Execution Approved By Trust Boundaries
        </div>

        <div className="space-y-1 bg-slate-900/60 p-3 rounded border border-slate-800 font-mono text-[11px]">
          <div className="text-slate-500 uppercase font-bold text-[9px] mb-2 tracking-wider">Generated Transaction Object</div>
          <div><span className="text-slate-500">to (Target Asset):</span> <span className="text-slate-200 break-all">{txObject.to}</span></div>
          <div><span className="text-slate-500">value:</span> <span className="text-slate-200">{txObject.value}</span></div>
          <div className="break-all"><span className="text-slate-500">data (Calldata):</span> <span className="text-amber-300">{txObject.data}</span></div>
          <div><span className="text-slate-500">chain:</span> <span className="text-slate-200 font-bold">{txObject.chainId} (Mantle Sepolia)</span></div>
        </div>
      </div>

      {!isFinalized ? (
        <button
          onClick={handleFinalize}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-lg shadow-md transition-all text-sm font-mono tracking-wide"
        >
          🔒 Finalize & Generate Relay Ready Payload
        </button>
      ) : (
        <div className="bg-emerald-950/40 border border-emerald-800 p-3 rounded-lg text-xs font-mono text-center animate-fadeIn">
          <span className="text-emerald-400 font-bold">📦 READY FOR RELAY DISPATCH</span>
          <p className="text-slate-400 text-[11px] mt-0.5">EVM payload signed, packaged, and frozen inside the execution context matrix.</p>
        </div>
      )}
    </div>
  );
}