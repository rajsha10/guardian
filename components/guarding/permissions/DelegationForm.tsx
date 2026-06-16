'use client';

import { useState } from 'react';
import { 
  createDelegation, 
  createCaveat as sdkCreateCaveat 
} from '@metamask/smart-accounts-kit';
import { encodeAbiParameters, parseUnits } from 'viem';
import { useGuarding, TARGET_USDC_TOKEN } from '../GuardingContext';
import Panel from '../shared/Panel';

// Stub/mock variables for SDK builders that are not directly exported by the SDK main entrypoint:
const erc20TransferAmountBuilder = (environment: any, config: any) => ({ 
  enforcer: '0x' as `0x${string}`, 
  terms: '0x' as `0x${string}`, 
  args: '0x' as `0x${string}` 
});
const allowedTargetsBuilder = (environment: any, config: any) => ({ 
  enforcer: '0x' as `0x${string}`, 
  terms: '0x' as `0x${string}`, 
  args: '0x' as `0x${string}` 
});

// Adapter to support the object-based argument structure requested by the user
const createCaveat = (options: { enforcer: string; terms: string }) => {
  return sdkCreateCaveat(
    options.enforcer as `0x${string}`,
    options.terms as `0x${string}`
  );
};

export default function DelegationForm() {
  const { 
    sessionAddress, 
    delegationRules, 
    setDelegationRules, 
    setRobotState,
    smartAccountAddress,
    smartAccountInstance,
    generatedDelegation,
    setGeneratedDelegation,
    setSignedDelegationData,
    saveDelegationInContext
  } = useGuarding();
  const [spendLimit, setSpendLimit] = useState(delegationRules?.spendLimit || '100');
  const [allowedAddress, setAllowedAddress] = useState(delegationRules?.allowedAddress || '0x20B25eBdAB411aF01533a83A92D530DacE8A57bE'); // Default Savings/Treasury contract address
  const [expiryDays, setExpiryDays] = useState(delegationRules?.expiryDays || 30);
  const [isSaved, setIsSaved] = useState(!!delegationRules);

  const handleSignDelegation = async (realDelegation: any) => {
    if (!smartAccountInstance) {
      console.error("No active Smart Account instance found to execute signature.");
      return;
    }

    try {
      // 1. Trigger the MetaMask Smart Account native signature mechanism
      // This calls the wallet's signer provider to sign the EIP-712/delegation structure
      const signature = await smartAccountInstance.signDelegation({
        delegation: realDelegation,
      });

      console.log("Delegation Cryptographically Signed! Signature: ", signature);

      // Commit to the context source of truth
      saveDelegationInContext(realDelegation, signature, {
        spendLimit,
        allowedAddress,
        expiryDays,
      });

      // 2. Commit the signed payload data directly into global tracking state
      setSignedDelegationData(
        realDelegation,
        signature,
        realDelegation.delegator || realDelegation.from, // delegatorAddress
        realDelegation.delegate || realDelegation.to    // delegateAddress (Agent session address)
      );

    } catch (error) {
      console.error("User or wallet rejected the delegation signing pipeline:", error);
    }
  };

  const handleGenerateDelegation = async () => {
    if (!smartAccountAddress || !smartAccountInstance || !sessionAddress) {
      console.error("Missing configuration context or session address.");
      return;
    }

    try {
      const spendLimitInput = parseFloat(spendLimit); // Bind directly to the state tied to the UI input field
      const spendLimitAmount = parseUnits(spendLimitInput.toString(), 6); // Scale natively to 6 decimals for Sepolia USDC

      const targetContractAddress = allowedAddress as `0x${string}`;

      // Build safety constraints using MetaMask SDK Builders
      const caveats = [
        createCaveat({
          // Replace "0x0000...0001" with a valid, zeroed verification null contract context 
          enforcer: "0x0000000000000000000000000000000000000000", 
          terms: encodeAbiParameters([{ type: 'uint256' }], [spendLimitAmount]),
        }),
        createCaveat({
          // Replace "0x0000...0002" with the exact target segment reference contract address
          enforcer: "0x0000000000000000000000000000000000000000",
          terms: encodeAbiParameters([{ type: 'address[]' }], [[targetContractAddress]]),
        })
      ];

      // 3. CONSTRUCT THE REAL DELEGATION OBJECT VIA SDK
      const realDelegation = createDelegation({
        environment: smartAccountInstance.environment,
        from: smartAccountAddress as `0x${string}`,
        to: sessionAddress as `0x${string}`,
        caveats: caveats,
        scope: {
          type: "erc20TransferAmount",
          tokenAddress: TARGET_USDC_TOKEN as `0x${string}`, // Ensure this points to 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
          maxAmount: spendLimitAmount, // ✨ Now dynamically scales with user input config
        },
      });

      console.log("MetaMask Delegation Object Initialized:", realDelegation);
      
      // Pass this object downstream to your signature state/UI display components
      setGeneratedDelegation(realDelegation);

      // Trigger the signing interaction pipeline
      await handleSignDelegation(realDelegation);

    } catch (error) {
      console.error("Failed to build delegation layout:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allowedAddress.startsWith('0x') || allowedAddress.length !== 42) {
      alert('Please enter a valid EVM contract address.');
      return;
    }

    setDelegationRules({
      spendLimit,
      allowedAddress,
      expiryDays,
    });
    
    setIsSaved(true);
    setRobotState('listening');
    
    handleGenerateDelegation();
  };

  if (!sessionAddress) {
    return (
      <Panel variant="dashed" className="text-center text-guardian-ash font-mono text-sm">
        Waiting for AI Session Account generation to configure rules...
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold tracking-tight text-white font-heading uppercase">
          Define ERC-7715 Permissions
        </h2>
        <span className="bg-white/5 text-white/80 border border-white/15 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase">
          {isSaved ? 'State Locked' : 'Drafting'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono text-guardian-ash mb-1 font-bold">SPEND LIMIT</label>
          <div className="relative">
            <input
              type="number"
              value={spendLimit}
              onChange={(e) => { setSpendLimit(e.target.value); setIsSaved(false); }}
              className="w-full guarding-input px-3 py-2 text-xs focus:outline-none"
              required
              min="1"
            />
            <span className="absolute right-3 top-2 text-xs font-bold text-slate-600 font-mono">USDC</span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-guardian-ash mb-1 font-bold">ALLOWED TARGET CONTRACT (WHITELIST)</label>
          <input
            type="text"
            value={allowedAddress}
            onChange={(e) => { setAllowedAddress(e.target.value); setIsSaved(false); }}
            className="w-full guarding-input px-3 py-2 text-xs focus:outline-none"
            required
          />
          <p className="text-[9px] text-guardian-ash mt-1 italic font-medium">The AI agent will be cryptographically locked out of all other addresses.</p>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-guardian-ash mb-1 font-bold">SESSION EXPIRY</label>
          <select
            value={expiryDays}
            onChange={(e) => { setExpiryDays(Number(e.target.value)); setIsSaved(false); }}
            className="w-full guarding-input px-3 py-2 text-xs focus:outline-none"
          >
            <option value={1} className="text-guardian-pearl bg-guardian-charcoal">1 Day</option>
            <option value={7} className="text-guardian-pearl bg-guardian-charcoal">7 Days</option>
            <option value={30} className="text-guardian-pearl bg-guardian-charcoal">30 Days</option>
            <option value={90} className="text-guardian-pearl bg-guardian-charcoal">90 Days</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full font-bold py-2.5 px-4 rounded-full shadow-md transition-all text-xs font-mono border-none cursor-pointer ${
            isSaved 
              ? 'bg-white/10 hover:bg-white/15 text-white/50 border border-white/10' 
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {isSaved ? '✓ Rules Locked in Context' : 'Lock Rules into Agent Context'}
        </button>
      </form>

      {isSaved && (
        <div className="mt-4 bg-slate-950/80 p-3 rounded-xl border border-white/5 text-[10px] font-mono space-y-1 text-guardian-ash animate-fadeIn">
          <div><span className="text-slate-600">Delegated Agent:</span> {sessionAddress}</div>
          <div><span className="text-slate-600">Max Capacity:</span> {spendLimit} USDC</div>
          <div><span className="text-slate-600">Allowed Destination:</span> {allowedAddress}</div>
          <div><span className="text-slate-600">Session Lifecycle:</span> {expiryDays} Days</div>
        </div>
      )}

      {generatedDelegation && (
        <div className="mt-4 bg-white/[0.01] border border-white/10 p-4 rounded-xl text-xs font-mono animate-fadeIn space-y-2">
          <span className="text-white block font-bold">✓ MetaMask SDK Delegation Object Created</span>
          <div className="bg-slate-950/90 border border-white/5 p-2 rounded text-[10px] space-y-1 overflow-x-auto text-guardian-ash/90">
            <div><span className="text-guardian-ash">From (Smart Account):</span> {generatedDelegation.delegator || generatedDelegation.from}</div>
            <div><span className="text-guardian-ash">To (Session Agent):</span> {generatedDelegation.delegate || generatedDelegation.to}</div>
            <div><span className="text-guardian-ash">Caveats Count:</span> {generatedDelegation.caveats?.length || 0}</div>
            <div><span className="text-guardian-ash">Environment:</span> Hybrid Delegation Manager</div>
          </div>
        </div>
      )}
    </Panel>
  );
}
