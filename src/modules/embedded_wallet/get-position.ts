import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { IPosition } from '../../types';
import { getJson } from '../../utils/request';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function getPosition(client: BentoStellarClient): Promise<IPosition> {
  return getJson<IPosition>(client, `${EMBEDDED_WALLET_BASE}/position`, 'Failed to fetch embedded wallet position');
}
