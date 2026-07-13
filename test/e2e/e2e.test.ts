import { AgentIdentityApi } from '../../src/modules/auth';
import { getInfo } from '../../src/modules/lending_pool/get-info';
import { getReserves } from '../../src/modules/lending_pool/get-reserves';
import { getPosition as getLendingPoolPosition } from '../../src/modules/lending_pool/get-position';
import { deposit } from '../../src/modules/lending_pool/deposit';
import { borrow } from '../../src/modules/lending_pool/borrow';
import { repay } from '../../src/modules/lending_pool/repay';
import { withdraw } from '../../src/modules/lending_pool/withdraw';
import { submit } from '../../src/modules/lending_pool/submit';
import { getPosition as getWalletPosition } from '../../src/modules/embedded_wallet/get-position';
import { createTransaction } from '../../src/modules/embedded_wallet/create-transaction';
import { approveTransaction } from '../../src/modules/embedded_wallet/approve-transaction';
import { transferAsset } from '../../src/modules/embedded_wallet/transfer';
import { runSuite, createMockHttp, expectEqual } from '../helpers';

export async function runE2ETests(): Promise<void> {
  await runSuite('E2E', [
    {
      name: 'agent workflow executes auth + discovery + wallet actions',
      run: async () => {
        const http = createMockHttp({ status: 'completed' });
        const client = { http } as any;
        const auth = new AgentIdentityApi(client);

        await auth.getClaimStatus();
        await getInfo(client);
        await getReserves(client);
        await getWalletPosition(client);
        await createTransaction(client, { params: {} });
        await approveTransaction(client, { txId: 'tx_1' });
        await transferAsset(client, {
          toAddress: 'GABC',
          tokenId: 'USDC',
          amount: '10',
        });
        
        await deposit(client, { assetId: 'USDC', amount: '100' });
        await borrow(client, { assetId: 'USDC', amount: '20' });
        await repay(client, { assetId: 'USDC', amount: '20' });
        await withdraw(client, { assetId: 'USDC', amount: '10' });
        await submit(client, {
          requests: [
            { actionType: 'DEPOSIT', assetId: 'USDC', amount: '50' },
            { actionType: 'WITHDRAW', assetId: 'USDC', amount: '10' },
          ],
        });
        await getLendingPoolPosition(client);

        expectEqual(http.getCalls.map((call) => call.url.split('/jobs/')[0]), [
          '/api/v2/agents/auth/claim/status',
          '/api/v2/lending-pool/info',
          '/api/v2/lending-pool/reserves',
          '/api/v2/embedded-wallet/agent/position',
          '/api/v2', // approveTransaction poll
          '/api/v2', // transferAsset poll
          '/api/v2', // deposit poll
          '/api/v2', // borrow poll
          '/api/v2', // repay poll
          '/api/v2', // withdraw poll
          '/api/v2', // submit poll
          '/api/v2/lending-pool/agent/position',
        ]);

        expectEqual(http.postCalls.map((call) => call.url), [
          '/api/v2/embedded-wallet/agent/transaction/create',
          '/api/v2/embedded-wallet/agent/transaction/approve',
          '/api/v2/embedded-wallet/agent/transfer',
          '/api/v2/lending-pool/agent/deposit',
          '/api/v2/lending-pool/agent/borrow',
          '/api/v2/lending-pool/agent/repay',
          '/api/v2/lending-pool/agent/withdraw',
          '/api/v2/lending-pool/agent/submit',
        ]);
      },
    },
  ]);
}
