import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { TransferAssetRequest } from '../../types';
import { postJson } from '../../utils/request';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function transfer(client: BentoStellarClient, request: TransferAssetRequest): Promise<any> {
  return postJson(client, `${EMBEDDED_WALLET_BASE}/transfer`, request, 'Failed to transfer asset from embedded wallet');
}
