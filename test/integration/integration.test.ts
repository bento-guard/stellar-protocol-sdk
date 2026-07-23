import { AgentIdentityApi } from '../../src/modules/auth';
import { getInfo } from '../../src/modules/lending_pool/get-info';
import { getReserves } from '../../src/modules/lending_pool/get-reserves';
import { getPosition as getLendingPoolPosition } from '../../src/modules/lending_pool/get-position';
import { deposit } from '../../src/modules/lending_pool/deposit';
import { submit } from '../../src/modules/lending_pool/submit';
import { getWalletBalance as getWalletPosition } from '../../src/modules/embedded_wallet/get-position';
import { createTransaction } from '../../src/modules/embedded_wallet/create-transaction';
import { approveTransaction } from '../../src/modules/embedded_wallet/approve-transaction';
import { transferAsset } from '../../src/modules/embedded_wallet/transfer';
import { runSuite, createMockHttp, expectEqual } from '../helpers';

export async function runIntegrationTests(): Promise<void> {
  await runSuite('Integration', [
    {
      name: 'auth module hits agent claim endpoint',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;
        const api = new AgentIdentityApi(client);

        await api.getClaimStatus();
        expectEqual(http.getCalls[0]?.url, '/api/v2/agents/auth/claim/status');
      },
    },
    {
      name: 'lending pool getInfo uses versioned public endpoint helper',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getInfo(client);
        expectEqual(http.getCalls[0]?.url, '/api/v2/lending-pool/info');
      },
    },
    {
      name: 'lending pool getReserves uses versioned public endpoint helper',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getReserves(client);
        expectEqual(http.getCalls[0]?.url, '/api/v2/lending-pool/reserves');
      },
    },
    {
      name: 'agent lending pool position uses versioned agent endpoint',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getLendingPoolPosition(client);
        expectEqual(http.getCalls[0]?.url, '/api/v2/lending-pool/agent/position');
      },
    },
    {
      name: 'agent lending pool actions use versioned agent endpoints (and background poll)',
      run: async () => {
        // Since these use postJobAndWait, they first POST to the action endpoint,
        // then they poll GET /api/v2/jobs/:jobId.
        const http = createMockHttp({ status: 'completed' });
        const client = { http } as any;

        await deposit(client, { assetId: 'USDC', amount: '100' });
        await submit(client, { requests: [{ actionType: 'DEPOSIT', assetId: 'USDC', amount: '100' }] });

        expectEqual(http.postCalls.map((call) => call.url), [
          '/api/v2/lending-pool/agent/deposit',
          '/api/v2/lending-pool/agent/submit',
        ]);
        
        // Ensure that jobs polling was called for both posts
        expectEqual(http.getCalls.length, 2);
        expectEqual(http.getCalls[0]?.url.startsWith('/api/v2/jobs/'), true);
        expectEqual(http.getCalls[1]?.url.startsWith('/api/v2/jobs/'), true);
      },
    },
    {
      name: 'agent embedded wallet position uses versioned agent endpoint helper',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getWalletPosition(client);
        expectEqual(http.getCalls[0]?.url, '/api/v2/embedded-wallet/agent/position');
      },
    },
    {
      name: 'agent embedded wallet create transaction sends params without wallet locator',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await createTransaction(client, { params: { to: 'GABC', amount: '10' } });
        expectEqual(http.postCalls[0]?.url, '/api/v2/embedded-wallet/agent/transaction/create');
        expectEqual(http.postCalls[0]?.payload, { params: { to: 'GABC', amount: '10' } });
      },
    },
    {
      name: 'agent embedded wallet approve transaction sends tx id without wallet locator (and background poll)',
      run: async () => {
        const http = createMockHttp({ status: 'completed' });
        const client = { http } as any;

        await approveTransaction(client, { txId: 'tx_1' });
        expectEqual(http.postCalls[0]?.url, '/api/v2/embedded-wallet/agent/transaction/approve');
        expectEqual(http.postCalls[0]?.payload, { txId: 'tx_1' });
        
        expectEqual(http.getCalls.length, 1);
        expectEqual(http.getCalls[0]?.url.startsWith('/api/v2/jobs/'), true);
      },
    },
    {
      name: 'agent embedded wallet transfer sends dto without locator (and background poll)',
      run: async () => {
        const http = createMockHttp({ status: 'completed' });
        const client = { http } as any;

        await transferAsset(client, {
          toAddress: 'GABC',
          tokenId: 'USDC',
          amount: '10',
        });

        expectEqual(http.postCalls[0]?.url, '/api/v2/embedded-wallet/agent/transfer');
        expectEqual(http.postCalls[0]?.payload, {
          toAddress: 'GABC',
          tokenId: 'USDC',
          amount: '10',
        });
        
        expectEqual(http.getCalls.length, 1);
        expectEqual(http.getCalls[0]?.url.startsWith('/api/v2/jobs/'), true);
      },
    },
  ]);
}
