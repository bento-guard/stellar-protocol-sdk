# Bento Stellar SDK

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./package.json)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)
[![npm](https://img.shields.io/badge/npm-@bentoguard%2Fprotocol--sdk-red)](https://www.npmjs.com/package/@bentoguard/protocol-sdk)
[![Downloads](https://img.shields.io/badge/downloads-<placeholder>-lightgrey)](https://www.npmjs.com/package/@bentoguard/protocol-sdk)

A production-ready TypeScript SDK for AI agents to authenticate, discover markets, manage wallets, and execute transactions against the Bento Stellar backend.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
- [Configuration](#configuration)
- [Usage](#usage)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [API Overview](#api-overview)
- [Examples](#examples)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Bento Stellar SDK is the agent-facing client for the Bento Stellar backend. It gives AI agents a typed way to talk to the backend without hardcoding routes or repeating request concerns in every integration.

The SDK is designed for workflows where an agent needs to check claim state, inspect wallet position, read Blend market state, and execute lending or transfer actions in a predictable sequence.

It is primarily useful for AI agents, backend services, and automation workers that need a stable, well-structured abstraction over Bento Stellar APIs.

## Features

- Agent identity and claim workflows
- Wallet position and transaction flows
- Lending pool read and execution actions
- Agent-scoped variants for backend-resolved ownership
- Transaction payload creation and approval flows
- Typed request/response contracts
- Centralized endpoint builder
- Error normalization with status code and response payload
- Clean module-based API surface
- TypeScript-first developer experience
- Test coverage split into unit, integration, and e2e

## Installation

```bash
npm install @bentoguard/protocol-sdk
```

## Requirements

- Node.js >= 18
- TypeScript >= 5
- Runtime support: Node.js
- Browser support: not officially targeted yet
- Network access to the Bento backend

## Quick Start

Why this matters: a developer should be able to install the SDK and call the first API in a few minutes.

```ts
import { BlendServiceClient, auth, lendingPool, embeddedWallet } from '@bentoguard/protocol-sdk';

async function main() {
  const client = new BlendServiceClient({
    baseURL: process.env.BENTO_BASE_URL ?? 'http://localhost:4001',
    timeoutMs: 30_000,
  });

  client.setApiKey(process.env.BENTO_AGENT_API_KEY ?? '');
  client.setAccessToken(process.env.BENTO_ACCESS_TOKEN ?? '');

  const agentApi = new auth.AgentIdentityApi(client);
  const claimStatus = await agentApi.getClaimStatus();

  console.log({
    claimStatus,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Project Structure

The SDK is organized by responsibility:

```text
src/
  constants/         # Endpoint builder, version, module names, config constants
  core/              # HTTP client and credential store
  errors/            # SDK error types and error constants
  modules/
    auth/            # Agent identity and claim flows
    lending_pool/    # Market discovery and lending actions
    embedded_wallet/ # Wallet and transaction flows
  types/             # Shared TypeScript contracts
  utils/             # Logger and re-exports
```

Why this structure: each area maps directly to a product concern, which keeps the SDK discoverable and easy to extend.

## Core Concepts

- `BlendServiceClient`: the shared HTTP client that injects headers and centralizes request behavior.
- `Session`: the active SDK state carried through credentials and access tokens.
- `Wallet`: the embedded wallet identity attached to the authenticated user or agent.
- `Pool`: the lending market domain for discovery and transaction actions.
- `Asset`: the token or market asset being used in a lending or transfer flow.
- `Transaction`: a backend-driven operation that may be prepared, approved, or broadcast.
- `Signer`: the authority that approves or broadcasts a transaction, usually managed by backend infrastructure.
- `Provider`: the embedded wallet provider implementation.
- `Network`: the target blockchain environment, currently centered on Stellar.

## Configuration

`BlendServiceClient` accepts the following options:

```ts
new BlendServiceClient({
  baseURL: 'http://localhost:4001',
  timeoutMs: 30_000,
});
```

- `baseURL`: backend base URL
- `timeoutMs`: request timeout in milliseconds
- `tokenStore`: custom credential store implementation

Environment variables:

- `BENTO_BASE_URL`
- `BENTO_AGENT_API_KEY`
- `BENTO_ACCESS_TOKEN`

Endpoint building is handled through:

```ts
buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET, 'position');
```

## Usage

### Initialize SDK

```ts
import { BlendServiceClient } from '@bentoguard/protocol-sdk';

const client = new BlendServiceClient();
```

### Login

```ts
import { auth } from '@bentoguard/protocol-sdk';

const agentApi = new auth.AgentIdentityApi(client);
const claimStatus = await agentApi.getClaimStatus();
```

### Create Wallet Draft

```ts
import { embeddedWallet } from '@bentoguard/protocol-sdk';

const result = await embeddedWallet.createTransaction(client, {
  wallet_locator: 'email:agent@example.com',
  params: {
    to: 'GABC...',
    amount: '10',
  },
});
```

### Get Balance

```ts
const position = await embeddedWallet.getPosition(client);
console.log(position);
```

### Agent Wallet Balance

```ts
const agentPosition = await embeddedWallet.getAgentPosition(client);
console.log(agentPosition);
```

### Send Transaction

```ts
await embeddedWallet.transfer(client, {
  wallet_locator: 'email:agent@example.com',
  toAddress: 'GABC...',
  tokenId: 'USDC',
  amount: '25',
});

await embeddedWallet.approveTransaction(client, {
  wallet_locator: 'email:agent@example.com',
  txId: 'tx_123',
});

await embeddedWallet.transferAgentAsset(client, {
  toAddress: 'GABC...',
  tokenId: 'USDC',
  amount: '25',
});
```

### Read Market State

```ts
import { lendingPool } from '@bentoguard/protocol-sdk';

const info = await lendingPool.getInfo(client);
const reserves = await lendingPool.getReserves(client);
```

### Retry

The SDK normalizes HTTP errors, so retry logic should live in your application layer or orchestration layer.

### Disconnect

If you use a custom credential store, clear tokens when the session is no longer valid:

```ts
client.clearCredentials();
```

## Error Handling

Why this matters: agent workflows fail for many reasons, and every failure should be explainable.

```ts
import { utils } from '@bentoguard/protocol-sdk';

try {
  await lendingPool.borrow(client, {
    email: 'agent@example.com',
    assetId: 'USDC',
    amount: '50',
  });
} catch (error) {
  if (error instanceof utils.BentoAuthError) {
    console.error('Authentication failed');
  } else if (error instanceof utils.BentoAPIError) {
    console.error('API status:', error.statusCode);
    console.error('API response:', error.response);
  } else if (error instanceof utils.BentoError) {
    console.error('SDK error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

Supported error categories:

- `BentoAuthError`
- `BentoAPIError`
- `BentoConfigError`
- `BentoError`

## Best Practices

- Do not hardcode secrets or private keys.
- Use environment variables for API keys and base URLs.
- Reuse a single `BlendServiceClient` instance per process.
- Validate input before calling transaction endpoints.
- Keep retry policies outside the SDK unless you need custom transport behavior.
- Clear credentials when the session ends or becomes invalid.

## API Overview

### Client

Shared HTTP client and credential lifecycle management.

### Auth

Agent identity and claim status operations backed by `/v2/agents/auth/*`.

### Lending Pool

Market discovery and lending actions backed by `/v2/lending-pool/*`.

### Embedded Wallet

Wallet position and transaction orchestration backed by `/v2/embedded-wallet/*`.

### Utils

Logger helpers, constants, endpoint builder, and error exports.

### Types

Shared request and response contracts for SDK consumers.

## Examples

### Simple Example

```ts
const client = new BlendServiceClient();

console.log(await lendingPool.getInfo(client));
```

### Advanced Example

```ts
const client = new BlendServiceClient({
  baseURL: process.env.BENTO_BASE_URL,
  timeoutMs: 45_000,
});

client.setApiKey(process.env.BENTO_AGENT_API_KEY ?? '');
client.setAccessToken(process.env.BENTO_ACCESS_TOKEN ?? '');

const agentApi = new auth.AgentIdentityApi(client);

const [claimStatus, markets, position] = await Promise.all([
  agentApi.getClaimStatus(),
  lendingPool.getReserves(client),
  embeddedWallet.getPosition(client),
]);

console.log({ claimStatus, markets, position });
```

### Lending

```ts
await lendingPool.deposit(client, {
  email: 'agent@example.com',
  assetId: 'USDC',
  amount: '100',
});
```

### Borrow

```ts
await lendingPool.borrow(client, {
  email: 'agent@example.com',
  assetId: 'USDC',
  amount: '25',
});
```

### Withdraw

```ts
await lendingPool.withdraw(client, {
  email: 'agent@example.com',
  assetId: 'USDC',
  amount: '10',
});
```

### Batch Transaction

```ts
await lendingPool.submit(client, {
  email: 'agent@example.com',
  requests: [
    { actionType: 'REPAY', assetId: 'USDC', amount: '25' },
    { actionType: 'WITHDRAW', assetId: 'USDC', amount: '10' },
  ],
});
```

### Agent Lending Actions

```ts
await lendingPool.getAgentPosition(client);
await lendingPool.depositForAgent(client, {
  assetId: 'USDC',
  amount: '100',
});
await lendingPool.submitForAgent(client, {
  requests: [
    { actionType: 'REPAY', assetId: 'USDC', amount: '25' },
    { actionType: 'WITHDRAW', assetId: 'USDC', amount: '10' },
  ],
});
```

## FAQ

**1. Is this SDK production ready?**  
It is structured for production use, but final readiness depends on your backend deployment and environment setup.

**2. Which network does it target?**  
The current codebase is centered on Stellar and versioned backend routes.

**3. Does it support browser usage?**  
It is primarily designed for Node.js runtimes.

**4. How does authentication work?**  
Through agent API key and access token handling managed by `BlendServiceClient`.

**5. Where do I put my API key?**  
Use environment variables or a custom token store.

**6. Can I replace the token store?**  
Yes, pass a custom `tokenStore` to `BlendServiceClient`.

**7. Does the SDK retry requests automatically?**  
Not by default. Handle retries at your application layer.

**8. How are errors represented?**  
Through standardized SDK error classes, including status code and response payload.

**9. What if my backend base URL changes?**  
Set `baseURL` or `BENTO_BASE_URL`.

**10. Where should I start reading the source?**  
Start with `src/core/blend-service-client.ts`, then the module folders.

## Troubleshooting

### Module not found

Make sure your import path matches the exported module namespace.

### RPC timeout

Increase `timeoutMs` or check backend latency and network connectivity.

### Invalid signature

Verify the authentication flow and the agent credentials being used.

### Authentication failed

Check `BENTO_AGENT_API_KEY`, access token state, and backend auth status.

### Insufficient balance

Inspect wallet position and lending pool reserves before sending the action.

### Wrong network

Ensure your backend and wallet data are targeting the same network.

### Endpoint mismatch

Use `buildEndpoint()` and the shared `Module` and `Version` constants rather than hardcoding strings.

## Changelog

Track releases through:

- Git tags
- GitHub releases
- `package.json` version

Recommended release notes location:

- `CHANGELOG.md` `<TODO>`

## Contributing

Contributions are welcome.

Suggested workflow:

1. Fork or branch from the repository.
2. Make your changes in a small, focused patch.
3. Run tests:

```bash
npm run test
```

4. Run build:

```bash
npm run build
```

5. Open a pull request with a clear description of the SDK surface you changed.

## License

MIT <TODO: confirm final license in package metadata>
