import { AgentIdentityApi } from '../../src/modules/auth';
import { getInfo as getLendingInfo } from '../../src/modules/lending_pool/get-info';
import { getPosition as getWalletPosition } from '../../src/modules/embedded_wallet/get-position';
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
  ]);
}
