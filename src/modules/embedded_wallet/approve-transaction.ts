import type { BentoStellarClient } from '../../core/bento-client';

export async function approveTransaction(client: BentoStellarClient, txId: string): Promise<any> {
  const response = await client.http.post('/v2/embedded-wallet/transaction/approve', { txId });
  return response.data;
}
