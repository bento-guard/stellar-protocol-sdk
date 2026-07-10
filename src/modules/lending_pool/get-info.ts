import type { BentoStellarClient } from '../../core/bento-client';

export async function getInfo(client: BentoStellarClient): Promise<any> {
  const response = await client.http.get('/v2/lending-pool/info');
  return response.data;
}
