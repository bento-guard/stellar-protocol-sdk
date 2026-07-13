import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { TransferAssetRequest } from '../../types';
import { postJobAndWait } from '../../utils/request';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function transferAsset(
  client: BentoStellarClient,
  request: TransferAssetRequest,
): Promise<any> {
  return postJobAndWait(
    client,
    `${EMBEDDED_WALLET_BASE}/agent/transfer`,
    request,
    'Failed to execute agent asset transfer',
  );
}
