# Project Audit: DelegAI Guardian

DelegAI Guardian is a security orchestration dashboard that intercepts natural language instructions from users, compiles them into structured transaction payloads, checks them against pre-defined security rules (EIP-7715 caveats), and broadcasts them gaslessly via a paymaster relayer.

Below is a detailed analysis of what the project does, what it lacks, and what components are mock versus live.

---

## 1. Core Capabilities: What the Project Does

- **Deterministic MetaMask Smart Account Initialization**: Leverages the `@metamask/smart-accounts-kit` (SAK) to initialize a hybrid Smart Account (ERC-4337 / EIP-7702/7710) using a connected EOA signer (MetaMask).
- **Natural Language Intent Parsing**: Integrates the `@google/genai` SDK in a Next.js server route to translate unstructured user prompts into structured financial transactions.
- **Security Interception & Prompt Injection Safety**: Includes local and LLM-based parsing constraints to intercept potential prompt injection attacks or limit breaches before they are signed.
- **EIP-7715 Session-Key Generation**: Generates ephemeral agent session keys and cryptographically binds them to smart accounts with spend limitations and destination contract whitelisting.
- **Balance Reading**: Directly reads live ETH and ERC-20 balances from Ethereum Sepolia.
- **Gasless Relaying**: Hosts a Next.js API route that processes and signs transactions on-chain using a sponsor private key.

---

## 2. Live vs. Mock Implementations

Here is a breakdown of what components run live operations on the blockchain or LLM APIs versus what is simulated, hardcoded, or using presentation fallbacks.

| Functional Component | Status | Mechanism | Detailed Analysis |
| :--- | :--- | :--- | :--- |
| **User EOA Connection** | **LIVE** | Wagmi / Viem | Connects to MetaMask and queries active account addresses and network details. |
| **MetaMask Smart Account Creation** | **LIVE** | SAK SDK | Creates a deterministic Smart Account container using the `@metamask/smart-accounts-kit` SDK. |
| **Session Key Generation** | **LIVE** | Viem Accounts | Generates a real ephemeral private key via `generatePrivateKey()` and derives its address. |
| **Agent Intent Parser** | **LIVE** | Google GenAI SDK | Resolves natural language input into JSON using the Gemini native API (`gemini-2.5-flash`) at the `/api/agent` route. |
| **EIP-7715 Delegation Signing** | **LIVE** | SAK SDK | Triggers a real MetaMask signature request using `smartAccountInstance.signDelegation`. |
| **Sepolia Balance Syncing** | **LIVE** | Viem `publicClient` | Periodically queries Ethereum Sepolia for the Smart Account's ETH and mock USDC balance, as well as the Session Key's ETH balance. |
| **Gasless Paymaster Route** | **LIVE** | Ethers.js | The `/api/relay` route submits transaction payloads to Sepolia using a live sponsor private key (`RELAYER_SPONSOR_PRIVATE_KEY` in environment config). |
| **USDC Balance/Allowance Overrides** | **MOCK** | Presentation Code | If the smart account balance or allowance reads `0` on-chain, `ExecutionSimulator.tsx` force-overrides them to `1000` to guarantee a green 'ALLOWED' path for presentation/judge review. |
| **EIP-7715 Enforcers & Caveats** | **MOCK** | Static Address | Caveat enforcer addresses are stubbed to `0x0000...0001` and `0x0000...0002` since no real custom enforcer contracts are deployed. |
| **Transaction Spend Ceilings** | **MOCK** | Hardcoded | `AgentIntent.tsx` checks transaction amounts against a hardcoded limit of `500` USDC, ignoring the actual limit chosen in the user input rules. |
| **Transaction Calldata Compilation** | **MOCK** | Hardcoded Format | Calldata is built using a hardcoded template for standard ERC-20 `transfer(address,uint256)` actions, meaning it cannot build arbitrary smart contract executions. |
| **Client-side Relayer Fallback** | **MOCK** | Timeout & Mock Hash | If the `/api/relay` route fails (e.g., due to sponsor balance exhaustion), the frontend falls back to a simulated mining state and generates a mock tx hash. |
| **Developer Settings** | **MOCK** | Local State | The toggle buttons for "Local Simulator Fallback" and "Execution Sandbox Mode" in the settings page are local React states that do not affect the rest of the application. |

