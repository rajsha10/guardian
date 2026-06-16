'use client';

// 1. External Third-Party Library Imports (Add it right here)
import { useState, useSyncExternalStore, useEffect } from 'react';
import { useWalletClient } from 'wagmi'; // <-- PLACE IT HERE
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { toMetaMaskSmartAccount, Implementation } from '@metamask/smart-accounts-kit';
import { targetChain } from '@/lib/chains';

// 2. Local Context or Design System Component Imports
import { useGuardingState } from '../GuardingContext';
import Panel from '../shared/Panel';

export default function WalletConnect() {
  // 1. Context and Hook Initializations go first
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient(); // <-- PLACE IT HERE
  
  const { 
    smartAccountAddress, 
    setSmartWallet, 
    sessionAddress, 
    setSessionAddress, 
    setSessionPrivateKey,
    setRobotState 
  } = useGuardingState();

  // 2. Local State variables below it
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Sync robot state based on connection
  useEffect(() => {
    if (isConnected && address) {
      if (smartAccountAddress) {
        setRobotState('listening');
      } else {
        setRobotState('idle');
      }
    } else {
      setRobotState('idle');
    }
  }, [isConnected, address, smartAccountAddress]);

  const handleConnectSmartAccount = async () => {
    if (!address) return;

    setIsLoading(true);
    setRobotState('listening');

    try {
      // Phase 1 / Step 3 validation enforcement
      let activeWalletClient = walletClient;
      if (!activeWalletClient && connector) {
        try {
          const provider = await connector.getProvider();
          activeWalletClient = createWalletClient({
            account: address as `0x${string}`,
            chain: targetChain,
            transport: custom(provider as any),
          }) as any;
        } catch (err) {
          console.error("Failed to get wallet client from connector:", err);
        }
      }

      if (!activeWalletClient) {
        throw new Error("Wallet client unavailable"); // <-- PLACE IT HERE
      }

      const publicClient = createPublicClient({
        chain: targetChain,
        transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'),
      });

      // Replace with the required SDK signer registration
      const metaMaskSmartAccount = await toMetaMaskSmartAccount({
        client: publicClient, // Keep your publicClient for read layers
        implementation: Implementation.Hybrid, // Ensure your target implementation is set (Hybrid is standard)
        deployParams: [activeWalletClient.account?.address || "0x...", [], [], []],
        deploySalt: '0x',
        signer: { 
          walletClient: activeWalletClient // Hooks up the active MetaMask extension client as the root signer
        },
      });

      // Step 5: Temporary Debug Line (Place right here)
      console.log(
        "Can Sign Delegation:",
        typeof metaMaskSmartAccount.signDelegation
      );

      const sessionPrivateKey = generatePrivateKey();
      const sessionAccount = privateKeyToAccount(sessionPrivateKey);

      setSmartWallet(metaMaskSmartAccount.address, metaMaskSmartAccount);
      setSessionAddress(sessionAccount.address);
      setSessionPrivateKey(sessionPrivateKey);
      setRobotState('listening');
    } catch (error) {
      console.error('Failed to instantiate MetaMask Smart Account on Ethereum Sepolia:', error);
      setRobotState('warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setSmartWallet(null, null);
    setSessionAddress(null);
    setSessionPrivateKey(null);
    setRobotState('idle');
  };

  return (
    <Panel className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 tracking-tight text-white font-heading uppercase">
        Account Initialization Hub
      </h2>

      {!isConnected ? (
        <div>
          <p className="text-slate-400 text-xs mb-4 font-sans font-medium">
            Connect your primary MetaMask Extension wallet to establish the root signer.
          </p>
          {isMounted ? (
            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  className="w-full bg-white hover:bg-white/90 text-black font-bold py-2.5 px-4 rounded-full transition-colors text-xs font-mono border-none cursor-pointer"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-white/20 text-white/50 font-medium py-2.5 px-4 rounded-full opacity-60 text-xs font-mono"
            >
              Loading wallet...
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-guardian-pearl/5 text-xs font-mono relative">
            <span className="text-slate-500 block text-[9px] font-bold">ROOT SIGNER (EOA)</span>
            <span className="text-slate-300 break-all select-all block mt-0.5">{address}</span>
            <button
              onClick={handleDisconnect}
              className="absolute top-3 right-3 text-white/60 hover:text-white text-[10px] bg-transparent border-none cursor-pointer font-bold uppercase transition-all"
            >
              Disconnect
            </button>
          </div>

          {!smartAccountAddress ? (
            <button
              onClick={handleConnectSmartAccount}
              disabled={isLoading}
              className="w-full bg-white hover:bg-white/90 text-black font-bold py-2.5 px-4 rounded-full shadow-md transition-all disabled:opacity-50 text-xs font-mono border-none cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Computing Target Address...</span>
                </span>
              ) : (
                'Generate MetaMask Smart Account'
              )}
            </button>
          ) : (
            <div className="bg-white/[0.02] border border-guardian-pearl/10 p-4 rounded-xl text-xs font-mono animate-fadeIn">
              <span className="text-white block font-bold mb-1 uppercase tracking-wider text-[10px]">
                SMART ACCOUNT INITIALIZED (ERC-4337/7710)
              </span>
              <span className="text-white/80 break-all select-all block">{smartAccountAddress}</span>
              <p className="text-slate-500 text-[9px] mt-2 italic">
                Deterministic address generated. Ready to ingest off-chain agent session keys and ERC-7715 caveats.
              </p>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
