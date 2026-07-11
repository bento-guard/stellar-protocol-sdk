import { AgentIdentityApi } from '../../src/modules/auth';
import { getInfo as getLendingInfo, getAgentInfo as getAgentLendingInfo } from '../../src/modules/lending_pool/get-info';
import { getReserves as getLendingReserves, getAgentReserves as getAgentLendingReserves } from '../../src/modules/lending_pool/get-reserves';
import { getPosition as getWalletPosition, getAgentPosition as getAgentWalletPosition } from '../../src/modules/embedded_wallet/get-position';
import { approveTransaction, approveAgentTransaction } from '../../src/modules/embedded_wallet/approve-transaction';
import { transfer, transferAgentAsset } from '../../src/modules/embedded_wallet/transfer';
import { createTransaction, createAgentTransaction } from '../../src/modules/embedded_wallet/create-transaction';
import { submit as submitPool } from '../../src/modules/lending_pool/submit';
import { submitForAgent as submitAgentPool } from '../../src/modules/lending_pool/agent-submit';
import { faucet as faucetPool } from '../../src/modules/lending_pool/faucet';
import { faucetForAgent as faucetAgentPool } from '../../src/modules/lending_pool/agent-faucet';
import { getAgentPosition as getAgentPoolPosition } from '../../src/modules/lending_pool/get-position';
import { depositForAgent as depositAgentPool } from '../../src/modules/lending_pool/deposit';
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
      name: 'agent lending pool getInfo uses versioned endpoint helper',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getAgentLendingInfo(client);
        expectEqual(http.getCalls[0]?.url, '/v2/lending-pool/info');
      },
    },
    {
      name: 'lending pool getReserves uses versioned endpoint helper',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getLendingReserves(client);
        expectEqual(http.getCalls[0]?.url, '/v2/lending-pool/reserves');
      },
    },
    {
      name: 'agent lending pool getReserves uses versioned endpoint helper',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getAgentLendingReserves(client);
        expectEqual(http.getCalls[0]?.url, '/v2/lending-pool/reserves');
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
      name: 'agent wallet position uses agent endpoint helper',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getAgentWalletPosition(client);
        expectEqual(http.getCalls[0]?.url, '/v2/embedded-wallet/agent/position');
      },
    },
    {
      name: 'embedded wallet create transaction sends wallet locator and params',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await createTransaction(client, { wallet_locator: 'email:a@b.com', params: { to: 'GABC', amount: '10' } });
        expectEqual(http.postCalls[0]?.url, '/v2/embedded-wallet/transaction/create');
        expectEqual(http.postCalls[0]?.payload, { wallet_locator: 'email:a@b.com', params: { to: 'GABC', amount: '10' } });
      },
    },
    {
      name: 'agent embedded wallet create transaction sends params only',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await createAgentTransaction(client, { params: { to: 'GABC', amount: '10' } });
        expectEqual(http.postCalls[0]?.url, '/v2/embedded-wallet/agent/transaction/create');
        expectEqual(http.postCalls[0]?.payload, { params: { to: 'GABC', amount: '10' } });
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
      name: 'agent embedded wallet approve transaction sends tx id only',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await approveAgentTransaction(client, { txId: 'tx_1' });
        expectEqual(http.postCalls[0]?.url, '/v2/embedded-wallet/agent/transaction/approve');
        expectEqual(http.postCalls[0]?.payload, { txId: 'tx_1' });
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
      name: 'agent embedded wallet transfer sends dto without locator',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await transferAgentAsset(client, {
          toAddress: 'GABC',
          tokenId: 'USDC',
          amount: '10',
        });

        expectEqual(http.postCalls[0]?.url, '/v2/embedded-wallet/agent/transfer');
        expectEqual(http.postCalls[0]?.payload, {
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
    {
      name: 'agent lending pool endpoints hit agent routes',
      run: async () => {
        const http = createMockHttp();
        const client = { http } as any;

        await getAgentPoolPosition(client);
        await depositAgentPool(client, { assetId: 'USDC', amount: '100' });
        await submitAgentPool(client, {
          requests: [{ actionType: 'DEPOSIT', assetId: 'USDC', amount: '100' }],
        });
        await faucetAgentPool(client);

        expectEqual(http.getCalls[0]?.url, '/v2/lending-pool/agent/position');
        expectEqual(http.postCalls.map((call) => call.url), [
          '/v2/lending-pool/agent/deposit',
          '/v2/lending-pool/agent/submit',
          '/v2/lending-pool/agent/faucet',
        ]);
      },
    },
  ]);
}
