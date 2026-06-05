'use client';

import { useState, useSyncExternalStore } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { toMetaMaskSmartAccount, Implementation } from '@metamask/smart-accounts-kit';
import { mantleSepolia } from '@/lib/chains';

interface WalletConnectProps {
  onSmartAccountCreated: (
    address: string,
    sessionAddress: string,
    sessionPrivateKey: string,
  ) => void;
}

export default function WalletConnect({ onSmartAccountCreated }: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const handleDeploySmartAccount = async () => {
    if (!address) return;

    setIsLoading(true);

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

      setSmartAccountAddress(metaMaskSmartAccount.address);
      onSmartAccountCreated(
        metaMaskSmartAccount.address,
        sessionAccount.address,
        sessionPrivateKey,
      );
    } catch (error) {
      console.error('Failed to instantiate MetaMask Smart Account on Mantle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 tracking-tight text-indigo-400">Account Initialization Hub</h2>

      {!isConnected ? (
        <div>
          <p className="text-slate-400 text-sm mb-4">
            Connect your primary MetaMask Extension wallet to establish the root signer.
          </p>
          {isMounted ? (
            connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Connect {connector.name}
              </button>
            ))
          ) : (
            <button
              disabled
              className="w-full bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg opacity-60"
            >
              Loading wallet...
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono relative">
            <span className="text-slate-500 block text-[10px]">ROOT SIGNER (EOA)</span>
            <span className="text-slate-300 break-all">{address}</span>
            <button
              onClick={() => disconnect()}
              className="absolute top-3 right-3 text-rose-400 text-[11px] hover:underline"
            >
              Disconnect
            </button>
          </div>

          {!smartAccountAddress ? (
            <button
              onClick={handleDeploySmartAccount}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-2.5 px-4 rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Computing Target Address...' : 'Generate MetaMask Smart Account'}
            </button>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-800 p-4 rounded-lg text-xs font-mono animate-fadeIn">
              <span className="text-emerald-400 block font-bold mb-1">
                SMART ACCOUNT INITIALIZED (ERC-4337/7710)
              </span>
              <span className="text-emerald-200 break-all select-all">{smartAccountAddress}</span>
              <p className="text-slate-500 text-[10px] mt-2 italic">
                Deterministic address generated. Ready to ingest off-chain agent session keys and ERC-7715 caveats.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
