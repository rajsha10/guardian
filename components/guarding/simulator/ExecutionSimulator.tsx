'use client';

import { useEffect } from 'react';
import { useGuardingState } from '../GuardingContext';
import Panel from '../shared/Panel';

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

export default function ExecutionSimulator() {
  const { 
    sessionAddress, 
    delegationRules, 
    parsedIntentTx, 
    currentSimResult, 
    setCurrentSimResult, 
    setRobotState 
  } = useGuardingState();

  const validateExecution = (txRequest: { amount: number; target: string; token: string; timestamp: number }) => {
    if (!delegationRules) return null;
    
    // Intercept zero transactions
    if (!txRequest.amount || txRequest.amount <= 0) {
      return {
        status: 'BLOCKED' as const,
        reason: 'ASSET EXCLUSION: Intent contains zero or negative allocation boundaries (0 USDC). Transaction execution dropped.',
        parsedData: { amount: 0, target: txRequest.target, token: txRequest.token }
      };
    }

    const maxAmountAllowed = Number(delegationRules.spendLimit);
    const whitelistedTarget = delegationRules.allowedAddress.toLowerCase();
    const authorizedToken = '0xAcab8129E2cE587fD203FD770ec9ECAFA2C88080'.toLowerCase(); 
    const computedExpiryTimestamp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * delegationRules.expiryDays);

    if (txRequest.target.toLowerCase() !== whitelistedTarget) {
      return {
        status: 'BLOCKED' as const,
        reason: `CRITICAL SEGREGATION FAILURE: Target ${txRequest.target.slice(0, 10)}... is not on the cryptographic whitelist.`,
        parsedData: { amount: txRequest.amount, target: txRequest.target, token: txRequest.token }
      };
    }

    if (txRequest.amount > maxAmountAllowed) {
      return {
        status: 'BLOCKED' as const,
        reason: `CAPACITY BREACH: Requested intent allocation (${txRequest.amount} USDC) exceeds authorized session cap of ${maxAmountAllowed} USDC.`,
        parsedData: { amount: txRequest.amount, target: txRequest.target, token: txRequest.token }
      };
    }

    if (txRequest.token.toLowerCase() !== authorizedToken) {
      return {
        status: 'BLOCKED' as const,
        reason: 'ASSET EXCLUSION: Unauthorized asset token contract configuration.',
        parsedData: { amount: txRequest.amount, target: txRequest.target, token: txRequest.token }
      };
    }

    if (txRequest.timestamp > computedExpiryTimestamp) {
      return {
        status: 'BLOCKED' as const,
        reason: 'SESSION EXPIRED: Operation timestamp maps outside authorized delegation window.',
        parsedData: { amount: txRequest.amount, target: txRequest.target, token: txRequest.token }
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

  useEffect(() => {
    if (parsedIntentTx) {
      setRobotState('validating');
      const payloadFormat = {
        amount: parsedIntentTx.amount,
        target: parsedIntentTx.target,
        token: parsedIntentTx.token,
        timestamp: Math.floor(Date.now() / 1000)
      };

      // Simulate a small delay for verification visualization
      const timer = setTimeout(() => {
        const result = validateExecution(payloadFormat);
        if (result) {
          setCurrentSimResult(result);
          if (result.status === 'BLOCKED') {
            setRobotState('warning');
          } else {
            setRobotState('listening');
          }
        }
      }, 700);

      return () => clearTimeout(timer);
    } else {
      setCurrentSimResult(null);
    }
  }, [parsedIntentTx]);

  if (!sessionAddress || !delegationRules) return null;

  return (
    <Panel className="col-span-1 md:col-span-2">
      <h2 className="text-xl font-bold mb-2 tracking-tight text-emerald-400 font-heading uppercase">
        Trust Boundary Verdict
      </h2>
      <p className="text-xs text-slate-400 mb-4 font-sans font-medium">
        Real-time account container interception logs. This core logic runs directly inside the smart account protocol layer.
      </p>

      {currentSimResult ? (
        <div className={`p-4 rounded-xl border font-mono text-xs shadow-inner transition-all ${
          currentSimResult.status === 'ALLOWED' 
            ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-200' 
            : 'bg-rose-950/20 border-rose-900/60 text-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] tracking-wide font-black ${
              currentSimResult.status === 'ALLOWED' ? 'bg-emerald-400 text-slate-950' : 'bg-rose-500 text-white'
            }`}>
              {currentSimResult.status}
            </span>
            <span className="text-slate-500 font-bold">On-Chain Security Intercept Evaluation</span>
          </div>
          
          <p className="text-slate-300 font-medium mb-3 italic">{currentSimResult.reason}</p>

          {currentSimResult.txPayload && currentSimResult.status === 'ALLOWED' && (
            <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-900/40 text-[11px] text-emerald-400/90 space-y-1">
              <div className="font-bold text-slate-600 uppercase text-[9px] tracking-wider mb-1">Generated Gasless Relayer Object</div>
              <div><span className="text-slate-500">Origin Contract Account:</span> {currentSimResult.txPayload.from}</div>
              <div><span className="text-slate-500">Session Signer Source:</span> {currentSimResult.txPayload.signedBySessionKey}</div>
              <div className="truncate"><span className="text-slate-500">Destination Whitelist:</span> {currentSimResult.parsedData?.target}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 font-mono text-xs text-slate-500 text-center italic">
          Awaiting execution payload from the Intent Parser pipeline...
        </div>
      )}
    </Panel>
  );
}
