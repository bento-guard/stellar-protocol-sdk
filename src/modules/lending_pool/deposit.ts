import type { BentoStellarClient } from '../../core/bento-client';
import { IPoolAction } from './types';

export async function deposit(client: BentoStellarClient, action: IPoolAction): Promise<any> {
  const response = await client.http.post('/v2/lending-pool/deposit', action);
  return response.data;
}
