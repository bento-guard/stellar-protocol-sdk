import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { EmbeddedWalletPosition } from '../../types';
import { getJson } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function getPosition(client: BentoStellarClient): Promise<EmbeddedWalletPosition> {
  return getJson<EmbeddedWalletPosition>(client, `${LENDING_POOL_BASE}/agent/position`, 'Failed to fetch agent position');
}
