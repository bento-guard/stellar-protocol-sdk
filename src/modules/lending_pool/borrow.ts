import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { IPoolAction } from '../../types';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function borrow(client: BentoStellarClient, action: IPoolAction): Promise<any> {
  const response = await client.http.post(`${LENDING_POOL_BASE}/borrow`, action);
  return response.data;
}
