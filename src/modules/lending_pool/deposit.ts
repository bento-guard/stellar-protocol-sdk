import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { AgentPoolActionRequest, IPoolAction } from '../../types';
import { postJson } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function deposit(client: BentoStellarClient, action: IPoolAction): Promise<any> {
  return postJson(client, `${LENDING_POOL_BASE}/deposit`, action, 'Failed to deposit into lending pool');
}

export async function depositForAgent(client: BentoStellarClient, action: AgentPoolActionRequest): Promise<any> {
  return postJson(client, `${LENDING_POOL_BASE}/agent/deposit`, action, 'Failed to deposit into agent lending pool');
}
