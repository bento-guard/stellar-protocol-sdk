import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildEndpoint, Module, Version } from '../../src/constants';
import { BentoAPIError, BentoErrorStatusCode } from '../../src/errors';
import { FileTokenStore } from '../../src/core/auth-store';
import { runSuite, expectEqual } from '../helpers';

export async function runUnitTests(): Promise<void> {
  await runSuite('Unit', [
    {
      name: 'buildEndpoint composes version/module/path cleanly',
      run: () => {
        expectEqual(
          buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET, 'position'),
          '/api/v2/embedded-wallet/position',
        );
      },
    },
    {
      name: 'BentoAPIError stores status code and response',
      run: () => {
        const response = { message: 'bad request', statusCode: 400 };
        const error = new BentoAPIError('failed', BentoErrorStatusCode.BAD_REQUEST, response);
        expectEqual(error.statusCode, BentoErrorStatusCode.BAD_REQUEST);
        expectEqual(error.response, response);
        assert.equal(error.message, 'failed');
      },
    },
    {
      name: 'FileTokenStore persists and clears credentials',
      run: () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bento-sdk-'));
        const cwd = process.cwd();
        process.chdir(tempDir);

        try {
          const store = new FileTokenStore('.bento-credentials');
          store.save({
            agentId: 'agent_123',
            apiKey: 'bento_sk_test',
          });

          const loaded = store.load();
          expectEqual(loaded, {
            agentId: 'agent_123',
            apiKey: 'bento_sk_test',
          });

          store.clear();
          expectEqual(fs.existsSync(path.join(tempDir, '.bento-credentials')), false);
        } finally {
          process.chdir(cwd);
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      },
    },
  ]);
}
