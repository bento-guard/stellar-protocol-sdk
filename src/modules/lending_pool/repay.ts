import { BentoStellarClient } from '../../core/bento-client';
import { IPoolAction } from './types';

export async function repay(client: BentoStellarClient, action: IPoolAction): Promise<any> {
  const response = await client.http.post('/v2/lending-pool/repay', action);
  return response.data;
}
