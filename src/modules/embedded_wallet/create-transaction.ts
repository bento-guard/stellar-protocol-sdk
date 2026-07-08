import { BentoStellarClient } from '../../core/bento-client';

export async function createTransaction(client: BentoStellarClient, payload: any): Promise<any> {
  const response = await client.http.post('/v2/embedded-wallet/transaction/create', payload);
  return response.data;
}