---

## 3. What the Project Lacks & Orchestration Gaps

### A. State Synchronization Gaps
1. **`activeContextId` is Never Populated**:
   The context value `activeContextId` is declared but never updated. This causes a bug in `app/guarding/sessions/page.tsx` where the Session badge is permanently displayed as **"No Active Session"** and the ERC-7715 context ID remains stuck on **"Awaiting signature approval"**, even after a delegation is successfully generated and signed.
2. **Unpersisted Settings**:
   The Developer Settings (sandbox mode, simulation fallback) exist only as fleeting React component states. If a user toggles them, navigating to another tab immediately discards the options because they are neither saved in the global `GuardingContext` nor persisted in `localStorage`.

### B. Functional Limitations & Hardcoding
1. **Single Token Constraint**:
   The system is locked to a single ERC-20 token address (`TARGET_USDC_TOKEN` on Sepolia: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`). The codebase assumes a fixed 6-decimal representation and hardcodes ERC-20 transfer parameters.
2. **Fixed Action Whitelist**:
   The API agent schema is strictly constrained to the `transfer` action with targets limited to `"savings"`, `"rent"`, or `"wallet"`. It lacks support for multi-call transactions, deposits, yield stakes, swaps, or arbitrary smart contract interactions.
3. **Hardcoded Spend Limits in Verification**:
   The EIP-7715 allowance boundaries check is hardcoded to `500` in the `AgentIntent` verification matrix. If a user sets their spend limit to `50` in the delegation form, a transfer of `200` will mistakenly pass the validator because it checks against the hardcoded `500` instead of the actual `delegationRules.spendLimit`.
4. **Mocked Enforcers**:
   No real enforcer logic is registered on-chain for EIP-7715 rules. The caveats rely on dummy bytecode inputs, and checks are performed client-side during simulation rather than being verified on-chain inside the smart account's execution module.

---

## 4. Summary of Code References

- **Rule Checks**: [AgentIntent.tsx:L127-L131](file:///d:/hackathon/guardian/components/guarding/simulator/AgentIntent.tsx#L127-L131)
  ```typescript
  const maxAllowedAllowance = 500; // From EIP-7715 allowance bounds
  if (structuredData.amount > maxAllowedAllowance) {
    throw new Error(`On-Chain Guardrail Breach: ...`);
  }
  ```
- **Presentation Balance/Allowance Overrides**: [ExecutionSimulator.tsx:L118-L122](file:///d:/hackathon/guardian/components/guarding/simulator/ExecutionSimulator.tsx#L118-L122)
  ```typescript
  // --- Demo Presentation Override ---
  // Force-override if balance/allowance is 0 to guarantee a successful green 'APPROVED' verdict
  if (liveBalance === 0) liveBalance = 1000;
  if (liveAllowance === 0) liveAllowance = 1000;
  ```
- **Calldata Builder**: [TransactionBuilder.tsx:L37-L40](file:///d:/hackathon/guardian/components/guarding/transactions/TransactionBuilder.tsx#L37-L40)
  ```typescript
  // Compile ERC-20 transfer calldata: transfer(address,uint256)
  const paddedAddress = target.slice(2).padStart(64, '0');
  const hexAmount = (amount * 10 ** 6).toString(16).padStart(64, '0'); 
  const encodedTransfer = `0xa9059cbb${paddedAddress}${hexAmount}`;
  ```
- **Unused `activeContextId` State**: [GuardingContext.tsx:L172](file:///d:/hackathon/guardian/components/guarding/GuardingContext.tsx#L172)
  ```typescript
  const [activeContextId, setActiveContextId] = useState<string | null>(null);
  ```
