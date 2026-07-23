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
import { createMockHttp } from '../helpers';

describe('Integration', () => {
  it('auth module hits agent claim endpoint', async () => {
    const http = createMockHttp();
    const client = { http } as any;
    const api = new AgentIdentityApi(client);

    await api.getClaimStatus();
    expect(http.getCalls[0]?.url).toEqual('/api/v2/agents/auth/claim/status');
  });

  it('lending pool getInfo uses versioned public endpoint helper', async () => {
    const http = createMockHttp();
    const client = { http } as any;

    await getInfo(client);
    expect(http.getCalls[0]?.url).toEqual('/api/v2/lending-pool/info');
  });

  it('lending pool getReserves uses versioned public endpoint helper', async () => {
    const http = createMockHttp();
    const client = { http } as any;

    await getReserves(client);
    expect(http.getCalls[0]?.url).toEqual('/api/v2/lending-pool/reserves');
  });

  it('agent lending pool position uses versioned agent endpoint', async () => {
    const http = createMockHttp();
    const client = { http } as any;

    await getLendingPoolPosition(client);
    expect(http.getCalls[0]?.url).toEqual('/api/v2/lending-pool/agent/position');
  });

  it('agent lending pool actions use versioned agent endpoints', async () => {
    const http = createMockHttp({ status: 'completed' });
    const client = { http } as any;

    await deposit(client, { assetPubkey: 'USDC', amount: '100' });
    await submit(client, { requests: [{ actionType: 'DEPOSIT', assetPubkey: 'USDC', amount: '100' }] });

    expect(http.postCalls.map((call: any) => call.url)).toEqual([
      '/api/v2/lending-pool/agent/deposit',
      '/api/v2/lending-pool/agent/submit',
    ]);
  });

  it('agent embedded wallet position uses versioned agent endpoint helper', async () => {
    const http = createMockHttp();
    const client = { http } as any;

    await getWalletPosition(client);
    expect(http.getCalls[0]?.url).toEqual('/api/v2/embedded-wallet/agent/position');
  });

  it('agent embedded wallet create transaction sends params without wallet locator', async () => {
    const http = createMockHttp();
    const client = { http } as any;

    await createTransaction(client, { params: { to: 'GABC', amount: '10' } });
    expect(http.postCalls[0]?.url).toEqual('/api/v2/embedded-wallet/agent/transaction/create');
    expect(http.postCalls[0]?.payload).toEqual({ params: { to: 'GABC', amount: '10' } });
  });

  it('agent embedded wallet approve transaction sends tx id without locator', async () => {
    const http = createMockHttp({ status: 'completed' });
    const client = { http } as any;

    await approveTransaction(client, { txId: 'tx_1' });
    expect(http.postCalls[0]?.url).toEqual('/api/v2/embedded-wallet/agent/transaction/approve');
    expect(http.postCalls[0]?.payload).toEqual({ txId: 'tx_1' });
  });

  it('agent embedded wallet transfer sends dto without locator', async () => {
    const http = createMockHttp({ status: 'completed' });
    const client = { http } as any;

    await transferAsset(client, {
      targetPubkey: 'GABC',
      assetPubkey: 'USDC',
      amount: '10',
    });

    expect(http.postCalls[0]?.url).toEqual('/api/v2/embedded-wallet/agent/transfer');
    expect(http.postCalls[0]?.payload).toEqual({
      targetPubkey: 'GABC',
      assetPubkey: 'USDC',
      amount: '10',
    });
  });
});
