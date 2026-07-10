import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { BentoAPIError, isBentoError } from '../../errors';
import { IReserves } from '../../types';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function getReserves(client: BentoStellarClient): Promise<IReserves> {
  try {
    const response = await client.http.get<IReserves>(`${LENDING_POOL_BASE}/reserves`);
    return response.data;
  } catch (error) {
    if (isBentoError(error)) throw error;
    throw new BentoAPIError('Failed to fetch lending pool reserves', undefined, error);
  }
}
