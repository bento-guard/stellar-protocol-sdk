import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { ApproveTransactionRequest } from '../../types';
import { postJobAndWait } from '../../utils/request';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function approveTransaction(
  client: BentoStellarClient,
  request: ApproveTransactionRequest,
): Promise<any> {
  return postJobAndWait(
    client,
    `${EMBEDDED_WALLET_BASE}/agent/transaction/approve`,
    request,
    'Failed to approve agent transaction',
  );
}
