import type { BentoStellarClient } from '../../core/bento-client';

export async function getPosition(client: BentoStellarClient): Promise<any> {
  const response = await client.http.get('/v2/lending-pool/position');
  return response.data;
}
