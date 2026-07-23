---
title: Lending Pool API
description: Reference documentation for the DeFi Lending Pool module.
---

# Lending Pool API

```typescript
import { lendingPool } from '@bentoguard/protocol-sdk';
```

## Read Operations (Data Fetching)

### `getLendingPoolInfo(client)`
Fetches global parameters of the lending pool.
- **Returns:** Global reserve metrics.

### `getReserves(client, request)`
Fetches the current interest rates, total supplied, and total borrowed for a specific asset.
- **Parameters:** `request.assetId` (string).

### `getPosition(client)`
Fetches the Agent's current DeFi position (collateral supplied and assets borrowed).
- **Returns:** `{ supplies: [...], borrows: [...] }`

## Write Operations (Secured by Bento Guard)

All these functions return the `SecureActionResponse` indicating whether the action was `ALLOWED` or `ESCALATED`.

### `deposit(client, request)`
Supplies an asset to the lending pool to earn yield and use as collateral.
- `request.assetId`: Asset ticker.
- `request.amount`: Amount to deposit.

### `borrow(client, request)`
Borrows an asset against the agent's deposited collateral.
- `request.assetId`: Asset ticker to borrow.
- `request.amount`: Amount to borrow.

### `repay(client, request)`
Repays a borrowed asset.
- `request.assetId`: Asset ticker to repay.
- `request.amount`: Amount to repay.

### `withdraw(client, request)`
Withdraws supplied collateral from the pool.
- `request.assetId`: Asset ticker to withdraw.
- `request.amount`: Amount to withdraw.

### `submitBatch(client, request)`
Executes multiple lending actions atomically.
- `request.requests`: An array of objects, where each object has a `requestType` (`'deposit' | 'borrow' | 'repay' | 'withdraw'`), `assetId`, and `amount`.
