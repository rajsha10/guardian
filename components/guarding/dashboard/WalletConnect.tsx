'use client';

import { useState, useSyncExternalStore, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { toMetaMaskSmartAccount, Implementation } from '@metamask/smart-accounts-kit';
import { mantleSepolia } from '@/lib/chains';
import { useGuardingState } from '../GuardingContext';
import Panel from '../shared/Panel';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { 
    smartAccount, 
    setSmartAccount, 
    sessionAddress, 
    setSessionAddress, 
    setSessionPrivateKey,
    setRobotState 
  } = useGuardingState();

  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Sync robot state based on connection
  useEffect(() => {
    if (isConnected && address) {
      if (smartAccount) {
        setRobotState('listening');
      } else {
        setRobotState('idle');
      }
    } else {
      setRobotState('idle');
    }
  }, [isConnected, address, smartAccount]);

  const handleDeploySmartAccount = async () => {
    if (!address) return;

    setIsLoading(true);
    setRobotState('listening');

    try {
      const publicClient = createPublicClient({
        chain: mantleSepolia,
        transport: http('https://rpc.sepolia.mantle.xyz'),
      });

      const metaMaskSmartAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.Hybrid,
        deployParams: [address, [], [], []],
        deploySalt: '0x0000000000000000000000000000000000000000000000000000000000000420',
      });

      const sessionPrivateKey = generatePrivateKey();
      const sessionAccount = privateKeyToAccount(sessionPrivateKey);

      setSmartAccount(metaMaskSmartAccount.address);
      setSessionAddress(sessionAccount.address);
      setSessionPrivateKey(sessionPrivateKey);
      setRobotState('listening');
    } catch (error) {
      console.error('Failed to instantiate MetaMask Smart Account on Mantle:', error);
      setRobotState('warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setSmartAccount(null);
    setSessionAddress(null);
    setSessionPrivateKey(null);
    setRobotState('idle');
  };

  return (
    <Panel className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 tracking-tight text-indigo-400 font-heading">
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
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-full transition-colors text-xs font-mono border-none cursor-pointer"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-full opacity-60 text-xs font-mono"
            >
              Loading wallet...
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono relative">
            <span className="text-slate-500 block text-[9px] font-bold">ROOT SIGNER (EOA)</span>
            <span className="text-slate-300 break-all select-all block mt-0.5">{address}</span>
            <button
              onClick={handleDisconnect}
              className="absolute top-3 right-3 text-rose-400 text-[10px] hover:underline bg-transparent border-none cursor-pointer font-bold uppercase"
            >
              Disconnect
            </button>
          </div>

          {!smartAccount ? (
            <button
              onClick={handleDeploySmartAccount}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-2.5 px-4 rounded-full shadow-md transition-all disabled:opacity-50 text-xs font-mono border-none cursor-pointer"
            >
              {isLoading ? 'Computing Target Address...' : 'Generate MetaMask Smart Account'}
            </button>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-900/60 p-4 rounded-xl text-xs font-mono animate-fadeIn">
              <span className="text-emerald-400 block font-bold mb-1">
                SMART ACCOUNT INITIALIZED (ERC-4337/7710)
              </span>
              <span className="text-emerald-200 break-all select-all block">{smartAccount}</span>
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
