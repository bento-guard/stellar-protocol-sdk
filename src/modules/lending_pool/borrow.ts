import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { PoolActionRequest } from '../../types';
import { postJobAndWait } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function borrow(client: BentoStellarClient, action: PoolActionRequest): Promise<any> {
  return postJobAndWait(client, `${LENDING_POOL_BASE}/agent/borrow`, action, 'Failed to borrow from agent lending pool');
}
