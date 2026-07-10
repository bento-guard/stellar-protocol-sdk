import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { BentoAPIError, isBentoError } from '../../errors';
import { ITransferRequest } from '../../types';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function transfer(client: BentoStellarClient, request: ITransferRequest): Promise<any> {
  try {
    const response = await client.http.post(`${EMBEDDED_WALLET_BASE}/transfer`, request);
    return response.data;
  } catch (error) {
    if (isBentoError(error)) throw error;
    throw new BentoAPIError('Failed to transfer asset from embedded wallet', undefined, error);
  }
}
