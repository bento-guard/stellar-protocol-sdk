import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { IPosition } from '../../types';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function getPosition(client: BentoStellarClient): Promise<IPosition> {
  const response = await client.http.get<IPosition>(`${EMBEDDED_WALLET_BASE}/position`);
  return response.data;
}
