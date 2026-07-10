import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { BentoAPIError, isBentoError } from '../../errors';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function approveTransaction(client: BentoStellarClient, txId: string): Promise<any> {
  try {
    const response = await client.http.post(`${EMBEDDED_WALLET_BASE}/transaction/approve`, { txId });
    return response.data;
  } catch (error) {
    if (isBentoError(error)) throw error;
    throw new BentoAPIError('Failed to approve embedded wallet transaction', undefined, error);
  }
}
