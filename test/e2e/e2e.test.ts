import { AgentIdentityApi } from '../../src/modules/auth';
import { getInfo as getLendingInfo } from '../../src/modules/lending_pool/get-info';
import { getReserves as getLendingReserves } from '../../src/modules/lending_pool/get-reserves';
import { getPosition as getWalletPosition } from '../../src/modules/embedded_wallet/get-position';
import { createTransaction } from '../../src/modules/embedded_wallet/create-transaction';
import { approveTransaction } from '../../src/modules/embedded_wallet/approve-transaction';
import { transfer } from '../../src/modules/embedded_wallet/transfer';
import { deposit } from '../../src/modules/lending_pool/deposit';
import { borrow } from '../../src/modules/lending_pool/borrow';
import { repay } from '../../src/modules/lending_pool/repay';
import { withdraw } from '../../src/modules/lending_pool/withdraw';
import { runSuite, createMockHttp, expectEqual } from '../helpers';

export async function runE2ETests(): Promise<void> {
  await runSuite('E2E', [
    {
      name: 'agent workflow executes auth + discovery + wallet actions',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;
        const auth = new AgentIdentityApi(client);

        await auth.getClaimStatus();
        await getLendingInfo(client);
        await getLendingReserves(client);
        await getWalletPosition(client);
        await createTransaction(client, { wallet_locator: 'email:a@b.com', params: {} });
        await approveTransaction(client, 'tx_1');
        await transfer(client, { asset: 'USDC', amount: '10', destination: 'GABC' });
        await deposit(client, { email: 'a@b.com', assetId: 'USDC', amount: '100' });
        await borrow(client, { email: 'a@b.com', assetId: 'USDC', amount: '20' });
        await repay(client, { email: 'a@b.com', assetId: 'USDC', amount: '20' });
        await withdraw(client, { email: 'a@b.com', assetId: 'USDC', amount: '10' });

        expectEqual(http.getCalls.map((call) => call.url), [
          '/v2/agents/auth/claim/status',
          '/v2/lending-pool/info',
          '/v2/lending-pool/reserves',
          '/v2/embedded-wallet/position',
        ]);

        expectEqual(http.postCalls.map((call) => call.url), [
          '/v2/embedded-wallet/transaction/create',
          '/v2/embedded-wallet/transaction/approve',
          '/v2/embedded-wallet/transfer',
          '/v2/lending-pool/deposit',
          '/v2/lending-pool/borrow',
          '/v2/lending-pool/repay',
          '/v2/lending-pool/withdraw',
        ]);
      },
    },
  ]);
}
