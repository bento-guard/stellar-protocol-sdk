---
title: Embedded Wallet API
description: Reference documentation for the Embedded Wallet module.
---

# Embedded Wallet API

```typescript
import { embeddedWallet } from '@bentoguard/protocol-sdk';
```

### `getWalletBalance(client)`

Queries the current token balance of the Agent's wallet.

**Parameters:**
- `client` (BlendServiceClient): The configured API client.

**Returns:**
- An array of asset objects containing `assetId` and `amount`.

### `transferAsset(client, request)`

Initiates a secure transfer of assets to another Stellar address. This is a **Write Operation** and is guarded by Bento Guard.

**Parameters:**
- `client` (BlendServiceClient): The configured API client.
- `request.assetId` (string): The asset ticker (e.g. `XLM`, `USDC`).
- `request.amount` (string): The amount to transfer.
- `request.destinationAddress` (string): The Stellar public key of the recipient.

**Returns `SecureActionResponse`:**
- `{ status: 'ALLOWED', transactionHash: string }`
- `{ status: 'ESCALATED', draftId: string }`
