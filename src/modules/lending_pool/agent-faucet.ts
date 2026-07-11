import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { postJson } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function faucetForAgent(client: BentoStellarClient): Promise<any> {
  return postJson(client, `${LENDING_POOL_BASE}/agent/faucet`, {}, 'Failed to request agent lending pool faucet');
}
