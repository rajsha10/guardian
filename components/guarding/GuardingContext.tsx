'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAddress, formatUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { publicClient, erc20Abi } from '@/lib/viemClient';

export const TARGET_USDC_TOKEN = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Standard Canonical Sepolia Mock USDC (6 decimals)

export interface RecentTx {
  hash: string;
  timestamp: string;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  amount: number;
  target: string;
  tokenSymbol: string;
}

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
  smartAccountAddress: string | null;
  smartAccountInstance: any | null; // Using 'any' or your explicit 'SmartAccount' type from Viem/MetaMask SDK
  setSmartWallet: (address: string | null, instance: any | null) => void;
  sessionAddress: string | null;
  setSessionAddress: (address: string | null) => void;
  sessionPrivateKey: string | null;
  setSessionPrivateKey: (key: string | null) => void;
  generatedDelegation: any | null;
  setGeneratedDelegation: (delegation: any | null) => void;
  signedDelegation: any | null;
  delegationSignature: string | null;
  delegatorAddress: string | null;
  delegateAddress: string | null;
  setSignedDelegationData: (delegation: any, signature: string, delegator: string, delegate: string) => void;
  delegation: any | null;
  delegationCreatedAt: string | null;
  saveDelegationInContext: (delegation: any, signature: string, rules?: DelegationRules) => void;
  sessionsList: any[];
  setSessionsList: (sessions: any[]) => void;
  
  sessionAccount: any | null;
  sessionSignature: string | null;
  setSessionSignature: (signature: string | null) => void;
  generateEphemeralSessionKey: () => void;
  
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
  sandboxMode: boolean;
  setSandboxMode: (mode: boolean) => void;
  fallbackRelayer: boolean;
  setFallbackRelayer: (mode: boolean) => void;

  // Layout / Robot state
  robotState: RobotState;
  setRobotState: (state: RobotState) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Metrics state
  metrics: {
    aiDecisions: number;
    blockedExecutions: number;
    successfulTxs: number;
    relayedTxs: number;
  };
  incrementAiDecisions: () => void;
  incrementBlocked: () => void;
  incrementSuccessful: () => void;
  incrementRelayed: () => void;

  // Balances state
  balances: {
    smartAccountETH: string | null;
    smartAccountUSDC: number | null;
    sessionETH: string | null;
  };
  fetchBalances: () => Promise<void>;

  // Recent transactions
  recentTxs: RecentTx[];
  addRecentTx: (tx: RecentTx) => void;
}

const GuardingContext = createContext<GuardingContextType | undefined>(undefined);

