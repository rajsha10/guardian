# Deployed link
## https://guardian-sable.vercel.app

# Demo video do check
## https://youtu.be/_jiIpkNUsmk
- **Something went wrong with HAckquest demo video not loading.. so check from here!**

# Guardian: AI Autonomy Without Custody

## The Problem
AI agents are rapidly evolving from assistants into autonomous economic actors capable of making payments, managing subscriptions, interacting with DeFi protocols, and executing transactions on behalf of users.

However, there is a fundamental problem: **Current AI agents require trust.**

To perform useful financial actions, users must often grant broad wallet permissions or expose private signing authority. This creates significant risks:
- **Prompt injection attacks** can manipulate agents into executing harmful transactions.
- **AI hallucinations** can trigger unintended transfers.
- **Malicious plugins or compromised agents** can drain funds.
- **Lack of visibility and control** over what their AI is allowed to do.
- **No granular, enforceable spending boundaries** exist in traditional automation systems.

Today, users face an impossible trade-off: **Give AI enough authority to be useful, or keep control and lose automation.** There is no secure middle ground.

---

## Our Solution
**AI Autonomy Without Custody**

Guardian introduces a new paradigm: allowing users to delegate limited financial authority to AI agents while maintaining full ownership and control of their assets.
- Instead of granting unrestricted wallet access, users create permission-bound agent sessions using **MetaMask Smart Accounts** and **ERC-7715 delegation rules**.
- Every action proposed by an AI agent must pass through **Guardian's security engine** before execution.

Guardian transforms financial automation from:
> **"Trust the Agent"**

Into:
> **"Trust the Rules"**

---

## How Guardian Works

### 1. Smart Account Initialization
The user connects their MetaMask wallet. Guardian creates a MetaMask Smart Account that acts as the secure execution layer for all future delegated actions. This Smart Account becomes the controlled environment through which AI-generated transactions are evaluated and executed.

### 2. Delegated Agent Authority
The user creates a dedicated AI session with explicit constraints:
- Maximum spending limits
- Approved destination addresses
- Session expiration periods
- Allowed transaction types
- Risk boundaries

These permissions form a delegation framework that defines exactly what an AI agent can and cannot do.

### 3. Venice AI Intent Understanding
Users interact naturally. For example:
- *"Pay my rent"*
- *"Move 50 USDC to savings"*
- *"Allocate funds to my emergency reserve"*
- *"Transfer money to my approved wallet"*

Venice AI converts these human instructions into structured financial intents. Instead of executing immediately, the intent is forwarded to Guardian's security layer.

### 4. Guardian Validation Engine
Every AI-generated transaction is inspected before execution. Guardian validates:
- Spending limits
- Destination restrictions
- Session validity
- Delegation scope
- Asset permissions
- Execution boundaries

If any rule is violated, execution is immediately rejected. No transaction reaches the blockchain unless it satisfies all delegated constraints.

### 5. Gasless Execution
Once verified, Guardian generates the transaction payload and executes it through the **1Shot Permissionless Relayer**. This allows users to benefit from seamless, gasless transaction experiences while maintaining strict security controls.

---

## Current Demo
The current Guardian demonstration showcases a complete secure AI-agent workflow.

### Demo Scenario 1 - Approved Execution
- **User Prompt:** *"Pay 50 USDC for rent"*
- **Flow:**
  1. Venice AI interprets the request.
  2. Guardian converts the instruction into a structured execution intent.
  3. Delegation constraints are loaded.
  4. Spending limits are verified.
  5. Destination checks pass.
  6. Session permissions are confirmed.
  7. Transaction is approved.
  8. Execution is relayed through 1Shot.
- **Outcome:** **`✅ Transaction Approved`** (This demonstrates secure autonomous execution under user-defined constraints).

### Demo Scenario 2 - Overspending Attack
- **User Prompt:** *"Send 5000 USDC"*
- **Flow:**
  1. Venice AI generates intent.
  2. Guardian evaluates transaction amount.
  3. Requested amount exceeds delegated spending limit.
  4. Validation engine blocks execution.
- **Outcome:** **`❌ Transaction Rejected`** (This demonstrates protection against excessive spending).

### Demo Scenario 3 - Unauthorized Destination
- **User Prompt:** *"Send funds to an unknown wallet"*
- **Flow:**
  1. Venice AI generates transaction intent.
  2. Guardian checks destination whitelist.
  3. Destination fails authorization rules.
  4. Execution is blocked.
- **Outcome:** **`❌ Transaction Rejected`** (This demonstrates protection against wallet-draining attacks).

---

## Why Guardian Matters
Guardian solves one of the most important problems in the future of autonomous finance:
**How do we safely give AI agents financial authority?**

