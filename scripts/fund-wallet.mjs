import { createWalletClient, createPublicClient, http, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains'; // Change to arbitrumSepolia if needed
import fs from 'fs';
import path from 'path';

// Programmatic .env.local loader to support direct `node scripts/fund-wallet.mjs` executions
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2] ? match[2].trim() : '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    }
  }
} catch (err) {
  // Silent fallback
}

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
const USDC_CONTRACT = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; 
const TARGET_WALLET = "0x55Dc27721cCcbAe0195F1F4156C3aE85a8461968"; // Your Smart Account wallet address

async function main() {
  const rawPrivateKey = process.env.PRIVATE_KEY || process.env.RELAYER_SPONSOR_PRIVATE_KEY;
  if (!rawPrivateKey || rawPrivateKey === "0x...") {
    console.error("❌ Error: Please define PRIVATE_KEY or RELAYER_SPONSOR_PRIVATE_KEY in your .env.local file.");
    process.exitCode = 1;
    return;
  }

  const formattedPrivateKey = rawPrivateKey.startsWith('0x') ? rawPrivateKey : `0x${rawPrivateKey}`;
  const account = privateKeyToAccount(formattedPrivateKey);

  const publicClient = createPublicClient({ chain: sepolia, transport: http(RPC_ENDPOINT) });
  const walletClient = createWalletClient({ account, chain: sepolia, transport: http(RPC_ENDPOINT) });

  const usdcAbi = [
    { "inputs": [{ "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
  ];

  try {
    const hash = await walletClient.writeContract({
      address: USDC_CONTRACT,
      abi: usdcAbi,
      functionName: 'mint',
      args: [TARGET_WALLET, parseUnits("1000", 6)]
    });
    console.log(`🚀 Transaction broadcast on network: ${hash}`);
    await publicClient.waitForTransactionReceipt({ hash });
    console.log("✅ Smart Account liquidity successfully established!");
  } catch (error) {
    if (error.message && error.message.includes("insufficient funds")) {
      console.error("❌ Error: Sponsor account has insufficient funds to pay for gas.");
      console.error(`Please fund EOA address ${account.address} with Sepolia ETH before running this script.`);
    } else if (error.message && error.message.includes("caller is not a minter")) {
      console.error("❌ Error: Caller is not an authorized minter on this USDC contract.");
      console.error(`Note: The contract ${USDC_CONTRACT} is the official Circle USDC mock contract on Sepolia, which does not allow public permissionless minting.`);
      console.error(`👉 To get Sepolia USDC, please request it from the official Circle Faucet at:`);
      console.error(`   https://faucet.circle.com/`);
      console.error(`👉 Alternatively, if you want to use this script to mint mock tokens, deploy your own custom Mock ERC-20 contract and update the USDC_CONTRACT address in your configuration.`);
    } else {
      console.error("❌ Error executing transaction:", error.message || error);
    }
    process.exitCode = 1;
  }
}

main();