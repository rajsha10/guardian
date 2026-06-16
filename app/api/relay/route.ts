// app/api/relay/route.ts
import { NextResponse } from 'next/server';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Structural enforcement checks before hitting the chain
    if (!payload.to || !payload.data || payload.chainId !== 11155111) {
      return NextResponse.json({ error: 'Invalid transaction structure or network destination.' }, { status: 400 });
    }

    console.log('⚡ 1Shot Relayer: Ingesting verified payload bytes...');
    console.log(`Targeting Contract Asset: ${payload.to}`);

    // Initialize connectivity directly to Ethereum Sepolia Testnet
    const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.ankr.com/eth_sepolia');
    
    // HACKATHON RELAYER SIGNER: 
    // In production, this private key belongs to the 1Shot gas sponsor wallet account loaded with testnet $ETH for gas fees.
    const relayerPrivateKey = process.env.RELAYER_SPONSOR_PRIVATE_KEY;
    
    if (!relayerPrivateKey) {
      throw new Error("Missing RELAYER_SPONSOR_PRIVATE_KEY in environment configuration.");
    }

    const relayerSigner = new Wallet(relayerPrivateKey, provider);

    // Formulate the exact transactions container parameters
    const txRequest = {
      to: payload.to,
      data: payload.data,
      value: payload.value || 0,
      gasLimit: 150000 // Fixed safe boundary limit for a standard ERC-20 transfer calldata block
    };

    console.log('🚀 Broadcasting transaction signature straight to Ethereum Sepolia node pool...');
    
    // Submit real, live transaction bytes to the blockchain network
    const txResponse = await relayerSigner.sendTransaction(txRequest);
    
    console.log(`🎉 Transaction Broadcast Successful! Initial Tx Hash: ${txResponse.hash}`);

    // Wait for exactly 1 block confirmation to guarantee incorporation
    const receipt = await txResponse.wait(1);

    return NextResponse.json({
      success: true,
      status: 'HASH_RECEIVED',
      transactionHash: txResponse.hash,
      blockNumber: receipt?.blockNumber
    });

  } catch (error: any) {
    console.error('🔴 Live Chain Execution Failure:', error);
    return NextResponse.json({ 
      error: 'On-chain submission failed.', 
      details: error.message || error 
    }, { status: 500 });
  }
}