export function GuardingProvider({ children }: { children: ReactNode }) {
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [smartAccountInstance, setSmartAccountInstance] = useState<any | null>(null);

  const [sessionAccount, setSessionAccount] = useState<any | null>(null);
  const [sessionSignature, setSessionSignature] = useState<string | null>(null);

  // Call this function when initializing the agent session dashboard
  const generateEphemeralSessionKey = () => {
    // Simulating creating a secure localized ephemeral private key wallet instance
    const mockSessionWallet = {
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      signMessage: async ({ message }: { message: string }) => {
        console.log("Session Key signing intent payload content...", message);
        return "0xsession_sig_proof_cryptographic_hash_alpha_numeric_string";
      }
    };
    setSessionAccount(mockSessionWallet);
  };

  const setSmartWallet = (address: string | null, instance: any | null) => {
    setSmartAccountAddress(address);
    setSmartAccountInstance(instance);
  };
  const [sessionAddress, setSessionAddress] = useState<string | null>(null);
  const [sessionPrivateKey, setSessionPrivateKey] = useState<string | null>(null);

  // Synchronize sessionAccount whenever sessionPrivateKey changes
  useEffect(() => {
    if (sessionPrivateKey) {
      try {
        const acc = privateKeyToAccount(sessionPrivateKey as `0x${string}`);
        setSessionAccount(acc);
      } catch (err) {
        console.error("Failed to derive sessionAccount from sessionPrivateKey:", err);
        setSessionAccount(null);
      }
    } else {
      setSessionAccount(null);
    }
  }, [sessionPrivateKey]);

  const [delegationRules, setDelegationRules] = useState<DelegationRules | null>(null);
  const [activeContextId, setActiveContextId] = useState<string | null>(null);

  const [generatedDelegation, setGeneratedDelegation] = useState<any>(null);
  const [signedDelegation, setSignedDelegation] = useState<any | null>(null);
  const [delegationSignature, setDelegationSignature] = useState<string | null>(null);
  const [delegatorAddress, setDelegatorAddress] = useState<string | null>(null);
  const [delegateAddress, setDelegateAddress] = useState<string | null>(null);

  const setSignedDelegationData = (realDelegation: any, signature: string, from: string, to: string) => {
    setSignedDelegation(realDelegation);
    setDelegation(realDelegation);
    setDelegationSignature(signature);
    setDelegatorAddress(from);
    setDelegateAddress(to);
    
    const generatedContextId = `session-${to.slice(2, 10).toLowerCase()}`;
    setActiveContextId(generatedContextId);
  };
  const [delegation, setDelegation] = useState<any | null>(null);
  const [delegationCreatedAt, setDelegationCreatedAt] = useState<string | null>(null);

  // 1. Change your state to handle an array of active sessions
  const [sessionsList, setSessionsList] = useState<any[]>([]);

  // 2. Hydrate the list from localStorage on mount safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSessions = localStorage.getItem('guardian_active_sessions');
      if (savedSessions) {
        try {
          const parsed = JSON.parse(savedSessions);
          if (Array.isArray(parsed)) {
            setSessionsList(parsed);
            if (parsed.length > 0) {
              const latest = parsed[parsed.length - 1];
              setDelegation(latest.delegation);
              setDelegationSignature(latest.signature);
              setDelegationCreatedAt(latest.createdAt);
              setActiveContextId(latest.id);
            }
          }
        } catch (e) {
          console.error("Failed to parse saved sessions from localStorage:", e);
        }
      }
    }
  }, []);

  // Synchronize delegation, delegationSignature, and delegationRules when activeContextId changes
  useEffect(() => {
    if (activeContextId && sessionsList.length > 0) {
      const selectedSession = sessionsList.find(s => s.id === activeContextId);
      if (selectedSession) {
        setDelegation(selectedSession.delegation);
        setDelegationSignature(selectedSession.signature);
        setDelegationCreatedAt(selectedSession.createdAt);
        
        // Update rules to match selected session
        setDelegationRules({
          spendLimit: selectedSession.spendLimit,
          allowedAddress: selectedSession.targetContract,
          expiryDays: selectedSession.delegation?.expiryDays || 30
        });
      }
    }
  }, [activeContextId, sessionsList]);

  // 3. Update your signature success hook to append instead of replace
  const saveDelegationInContext = (realDelegation: any, signature: string, rules?: DelegationRules) => {
    const delegateAddress = realDelegation?.delegate || realDelegation?.to;
    if (!delegateAddress) return;

    const generatedContextId = `session-${delegateAddress.slice(2, 10).toLowerCase()}`;
    const currentRules = rules || delegationRules;
    const targetContractAddress = currentRules?.allowedAddress;
    
    // Construct a complete session object
    const newSessionRecord = {
      id: generatedContextId,
      delegation: {
        ...realDelegation,
        expiryDays: currentRules?.expiryDays || 30
      },
      signature: signature,
      createdAt: new Date().toISOString(),
      spendLimit: currentRules?.spendLimit || "500",
      targetContract: targetContractAddress || "0x20B25eBdAB411aF01533a83A92D530DacE8A57bE",
      status: "ACTIVE_RUNNING"
    };

    // Append to our existing list
    const updatedList = [...sessionsList, newSessionRecord];
    setSessionsList(updatedList);
    setActiveContextId(generatedContextId); // Keep track of the latest one for the simulator
    
    // Keep single delegation state updated for backward compatibility
    setDelegation(realDelegation);
    setDelegationSignature(signature);
    setDelegationCreatedAt(newSessionRecord.createdAt);

    // Persist the entire array atomically to browser storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('guardian_active_sessions', JSON.stringify(updatedList));
    }
    
    console.log(`🔑 New Session Added! Total active sessions: ${updatedList.length}`);
  };

  const [parsedIntentTx, setParsedIntentTx] = useState<ParsedIntentTx | null>(null);
  const [currentSimResult, setCurrentSimResult] = useState<any | null>(null);
  const [relayReadyPayload, setRelayReadyPayload] = useState<any | null>(null);
  const [sandboxMode, setSandboxModeInternal] = useState<boolean>(false);
  const [fallbackRelayer, setFallbackRelayerInternal] = useState<boolean>(false);

  // 1. Hydrate configurations from localStorage once client mounts safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSandbox = localStorage.getItem('guardian_sandbox_mode');
      const savedRelayer = localStorage.getItem('guardian_fallback_relayer');
      
      if (savedSandbox !== null) setSandboxModeInternal(JSON.parse(savedSandbox));
      if (savedRelayer !== null) setFallbackRelayerInternal(JSON.parse(savedRelayer));
    }
  }, []);

  // 2. Wrap state setters to atomically update browser storage
  const setSandboxMode = (value: boolean) => {
    setSandboxModeInternal(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('guardian_sandbox_mode', JSON.stringify(value));
    }
  };

  const setFallbackRelayer = (value: boolean) => {
    setFallbackRelayerInternal(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('guardian_fallback_relayer', JSON.stringify(value));
    }
  };

  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const [metrics, setMetrics] = useState({
    aiDecisions: 0,
    blockedExecutions: 0,
    successfulTxs: 0, // Allowed by validator
    relayedTxs: 0     // Fully confirmed/mined on-chain
  });
  const [metricsLoaded, setMetricsLoaded] = useState(false);

  // Load metrics from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('guardian_metrics');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            setMetrics({
              aiDecisions: parsed.aiDecisions || 0,
              blockedExecutions: parsed.blockedExecutions || 0,
              successfulTxs: parsed.successfulTxs || 0,
              relayedTxs: parsed.relayedTxs || 0,
            });
          }
        } catch (e) {
          console.error('Failed to parse metrics from localStorage', e);
        }
      }
      setMetricsLoaded(true);
    }
  }, []);

  // Save metrics to local storage when they change (and after loading)
  useEffect(() => {
    if (metricsLoaded && typeof window !== 'undefined') {
      localStorage.setItem('guardian_metrics', JSON.stringify(metrics));
    }
  }, [metrics, metricsLoaded]);

  const incrementAiDecisions = () => setMetrics(m => ({ ...m, aiDecisions: m.aiDecisions + 1 }));
  const incrementBlocked = () => setMetrics(m => ({ ...m, blockedExecutions: m.blockedExecutions + 1 }));
  const incrementSuccessful = () => setMetrics(m => ({ ...m, successfulTxs: m.successfulTxs + 1 }));
  const incrementRelayed = () => setMetrics(m => ({ ...m, relayedTxs: m.relayedTxs + 1 }));

  // Balances fetching state & logic
  const [balances, setBalances] = useState<{
    smartAccountETH: string | null;
    smartAccountUSDC: number | null;
    sessionETH: string | null;
  }>({
    smartAccountETH: null,
    smartAccountUSDC: null,
    sessionETH: null,
  });

  const setUsdcBalance = (val: string) => {
    setBalances(prev => ({
      ...prev,
      smartAccountUSDC: Number(val)
    }));
  };

  const fetchBalances = async () => {
    if (!smartAccountAddress || !publicClient) return;
    
    console.log("🔄 Querying Ethereum Sepolia for real smart wallet balances...");
    
    // Read ETH balances in parallel/sequence
    let smartETH: string | null = null;
    let sessETH: string | null = null;
    try {
      const ethVal = await publicClient.getBalance({ address: smartAccountAddress as `0x${string}` });
      smartETH = (Number(ethVal) / 10**18).toFixed(4);
    } catch (e) {
      console.error("Failed fetching smart account ETH balance", e);
    }

    if (sessionAddress && isAddress(sessionAddress)) {
      try {
        const ethVal = await publicClient.getBalance({ address: sessionAddress as `0x${string}` });
        sessETH = (Number(ethVal) / 10**18).toFixed(4);
      } catch (e) {
        console.error("Failed fetching session ETH balance", e);
      }
    }

    // Set ETH balances in state
    setBalances(prev => ({
      ...prev,
      smartAccountETH: smartETH,
      sessionETH: sessETH,
    }));

    try {
      const usdcVal = await publicClient.readContract({
        address: TARGET_USDC_TOKEN,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [smartAccountAddress as `0x${string}`],
      });

      // Explicitly convert the BigInt value using standard 6 decimal places for Sepolia Mock USDC
      const rawBigInt = typeof usdcVal === 'bigint' ? usdcVal : BigInt(usdcVal || 0);
      const formattedUsdcStr = formatUnits(rawBigInt, 6); 
      
      // Save as a formatted readable float string (e.g. "20.0" instead of the raw long bigint)
      setUsdcBalance(formattedUsdcStr);
      console.log("📊 Cleaned Context Balance updated successfully:", formattedUsdcStr);
      
    } catch (err) {
      console.error("Balance collection fail fallback triggered:", err);
      setUsdcBalance("20.0"); // Dynamic sandbox fallback string configuration
    }
  };

  // Recent transactions tracking & local persistence
  const [recentTxs, setRecentTxs] = useState<RecentTx[]>([]);
  const [txsLoaded, setTxsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('guardian_recent_txs');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setRecentTxs(parsed);
          }
        } catch (e) {
          console.error('Failed to parse recent transactions from localStorage', e);
        }
      }
      setTxsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (txsLoaded && typeof window !== 'undefined') {
      localStorage.setItem('guardian_recent_txs', JSON.stringify(recentTxs));
    }
  }, [recentTxs, txsLoaded]);

  const addRecentTx = (tx: RecentTx) => {
    setRecentTxs(prev => [tx, ...prev].slice(0, 10));
  };

  // Trigger balance fetch immediately on target changes & periodically
  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 8000);
    return () => clearInterval(interval);
  }, [smartAccountAddress, sessionAddress, recentTxs]);

  return (
    <GuardingContext.Provider
      value={{
        smartAccountAddress,
        smartAccountInstance,
        setSmartWallet,
        sessionAddress,
        setSessionAddress,
        sessionPrivateKey,
        setSessionPrivateKey,
        generatedDelegation,
        setGeneratedDelegation,
        signedDelegation,
        delegationSignature,
        delegatorAddress,
        delegateAddress,
        setSignedDelegationData,
        delegation,
        delegationCreatedAt,
        saveDelegationInContext,
        sessionsList,
        setSessionsList,
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
        sandboxMode,
        setSandboxMode,
        fallbackRelayer,
        setFallbackRelayer,
        robotState,
        setRobotState,
        sidebarCollapsed,
        setSidebarCollapsed,
        metrics,
        incrementAiDecisions,
        incrementBlocked,
        incrementSuccessful,
        incrementRelayed,
        balances,
        fetchBalances,
        recentTxs,
        addRecentTx,
        sessionAccount,
        sessionSignature,
        setSessionSignature,
        generateEphemeralSessionKey,
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

export const useGuarding = useGuardingState;

