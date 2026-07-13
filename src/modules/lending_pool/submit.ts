import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { SubmitActionRequest } from '../../types';
import { postJobAndWait } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function submit(client: BentoStellarClient, action: SubmitActionRequest): Promise<any> {
  return postJobAndWait(client, `${LENDING_POOL_BASE}/agent/submit`, action, 'Failed to submit batched agent lending pool actions');
}
