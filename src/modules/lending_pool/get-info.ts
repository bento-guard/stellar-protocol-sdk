import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { BentoAPIError, BentoError, isBentoError } from '../../errors';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function getInfo(client: BentoStellarClient): Promise<any> {
  try {
    const response = await client.http.get(`${LENDING_POOL_BASE}/info`);
    return response.data;
  } catch (error) {
    if (isBentoError(error)) throw error;
    throw new BentoAPIError('Failed to fetch lending pool info', undefined, error);
  }
}
