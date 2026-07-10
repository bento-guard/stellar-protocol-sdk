import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { IReserves } from '../../types';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function getReserves(client: BentoStellarClient): Promise<IReserves> {
  const response = await client.http.get<IReserves>(`${LENDING_POOL_BASE}/reserves`);
  return response.data;
}
