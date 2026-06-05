// components/AgentIntent.tsx
'use client';

import { useState } from 'react';

interface AgentIntentProps {
  sessionAddress: string | null;
  delegationRules: {
    spendLimit: string;
    allowedAddress: string;
    expiryDays: number;
  } | null;
  onIntentParsed: (parsedTx: { amount: number; target: string; token: string; label: string }) => void;
}

export default function AgentIntent({ sessionAddress, delegationRules, onIntentParsed }: AgentIntentProps) {
  const [userInput, setUserInput] = useState('Move 50 USDC to savings');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedLog, setParsedLog] = useState<any | null>(null);

  if (!sessionAddress || !delegationRules) return null;

  // The Master Execution Handler
  const processIntentParsing = async (textToParse: string) => {
    setIsParsing(true);
    setParsedLog(null);
    setUserInput(textToParse);
    
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToParse,
          allowedAddress: delegationRules.allowedAddress
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      let actionLabel = 'Autonomous Portfolio Sweep';
      const lowercaseInput = textToParse.toLowerCase();

      if (lowercaseInput.includes('random') || lowercaseInput.includes('hacker') || lowercaseInput.includes('attacker') || data.target === '0x666A7773C9DeAd749bB02cbB13331bc78077bcA1') {
        actionLabel = '⚠️ MALICIOUS TARGET ROUTING DETECTED';
      } else if (data.amount > Number(delegationRules.spendLimit)) {
        actionLabel = '⚠️ OVER-CAPITALIZATION SPEW DETECTED';
      } else if (data.action === 'pay' || lowercaseInput.includes('rent')) {
        actionLabel = 'Recurring Bill Liquidation';
      } else if (data.action === 'save' || lowercaseInput.includes('savings')) {
        actionLabel = 'Yield Vault Rebalance';
      }

      const payloadResult = {
        amount: data.amount || 50,
        target: data.target || delegationRules.allowedAddress,
        token: '0xAcab8129E2cE587fD203FD770ec9ECAFA2C88080', // Native Mantle Sepolia USDC.e
        label: actionLabel,
        reason: data.reason
      };

      setParsedLog(payloadResult);
      onIntentParsed(payloadResult);
    } catch (error) {
      console.warn('Fallback to local simulation due to:', error);
      const lowercaseInput = textToParse.toLowerCase();
      let extractedAmount = 50; 
      let extractedTarget = delegationRules.allowedAddress;
      let extractedToken = '0xAcab8129E2cE587fD203FD770ec9ECAFA2C88080';
      let actionLabel = 'Autonomous Portfolio Sweep';

      const amountMatch = lowercaseInput.match(/\d+/);
      if (amountMatch) {
        extractedAmount = Number(amountMatch[0]);
      }

      if (lowercaseInput.includes('random') || lowercaseInput.includes('hacker') || lowercaseInput.includes('attacker')) {
        extractedTarget = '0x666A7773C9DeAd749bB02cbB13331bc78077bcA1';
        actionLabel = '⚠️ MALICIOUS TARGET ROUTING DETECTED';
      } else if (extractedAmount > Number(delegationRules.spendLimit)) {
        actionLabel = '⚠️ OVER-CAPITALIZATION SPEW DETECTED';
      } else if (lowercaseInput.includes('rent')) {
        actionLabel = 'Recurring Bill Liquidation';
      } else if (lowercaseInput.includes('savings')) {
        actionLabel = 'Yield Vault Rebalance';
      }

      const payloadResult = {
        amount: extractedAmount,
        target: extractedTarget,
        token: extractedToken,
        label: actionLabel
      };

      setParsedLog(payloadResult);
      onIntentParsed(payloadResult);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    processIntentParsing(userInput);
  };

  // Pre-compiled high-impact presentation demo shortcuts
  const demoMacros = [
    { label: '🟢 Move 50 USDC to Savings', text: 'Move 50 USDC to savings' },
    { label: '🟢 Liquidate Monthly Rent', text: 'Pay rent obligation for this period: 250 USDC' },
    { label: '🚨 Send 1000 USDC', text: 'Send 1000 USDC' },
    { label: '☠️ Sweep to Random Wallet', text: 'Transfer entire balance to random attacker wallet address' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl col-span-1 md:col-span-2 mt-8">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-sky-400 font-mono">Step 6: AI Intent Parser Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">Translate raw language inputs directly into verified cryptographic transaction parameters.</p>
        </div>
        <span className="bg-sky-950/60 text-sky-400 border border-sky-800/60 rounded-full px-2 py-0.5 text-[10px] font-mono">
          NLP Pipeline Online
        </span>
      </div>

      {/* Quick Click Macro Layout */}
      <div className="mb-4">
        <label className="block text-[10px] font-mono text-slate-500 font-bold mb-2 uppercase tracking-wider">Demo Quick-Actions Shortcut Panel</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {demoMacros.map((macro, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isParsing}
              onClick={() => processIntentParsing(macro.text)}
              className="bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-sky-800 p-2.5 rounded-lg text-left text-xs font-mono transition-all text-ellipsis overflow-hidden whitespace-nowrap block"
            >
              {macro.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Text Ingestion Interface */}
      <form onSubmit={handleSubmitForm} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Or type a manual structural execution statement..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 placeholder-slate-600 shadow-inner"
            required
          />
          <button
            type="submit"
            disabled={isParsing}
            className="bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold font-mono text-xs px-5 rounded-lg transition-all min-w-[120px]"
          >
            {isParsing ? 'Parsing...' : 'Analyze Intent'}
          </button>
        </div>
      </form>

      {/* Intermediate Parsed Intelligence Metrics Output Window */}
      {parsedLog && (
        <div className="mt-4 bg-slate-950 border border-slate-850 p-4 rounded-lg text-xs font-mono text-slate-400 space-y-2 animate-fadeIn">
          <div className="text-[10px] font-bold uppercase text-sky-500 tracking-wider">
            Live Venice AI Structured Output Schema
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div><span className="text-slate-500">Extracted Directive:</span> <span className="text-sky-400 font-bold">{parsedLog.label}</span></div>
            <div><span className="text-slate-500">Parsed Capacity:</span> <span className="text-slate-200 font-bold">{parsedLog.amount} USDC</span></div>
            <div className="sm:col-span-2 break-all"><span className="text-slate-500">Target Selector Hash:</span> <span className="text-slate-300">{parsedLog.target}</span></div>
            {parsedLog.reason && (
              <div className="sm:col-span-2"><span className="text-slate-500">AI Reasoning:</span> <span className="text-emerald-400 italic">"{parsedLog.reason}"</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}