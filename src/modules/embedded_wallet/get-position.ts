import type { BentoStellarClient } from '../../core/bento-client';
import { IPosition } from '../../types';

export async function getPosition(client: BentoStellarClient): Promise<IPosition> {
  const response = await client.http.get<IPosition>('/v2/embedded-wallet/position');
  return response.data;
}