Most solutions focus on making AI agents more powerful. Guardian focuses on making them safer. By introducing permissioned autonomy, Guardian enables:
- Safer AI-powered payments
- Secure financial automation
- Controlled spending authority
- Reduced trust assumptions
- Better protection against prompt injection attacks
- User-controlled agent ecosystems

Guardian provides the missing trust layer required for widespread adoption of autonomous AI agents in finance.

---

## Future Vision
The current demo validates the core concept of permissioned AI execution. Our long-term vision is to evolve Guardian into a universal security layer for autonomous economic agents.

Future capabilities include:
- **Autonomous Budget Agents:** AI agents that manage recurring payments, subscriptions, and savings while operating within user-defined budgets.
- **DeFi Execution Agents:** Permissioned agents capable of staking, swapping, yield farming, and liquidity management without unrestricted wallet access.
- **Agent-to-Agent Coordination:** Multiple specialized AI agents collaborating securely under shared delegation frameworks.
- **Dynamic Risk Management:** Real-time monitoring and adjustment of permissions based on transaction behavior and risk scoring.
- **On-Chain Caveat Enforcement:** Deployment of advanced smart contract caveat systems that cryptographically enforce delegation rules directly on-chain.
- **Cross-Chain Agent Infrastructure:** Permissioned AI execution across multiple blockchain ecosystems using a unified delegation framework.

### Vision Statement
> Guardian is building the security and permission layer for the next generation of autonomous financial agents. As AI becomes increasingly capable of managing money, assets, and financial decisions, users should not be forced to choose between automation and security. Guardian ensures they can have both.
>
> **AI Autonomy Without Custody.**

---

## Progress During Hackathon

### Day 1-3: Research, Planning & Core Architecture
- Identified the growing security risks associated with autonomous AI agents managing financial transactions.
- Designed the core concept of Guardian, a permissioned AI execution layer that enables AI autonomy without sacrificing wallet security.
- Defined the end-to-end architecture combining MetaMask Smart Accounts, ERC-7715 delegated permissions, Venice AI, and 1Shot relayers.
- Planned the security model centered around delegated authority, session-based permissions, and transaction validation.
- Established the user journey from natural language intent to secure on-chain execution.

### Day 3-4: Smart Accounts & Delegation Framework
- Integrated MetaMask wallet connectivity using Wagmi and Viem.
- Implemented deterministic Smart Account generation through MetaMask Smart Accounts Kit.
- Built delegated agent session creation using ephemeral session keys.
- Developed the permission management interface allowing users to define spending limits, approved destinations, session duration, and agent authorization scope.
- Implemented cryptographic delegation workflows aligned with ERC-7715 concepts.

### Day 4-7: AI Layer, Validation Engine & Security Infrastructure
- Integrated Venice AI to transform natural language instructions into structured financial intents.
- Built Guardian's validation engine to verify all AI-generated actions before execution.
- Implemented spending limit enforcement, destination authorization checks, session validity verification, and delegation rule validation.
- Developed simulation and security testing workflows to demonstrate both approved and blocked execution paths.
- Created multiple attack scenarios to validate protection against unauthorized actions and excessive spending.

### Day 7-8: Transaction Execution & Gasless Relaying
- Built the transaction construction layer responsible for generating blockchain-ready execution payloads.
- Integrated the 1Shot Permissionless Relayer to support gasless transaction execution.
- Connected AI outputs, delegation rules, validation results, and transaction generation into a complete execution pipeline.
- Added transaction lifecycle tracking, execution status monitoring, and relay state visualization.
- Implemented fallback mechanisms to ensure reliable operation during infrastructure failures.

### Day 8-10: Security Hardening, Testing & Demo Experience
- Refined delegation signing and verification workflows using Smart Account capabilities.
- Added live balance synchronization and account monitoring features.
- Performed extensive end-to-end testing across AI parsing, delegation validation, transaction generation, and execution flows.
- Improved user experience by visualizing delegation relationships, trust boundaries, permission constraints, and execution pipelines.
- Developed demonstration scenarios showcasing successful AI-assisted transactions, overspending prevention, unauthorized destination blocking, and delegated authority enforcement.
- Finalized the Guardian prototype and prepared the project for hackathon submission.

---

## Final Outcome
Over 10 days, Guardian evolved from an idea into a working prototype demonstrating how autonomous AI agents can safely interact with on-chain assets through delegated permissions, cryptographic guardrails, and gasless execution.

Guardian proves that the future of AI-powered finance does not require blind trust in agents. Instead, users can define explicit rules, delegate limited authority, and maintain control while benefiting from intelligent automation.

**Guardian - AI Autonomy Without Custody.**
