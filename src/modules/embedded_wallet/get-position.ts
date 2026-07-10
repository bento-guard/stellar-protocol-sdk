import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { BentoAPIError, isBentoError } from '../../errors';
import { IPosition } from '../../types';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function getPosition(client: BentoStellarClient): Promise<IPosition> {
  try {
    const response = await client.http.get<IPosition>(`${EMBEDDED_WALLET_BASE}/position`);
    return response.data;
  } catch (error) {
    if (isBentoError(error)) throw error;
    throw new BentoAPIError('Failed to fetch embedded wallet position', undefined, error);
  }
}
