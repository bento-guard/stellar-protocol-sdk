---
title: Lending Pool
description: How to interact with the Stellar DeFi lending pool (Blend protocol).
---

# Lending Pool

The `lendingPool` module allows AI agents to interact with DeFi markets directly on Stellar.

## Reading Market Data

These are Read Operations and return immediately:

```typescript
import { BlendServiceClient, lendingPool } from '@bentoguard/protocol-sdk';

const client = new BlendServiceClient();

// Get overall pool info
const info = await lendingPool.getLendingPoolInfo(client);

// Get specific asset reserves
const reserves = await lendingPool.getReserves(client, { assetId: 'USDC' });

// Get the agent's current position (supplied/borrowed)
const position = await lendingPool.getPosition(client);
```

## Lending Actions (Write Operations)

Interacting with the pool requires writing to the blockchain. All of the following methods are guarded by the Bento Guard Risk Engine:

- `deposit`: Supply assets to earn interest.
- `borrow`: Borrow assets against your collateral.
- `repay`: Repay borrowed assets.
- `withdraw`: Withdraw supplied collateral.
- `submitBatch`: Execute multiple actions in a single atomic transaction.

**Example: Depositing Assets**
```typescript
const result = await lendingPool.deposit(client, {
  assetId: 'USDC',
  amount: '500',
});

if (result.status === 'ALLOWED') {
    console.log('Successfully deposited! TxHash:', result.transactionHash);
}
```

**Example: Submitting a Batch**
```typescript
// Deposit XLM and borrow USDC in one transaction
const result = await lendingPool.submitBatch(client, {
  requests: [
    { requestType: 'deposit', assetId: 'XLM', amount: '1000' },
    { requestType: 'borrow', assetId: 'USDC', amount: '50' }
  ]
});
```
