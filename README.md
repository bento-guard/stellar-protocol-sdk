# @bentoguard/sdk-stellar

Bento Stellar SDK provides a modular, fully-typed interface for AI Agents to interact with the Bento V2 Backend on the Stellar network. The SDK enables autonomous agents to manage embedded wallets, execute secure transactions, and interact with the Blend Protocol seamlessly.

## Installation

Install the package via npm:

```bash
npm install @bentoguard/sdk-stellar
```

## Initialization

The SDK requires valid authentication credentials to interact with the Bento Backend. By default, the SDK looks for a `.bento-credentials` file in the current working directory, or falls back to the user's home directory.

Create a `.bento-credentials` JSON file with the following structure:

```json
{
  "agent_api_key": "your_agent_api_key_here",
  "jwt_token": "your_initial_jwt_token_here"
}
```

The SDK utilizes an Axios Interceptor to automatically manage the session lifecycle. Upon encountering a `401 Unauthorized` response, it will autonomously invoke the Authentication module to exchange the `agent_api_key` for a fresh `jwt_token`, persist the new token to the `.bento-credentials` file, and seamlessly retry the failed request.

## Usage

### Client Instantiation

```typescript
import { BentoStellarClient } from '@bentoguard/sdk-stellar';

// Initializes the client. 
// Uses process.env.BENTO_BASE_URL if set, otherwise defaults to http://localhost:3000/api
const client = new BentoStellarClient();
```

### Embedded Wallet Module

The Embedded Wallet module allows agents to retrieve their on-chain positions and execute transactions.

```typescript
import { BentoStellarClient, embeddedWallet } from '@bentoguard/sdk-stellar';

async function manageWallet() {
  const client = new BentoStellarClient();

  // Retrieve current wallet position and balances
  const position = await embeddedWallet.getPosition(client);
  console.log('Wallet Address:', position.address);

  // Execute a standard transfer
  const transferResult = await embeddedWallet.transfer(client, {
    asset: 'USDC',
    amount: '100.50',
    destination: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  });
}
```

### Lending Pool Module (Blend Protocol)

The Lending Pool module provides the necessary interfaces to interact with the Blend Protocol for decentralized lending and borrowing operations.

```typescript
import { BentoStellarClient, lendingPool } from '@bentoguard/sdk-stellar';

async function executeDeFiStrategy() {
  const client = new BentoStellarClient();
  const agentId = 'agent_identifier';

  // Retrieve current pool reserves
  const reserves = await lendingPool.getReserves(client);

  // Deposit assets into the pool
  const depositResponse = await lendingPool.deposit(client, {
    agentId,
    asset: 'XLM',
    amount: '5000'
  });

  // Borrow assets against collateral
  const borrowResponse = await lendingPool.borrow(client, {
    agentId,
    asset: 'USDC',
    amount: '1000'
  });

  // Repay debt (supports "max" string representation for full repayment)
  const repayResponse = await lendingPool.repay(client, {
    agentId,
    asset: 'USDC',
    amount: 'max'
  });
}
```

## Error Handling

The SDK exposes specific error classes for robust exception handling.

```typescript
import { BentoStellarClient, embeddedWallet, utils } from '@bentoguard/sdk-stellar';

async function safeTransfer() {
  const client = new BentoStellarClient();

  try {
    await embeddedWallet.transfer(client, {
      asset: 'XLM',
      amount: '100',
      destination: 'GABC...'
    });
  } catch (error) {
    if (error instanceof utils.BentoAuthError) {
      utils.logger.error('Authentication failure: Please verify your API Key.');
    } else if (error instanceof utils.BentoAPIError) {
      utils.logger.error(`API Error (${error.statusCode}): ${error.message}`);
    } else if (error instanceof utils.BentoError) {
      utils.logger.error(`SDK Initialization Error: ${error.message}`);
    } else {
      utils.logger.error('An unexpected error occurred.', error);
    }
  }
}
```

## Architecture Notes

- **Stateless Execution**: API functions are stateless and rely on the `BentoStellarClient` to inject context and headers.
- **Modularity**: The SDK is strictly separated into namespaces (`auth`, `embeddedWallet`, `lendingPool`, `utils`) to prevent naming collisions and improve tree-shaking capabilities.
- **Server Signer Automation**: Transaction signing is handled entirely by the backend orchestrator via Crossmint Server Signers, abstracting cryptographic complexities away from the AI Agent environment.
