import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { LendingPoolSubmitRequest } from '../../types';
import { postJson } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function submit(client: BentoStellarClient, request: LendingPoolSubmitRequest): Promise<any> {
  return postJson(client, `${LENDING_POOL_BASE}/submit`, request, 'Failed to submit atomic lending pool requests');
}
