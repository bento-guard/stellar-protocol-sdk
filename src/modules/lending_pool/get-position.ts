import { BentoStellarClient } from '../../core/bento-client';

export async function getPosition(client: BentoStellarClient, agentId: string): Promise<any> {
  const response = await client.http.get(`/v2/lending-pool/position/${agentId}`);
  return response.data;
}
