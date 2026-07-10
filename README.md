# @bentoguard/sdk-stellar

SDK cho agent làm việc với backend Bento Stellar theo hướng clean code, tách rõ:

1. `BlendServiceClient`
2. `Auth` cho agent identities
3. `Embedded Wallet`
4. `Lending Pool` / Blend market discovery + transaction flows
5. `Utils` cho lỗi, logger, cấu hình

## Cài đặt

```bash
npm install @bentoguard/sdk-stellar
```

## Khởi tạo

```ts
import { BlendServiceClient, auth, lendingPool, embeddedWallet } from '@bentoguard/sdk-stellar';

const client = new BlendServiceClient({
  baseURL: process.env.BENTO_BASE_URL,
});
```

## Auth

```ts
const agentApi = new auth.AgentIdentityApi(client);

client.setApiKey('bento_sk_xxx');

const status = await agentApi.getClaimStatus();
```

## Market discovery

```ts
const poolApi = new lendingPool.LendingPoolApi(client);

const markets = await poolApi.discoverMarkets();
const info = await poolApi.getInfo();
const reserves = await poolApi.getReserves();
```

## Transaction flow

```ts
const walletApi = new embeddedWallet.EmbeddedWalletApi(client);

const walletPosition = await walletApi.getPosition();
const depositResult = await poolApi.deposit({
  email: 'agent@example.com',
  assetId: 'USDC',
  amount: '100',
});
```

## Error handling

```ts
import { utils } from '@bentoguard/sdk-stellar';

try {
  await poolApi.borrow({ email: 'agent@example.com', assetId: 'USDC', amount: '50' });
} catch (error) {
  if (error instanceof utils.BentoAuthError) {
    // refresh / reconfigure credentials
  }
  if (error instanceof utils.BentoAPIError) {
    // inspect error.statusCode and error.details
  }
}
```
