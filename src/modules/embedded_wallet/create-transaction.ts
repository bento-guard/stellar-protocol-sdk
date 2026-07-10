import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { BentoAPIError, isBentoError } from '../../errors';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function createTransaction(client: BentoStellarClient, payload: any): Promise<any> {
  try {
    const response = await client.http.post(`${EMBEDDED_WALLET_BASE}/transaction/create`, payload);
    return response.data;
  } catch (error) {
    if (isBentoError(error)) throw error;
    throw new BentoAPIError('Failed to create embedded wallet transaction', undefined, error);
  }
}
