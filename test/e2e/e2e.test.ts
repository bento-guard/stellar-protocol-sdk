import { AgentIdentityApi } from '../../src/modules/auth';
import { getInfo as getLendingInfo, getAgentInfo as getAgentLendingInfo } from '../../src/modules/lending_pool/get-info';
import { getReserves as getLendingReserves, getAgentReserves as getAgentLendingReserves } from '../../src/modules/lending_pool/get-reserves';
import { getPosition as getWalletPosition, getAgentPosition as getAgentWalletPosition } from '../../src/modules/embedded_wallet/get-position';
import { createTransaction, createAgentTransaction } from '../../src/modules/embedded_wallet/create-transaction';
import { approveTransaction, approveAgentTransaction } from '../../src/modules/embedded_wallet/approve-transaction';
import { transfer, transferAgentAsset } from '../../src/modules/embedded_wallet/transfer';
import { deposit } from '../../src/modules/lending_pool/deposit';
import { borrow } from '../../src/modules/lending_pool/borrow';
import { repay } from '../../src/modules/lending_pool/repay';
import { withdraw } from '../../src/modules/lending_pool/withdraw';
import { depositForAgent } from '../../src/modules/lending_pool/deposit';
import { submit as submitPool } from '../../src/modules/lending_pool/submit';
import { submitForAgent as submitAgentPool } from '../../src/modules/lending_pool/agent-submit';
import { faucet as faucetPool } from '../../src/modules/lending_pool/faucet';
import { faucetForAgent as faucetAgentPool } from '../../src/modules/lending_pool/agent-faucet';
import { getAgentPosition as getAgentPoolPosition } from '../../src/modules/lending_pool/get-position';
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
        await getAgentLendingInfo(client);
        await getLendingReserves(client);
        await getAgentLendingReserves(client);
        await getWalletPosition(client);
        await getAgentWalletPosition(client);
        await createTransaction(client, { wallet_locator: 'email:a@b.com', params: {} });
        await createAgentTransaction(client, { params: {} });
        await approveTransaction(client, { wallet_locator: 'email:a@b.com', txId: 'tx_1' });
        await approveAgentTransaction(client, { txId: 'tx_2' });
        await transfer(client, {
          wallet_locator: 'email:a@b.com',
          toAddress: 'GABC',
          tokenId: 'USDC',
          amount: '10',
        });
        await transferAgentAsset(client, {
          toAddress: 'GABC',
          tokenId: 'USDC',
          amount: '10',
        });
        await deposit(client, { email: 'a@b.com', assetId: 'USDC', amount: '100' });
        await borrow(client, { email: 'a@b.com', assetId: 'USDC', amount: '20' });
        await repay(client, { email: 'a@b.com', assetId: 'USDC', amount: '20' });
        await withdraw(client, { email: 'a@b.com', assetId: 'USDC', amount: '10' });
        await depositForAgent(client, { assetId: 'USDC', amount: '100' });
        await submitPool(client, {
          email: 'a@b.com',
          requests: [
            { actionType: 'DEPOSIT', assetId: 'USDC', amount: '50' },
            { actionType: 'WITHDRAW', assetId: 'USDC', amount: '10' },
          ],
        });
        await submitAgentPool(client, {
          requests: [
            { actionType: 'REPAY', assetId: 'USDC', amount: '50' },
            { actionType: 'WITHDRAW', assetId: 'USDC', amount: '10' },
          ],
        });
        await faucetPool(client, { email: 'a@b.com' });
        await faucetAgentPool(client);
        await getAgentPoolPosition(client);

        expectEqual(http.getCalls.map((call) => call.url), [
          '/v2/agents/auth/claim/status',
          '/v2/lending-pool/info',
          '/v2/lending-pool/info',
          '/v2/lending-pool/reserves',
          '/v2/lending-pool/reserves',
          '/v2/embedded-wallet/position',
          '/v2/embedded-wallet/agent/position',
          '/v2/lending-pool/agent/position',
        ]);

        expectEqual(http.postCalls.map((call) => call.url), [
          '/v2/embedded-wallet/transaction/create',
          '/v2/embedded-wallet/transaction/approve',
          '/v2/embedded-wallet/agent/transaction/create',
          '/v2/embedded-wallet/agent/transaction/approve',
          '/v2/embedded-wallet/transfer',
          '/v2/embedded-wallet/agent/transfer',
          '/v2/lending-pool/deposit',
          '/v2/lending-pool/borrow',
          '/v2/lending-pool/repay',
          '/v2/lending-pool/withdraw',
          '/v2/lending-pool/agent/deposit',
          '/v2/lending-pool/submit',
          '/v2/lending-pool/agent/submit',
          '/v2/lending-pool/faucet',
          '/v2/lending-pool/agent/faucet',
        ]);
      },
    },
  ]);
}
