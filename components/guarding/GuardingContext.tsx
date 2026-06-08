'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface DelegationRules {
  spendLimit: string;
  allowedAddress: string;
  expiryDays: number;
}

export interface ParsedIntentTx {
  amount: number;
  target: string;
  token: string;
  label: string;
  reason?: string;
}

export type RobotState = 'idle' | 'listening' | 'processing' | 'validating' | 'warning';

interface GuardingContextType {
  // Wallet / Account state
  smartAccount: string | null;
  setSmartAccount: (address: string | null) => void;
  sessionAddress: string | null;
  setSessionAddress: (address: string | null) => void;
  sessionPrivateKey: string | null;
  setSessionPrivateKey: (key: string | null) => void;
  
  // Rules / Permissions state
  delegationRules: DelegationRules | null;
  setDelegationRules: (rules: DelegationRules | null) => void;
  activeContextId: string | null;
  setActiveContextId: (contextId: string | null) => void;

  // Simulator / Transaction state
  parsedIntentTx: ParsedIntentTx | null;
  setParsedIntentTx: (tx: ParsedIntentTx | null) => void;
  currentSimResult: any | null;
  setCurrentSimResult: (result: any | null) => void;
  relayReadyPayload: any | null;
  setRelayReadyPayload: (payload: any | null) => void;

  // Layout / Robot state
  robotState: RobotState;
  setRobotState: (state: RobotState) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const GuardingContext = createContext<GuardingContextType | undefined>(undefined);

export function GuardingProvider({ children }: { children: ReactNode }) {
  const [smartAccount, setSmartAccount] = useState<string | null>(null);
  const [sessionAddress, setSessionAddress] = useState<string | null>(null);
  const [sessionPrivateKey, setSessionPrivateKey] = useState<string | null>(null);
  const [delegationRules, setDelegationRules] = useState<DelegationRules | null>(null);
  const [activeContextId, setActiveContextId] = useState<string | null>(null);

  const [parsedIntentTx, setParsedIntentTx] = useState<ParsedIntentTx | null>(null);
  const [currentSimResult, setCurrentSimResult] = useState<any | null>(null);
  const [relayReadyPayload, setRelayReadyPayload] = useState<any | null>(null);

  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  return (
    <GuardingContext.Provider
      value={{
        smartAccount,
        setSmartAccount,
        sessionAddress,
        setSessionAddress,
        sessionPrivateKey,
        setSessionPrivateKey,
        delegationRules,
        setDelegationRules,
        activeContextId,
        setActiveContextId,
        parsedIntentTx,
        setParsedIntentTx,
        currentSimResult,
        setCurrentSimResult,
        relayReadyPayload,
        setRelayReadyPayload,
        robotState,
        setRobotState,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </GuardingContext.Provider>
  );
}

export function useGuardingState() {
  const context = useContext(GuardingContext);
  if (context === undefined) {
    throw new Error('useGuardingState must be used within a GuardingProvider');
  }
  return context;
}
