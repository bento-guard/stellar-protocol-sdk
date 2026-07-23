import { AgentIdentityApi } from '../../src/modules/auth';
import { getInfo } from '../../src/modules/lending_pool/get-info';
import { getReserves } from '../../src/modules/lending_pool/get-reserves';
import { getPosition as getLendingPoolPosition } from '../../src/modules/lending_pool/get-position';
import { deposit } from '../../src/modules/lending_pool/deposit';
import { borrow } from '../../src/modules/lending_pool/borrow';
import { repay } from '../../src/modules/lending_pool/repay';
import { withdraw } from '../../src/modules/lending_pool/withdraw';
import { submit } from '../../src/modules/lending_pool/submit';
import { getWalletBalance as getWalletPosition } from '../../src/modules/embedded_wallet/get-position';
import { createTransaction } from '../../src/modules/embedded_wallet/create-transaction';
import { approveTransaction } from '../../src/modules/embedded_wallet/approve-transaction';
import { transferAsset } from '../../src/modules/embedded_wallet/transfer';
import { createMockHttp } from '../helpers';

describe('E2E', () => {
  it('agent workflow executes auth + discovery + wallet actions', async () => {
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
      targetPubkey: 'GABC',
      assetPubkey: 'USDC',
      amount: '10',
    });
    
    await deposit(client, { assetPubkey: 'USDC', amount: '100' });
    await borrow(client, { assetPubkey: 'USDC', amount: '20' });
    await repay(client, { assetPubkey: 'USDC', amount: '20' });
    await withdraw(client, { assetPubkey: 'USDC', amount: '10' });
    await submit(client, {
      requests: [
        { actionType: 'DEPOSIT', assetPubkey: 'USDC', amount: '50' },
        { actionType: 'WITHDRAW', assetPubkey: 'USDC', amount: '10' },
      ],
    });
    await getLendingPoolPosition(client);

    expect(http.getCalls.map((call: any) => call.url.split('/jobs/')[0])).toEqual([
      '/api/v2/agents/auth/claim/status',
      '/api/v2/lending-pool/info',
      '/api/v2/lending-pool/reserves',
      '/api/v2/embedded-wallet/agent/position',
      '/api/v2/lending-pool/agent/position',
    ]);

    expect(http.postCalls.map((call: any) => call.url)).toEqual([
      '/api/v2/embedded-wallet/agent/transaction/create',
      '/api/v2/embedded-wallet/agent/transaction/approve',
      '/api/v2/embedded-wallet/agent/transfer',
      '/api/v2/lending-pool/agent/deposit',
      '/api/v2/lending-pool/agent/borrow',
      '/api/v2/lending-pool/agent/repay',
      '/api/v2/lending-pool/agent/withdraw',
      '/api/v2/lending-pool/agent/submit',
    ]);
  });
});
