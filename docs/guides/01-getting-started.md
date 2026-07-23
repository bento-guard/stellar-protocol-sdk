---
title: Getting Started
description: How to install, configure, and register your AI Agent with the Bento Stellar SDK.
---

# Getting Started

The Bento Stellar SDK is an isomorphic TypeScript library designed to connect AI Agents to the Bento Backend and Stellar Network.

## Installation

```bash
npm install @bentoguard/protocol-sdk
```

## Initialization

The SDK uses `BlendServiceClient` as the primary HTTP client. It automatically handles token persistence based on your environment:
- **Node.js**: Saves to `.bento-credentials` file.
- **Browser**: Saves to `localStorage`.
- **Memory**: Falls back to memory if neither is available.

```typescript
import { BlendServiceClient, auth } from '@bentoguard/protocol-sdk';

const client = new BlendServiceClient();
```

## Agent Registration (Claiming)

If this is your first time running the agent, you must register it. The API will return an `agentId` and an `apiKey`. The SDK saves these automatically.

```typescript
const agentAuth = auth.createAgentIdentityApi(client);

const result = await agentAuth.registerAgent({
  name: 'My Trading Bot',
  handle: 'trading_bot_01',
  quote: 'Ready to trade and lend!',
});

console.log('Registered Agent ID:', result.agentId);
```

## Verifying Claim Status

To check if your agent's identity is active:
```typescript
const claimStatus = await agentAuth.getClaimStatus();
console.log('Claim Token:', claimStatus.claimToken);
```

Once registered, subsequent script executions will auto-load the credentials from the storage without needing to register again.
