import type { BentoStellarClient } from '../../core/bento-client';
import { IReserves } from './types';

export async function getReserves(client: BentoStellarClient): Promise<IReserves> {
  const response = await client.http.get<IReserves>('/v2/lending-pool/reserves');
  return response.data;
}
