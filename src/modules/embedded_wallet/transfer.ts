import type { BentoStellarClient } from '../../core/bento-client';
import { ITransferRequest } from '../../types';

export async function transfer(client: BentoStellarClient, request: ITransferRequest): Promise<any> {
  const response = await client.http.post('/v2/embedded-wallet/transfer', request);
  return response.data;
}
