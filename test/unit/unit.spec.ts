import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildEndpoint, Module, Version } from '../../src/constants';
import { BentoAPIError, BentoErrorStatusCode } from '../../src/errors';
import { FileTokenStore } from '../../src/core/auth-store';

describe('Unit', () => {
  it('buildEndpoint composes version/module/path cleanly', () => {
    expect(
      buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET, 'position')
    ).toEqual('/api/v2/embedded-wallet/position');
  });

  it('BentoAPIError stores status code and response', () => {
    const response = { message: 'bad request', statusCode: 400 };
    const error = new BentoAPIError('failed', BentoErrorStatusCode.BAD_REQUEST, response);
    expect(error.statusCode).toEqual(BentoErrorStatusCode.BAD_REQUEST);
    expect(error.response).toEqual(response);
    expect(error.message).toEqual('failed');
  });

  it('FileTokenStore persists and clears credentials', () => {
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
      expect(loaded).toEqual({
        agentId: 'agent_123',
        apiKey: 'bento_sk_test',
      });

      store.clear();
      expect(fs.existsSync(path.join(tempDir, '.bento-credentials'))).toEqual(false);
    } finally {
      process.chdir(cwd);
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
