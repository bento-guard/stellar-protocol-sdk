import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { getJson } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function getPosition(client: BentoStellarClient): Promise<any> {
  return getJson(client, `${LENDING_POOL_BASE}/position`, 'Failed to fetch lending pool position');
}

export async function getAgentPosition(client: BentoStellarClient): Promise<any> {
  return getJson(client, `${LENDING_POOL_BASE}/agent/position`, 'Failed to fetch agent lending pool position');
}
