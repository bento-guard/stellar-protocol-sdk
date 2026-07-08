import { BentoStellarClient } from '../../core/bento-client';
import { IPoolAction } from './types';

export async function borrow(client: BentoStellarClient, action: IPoolAction): Promise<any> {
  const response = await client.http.post('/v2/lending-pool/borrow', action);
  return response.data;
}
