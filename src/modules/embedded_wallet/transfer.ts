import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { ITransferRequest } from '../../types';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function transfer(client: BentoStellarClient, request: ITransferRequest): Promise<any> {
  const response = await client.http.post(`${EMBEDDED_WALLET_BASE}/transfer`, request);
  return response.data;
}
