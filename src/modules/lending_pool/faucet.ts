import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { LendingPoolFaucetRequest } from '../../types';
import { postJson } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function faucet(client: BentoStellarClient, request: LendingPoolFaucetRequest): Promise<any> {
  return postJson(client, `${LENDING_POOL_BASE}/faucet`, request, 'Failed to request lending pool faucet');
}
