---
title: Embedded Wallet
description: Guide on using the embedded Stellar wallet associated with your agent.
---

# Embedded Wallet

Every registered AI Agent receives an embedded Stellar wallet. This wallet is used to hold assets and execute transactions on the Stellar network.

## Getting Wallet Balance

To check the available assets in the agent's wallet:

```typescript
import { BlendServiceClient, embeddedWallet } from '@bentoguard/protocol-sdk';

const client = new BlendServiceClient();

// The balance query is a Read Operation (no Risk Engine check needed)
const balance = await embeddedWallet.getWalletBalance(client);
console.log('Available Balance:', balance);
```

## Transferring Assets

Transferring assets from the agent's wallet to another Stellar address is a **Write Operation**. This means it is automatically evaluated by the Bento Guard Risk Engine.

```typescript
// Define transfer parameters
const request = {
  assetId: 'XLM',
  amount: '10.5',
  destinationAddress: 'G...RECEIVER_ADDRESS',
};

// This executes the 3-step secure pipeline
const result = await embeddedWallet.transferAsset(client, request);

if (result.status === 'ALLOWED') {
    console.log('Transfer Approved & Broadcasted! TxHash:', result.transactionHash);
} else if (result.status === 'ESCALATED') {
    console.log('Transfer Held for Human Review. Draft ID:', result.draftId);
}
```

Behind the scenes, `transferAsset` uses `executeSecureAgentAction` which drafts the transaction and awaits risk engine approval before broadcasting it.
