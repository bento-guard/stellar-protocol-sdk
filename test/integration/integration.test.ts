import { AgentIdentityApi } from '../../src/modules/auth';
import { getInfo as getLendingInfo } from '../../src/modules/lending_pool/get-info';
import { getPosition as getWalletPosition } from '../../src/modules/embedded_wallet/get-position';
import { approveTransaction } from '../../src/modules/embedded_wallet/approve-transaction';
import { transfer } from '../../src/modules/embedded_wallet/transfer';
import { submit as submitPool } from '../../src/modules/lending_pool/submit';
import { faucet as faucetPool } from '../../src/modules/lending_pool/faucet';
import { runSuite, createMockHttp, expectEqual } from '../helpers';

export async function runIntegrationTests(): Promise<void> {
  await runSuite('Integration', [
    {
      name: 'auth module hits agent identity endpoints',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;
        const api = new AgentIdentityApi(client);

        await api.getMyAgents();
        expectEqual(http.getCalls[0]?.url, '/v2/agents/auth/me');
      },
    },
    {
      name: 'lending pool getInfo uses versioned endpoint helper',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getLendingInfo(client);
        expectEqual(http.getCalls[0]?.url, '/v2/lending-pool/info');
      },
    },
    {
      name: 'embedded wallet position uses versioned endpoint helper',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getWalletPosition(client);
        expectEqual(http.getCalls[0]?.url, '/v2/embedded-wallet/position');
      },
    },
    {
      name: 'embedded wallet approve transaction sends wallet locator and tx id',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await approveTransaction(client, { wallet_locator: 'email:a@b.com', txId: 'tx_1' });
        expectEqual(http.postCalls[0]?.url, '/v2/embedded-wallet/transaction/approve');
        expectEqual(http.postCalls[0]?.payload, { wallet_locator: 'email:a@b.com', txId: 'tx_1' });
      },
    },
    {
      name: 'embedded wallet transfer sends backend dto shape',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await transfer(client, {
          wallet_locator: 'email:a@b.com',
          toAddress: 'GABC',
          tokenId: 'USDC',
          amount: '10',
        });

        expectEqual(http.postCalls[0]?.url, '/v2/embedded-wallet/transfer');
        expectEqual(http.postCalls[0]?.payload, {
          wallet_locator: 'email:a@b.com',
          toAddress: 'GABC',
          tokenId: 'USDC',
          amount: '10',
        });
      },
    },
    {
      name: 'lending pool submit and faucet hit versioned endpoints',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await submitPool(client, {
          email: 'a@b.com',
          requests: [{ actionType: 'DEPOSIT', assetId: 'USDC', amount: '100' }],
        });
        await faucetPool(client, { email: 'a@b.com' });

        expectEqual(http.postCalls.map((call) => call.url), [
          '/v2/lending-pool/submit',
          '/v2/lending-pool/faucet',
        ]);
      },
    },
  ]);
}
