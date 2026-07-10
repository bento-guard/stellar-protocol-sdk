import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { BentoAPIError, isBentoError } from '../../errors';
import { IPoolAction } from '../../types';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function deposit(client: BentoStellarClient, action: IPoolAction): Promise<any> {
  try {
    const response = await client.http.post(`${LENDING_POOL_BASE}/deposit`, action);
    return response.data;
  } catch (error) {
    if (isBentoError(error)) throw error;
    throw new BentoAPIError('Failed to deposit into lending pool', undefined, error);
  }
}
