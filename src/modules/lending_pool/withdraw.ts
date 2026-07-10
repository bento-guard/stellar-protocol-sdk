import type { BentoStellarClient } from '../../core/bento-client';
import { IPoolAction } from '../../types';

export async function withdraw(client: BentoStellarClient, action: IPoolAction): Promise<any> {
  const response = await client.http.post('/v2/lending-pool/withdraw', action);
  return response.data;
}
