// lib/viemClient.ts
import { createPublicClient, http } from 'viem';
import { targetChain } from './chains';

export const publicClient = createPublicClient({
  chain: targetChain,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com')
});

// A standard, minimalist ERC-20 ABI declaration containing only balance and allowance reads
export const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: 'remaining', type: 'uint256' }],
  }
] as const;