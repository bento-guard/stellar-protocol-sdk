import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { AgentSubmitActionRequest } from '../../types';
import { postJson } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function submitForAgent(client: BentoStellarClient, request: AgentSubmitActionRequest): Promise<any> {
  return postJson(client, `${LENDING_POOL_BASE}/agent/submit`, request, 'Failed to submit agent atomic lending pool requests');
}
