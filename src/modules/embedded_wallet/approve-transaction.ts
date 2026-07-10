import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function approveTransaction(client: BentoStellarClient, txId: string): Promise<any> {
  const response = await client.http.post(`${EMBEDDED_WALLET_BASE}/transaction/approve`, { txId });
  return response.data;
}
