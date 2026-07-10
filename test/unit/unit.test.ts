import assert from 'node:assert/strict';
import { buildEndpoint, Module, Version } from '../../src/constants';
import { BentoAPIError, BentoErrorStatusCode } from '../../src/errors';
import { runSuite, expectEqual } from '../helpers';

export async function runUnitTests(): Promise<void> {
  await runSuite('Unit', [
    {
      name: 'buildEndpoint composes version/module/path cleanly',
      run: () => {
        expectEqual(
          buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET, 'position'),
          '/v2/embedded-wallet/position',
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
  ]);
}
