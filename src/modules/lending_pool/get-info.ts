import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function getInfo(client: BentoStellarClient): Promise<any> {
  const response = await client.http.get(`${LENDING_POOL_BASE}/info`);
  return response.data;
}
