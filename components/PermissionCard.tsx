// components/PermissionCard.tsx
'use client';

import { useState } from 'react';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

type PermissionConstraints = {
  targetVault: string;
  spendLimit: string;
};

type GrantedData = {
  context: string;
  sessionAddress: string;
  privateKey: string;
  constraints: PermissionConstraints;
};

interface PermissionCardProps {
  smartAccountAddress: string | null;
  onPermissionsGranted: (
    sessionAddress: string,
    sessionPrivateKey: string,
    constraints: PermissionConstraints,
  ) => void;
}

export default function PermissionCard({ smartAccountAddress, onPermissionsGranted }: PermissionCardProps) {
  const [targetVault, setTargetVault] = useState('0x3A2b...7702MockVault');
  const [spendLimit, setSpendLimit] = useState('100');
  const [isGranting, setIsGranting] = useState(false);
  const [grantedData, setGrantedData] = useState<GrantedData | null>(null);

  const handleGrantPermissions = async () => {
    if (!smartAccountAddress) return;
    setIsGranting(true);

    try {
      // 1. Generate the isolated ephemeral keypair for the AI Agent
      const ephemeralKey = generatePrivateKey();
      const sessionAccount = privateKeyToAccount(ephemeralKey);

      // 2. Format the ERC-7715 permissions request payload
      // This communicates boundaries directly to the MetaMask Smart Account backend
      const permissionsRequest = {
        signer: {
          type: 'keys',
          data: { ids: [sessionAccount.address] }
        },
        permissions: [
          {
            type: 'contract-call',
            data: {
              address: targetVault, // Restricts agent to ONLY this address
            }
          },
          {
            type: 'native-token-limit',
            data: {
              limit: spendLimit, // Native token allocation (MNT cap)
            }
          }
        ],
        expiry: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 Day session lifespans
      };

      // 3. Trigger the Smart Account Kit implementation
      // In a hackathon presentation, we mock the successful receipt of the off-chain EIP-712 session context
      console.log('Sending wallet_grantPermissions payload:', permissionsRequest);
      
      // Artificial delay to simulate user confirmation through MetaMask Extension prompt window
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockPermissionsContext = `0xperm_ctx_${sessionAccount.address.slice(2, 10)}`;

      const confirmationPayload = {
        context: mockPermissionsContext,
        sessionAddress: sessionAccount.address,
        privateKey: ephemeralKey,
        constraints: { targetVault, spendLimit }
      };

      setGrantedData(confirmationPayload);
      onPermissionsGranted(sessionAccount.address, ephemeralKey, confirmationPayload.constraints);
    } catch (error) {
      console.error('ERC-7715 Authorization process rejected:', error);
    } finally {
      setIsGranting(false);
    }
  };

  if (!smartAccountAddress) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-6 text-center text-slate-500 font-mono text-sm">
        Waiting for Smart Account initialization to release rule definitions...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 tracking-tight text-violet-400">2. ERC-7715 Permission Guard</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">ALLOWED VAULT target (WHITELIST)</label>
          <input
            type="text"
            value={targetVault}
            onChange={(e) => setTargetVault(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">MAX EXPENDITURE ALLOCATION (MNT CAP)</label>
          <div className="relative">
            <input
              type="number"
              value={spendLimit}
              onChange={(e) => setSpendLimit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-violet-500"
            />
            <span className="absolute right-3 top-2 text-xs font-bold text-slate-600 font-mono">MNT</span>
          </div>
        </div>

        {!grantedData ? (
          <button
            onClick={handleGrantPermissions}
            disabled={isGranting}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-2.5 px-4 rounded-lg shadow-md transition-all text-sm"
          >
            {isGranting ? 'Authorizing Session Context...' : 'Authorize Agent Rules via ERC-7715'}
          </button>
        ) : (
          <div className="space-y-3 animate-fadeIn">
            <div className="bg-violet-950/40 border border-violet-800 p-3 rounded-lg text-xs font-mono">
              <span className="text-violet-400 block font-bold">🔒 CRYPTOGRAPHIC SESSION ESTABLISHED</span>
              <div className="mt-1 text-slate-300 flex flex-col gap-1">
                <div><span className="text-slate-500">Context Identifier:</span> {grantedData.context}</div>
                <div><span className="text-slate-500">Delegated AI PubKey:</span> {grantedData.sessionAddress}</div>
                <div><span className="text-slate-500">Active Scope:</span> Limit {grantedData.constraints.spendLimit} MNT on target vault</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
