import type { RequestClient } from '../../utils/request';
import { Module, Version, buildEndpoint } from '../../constants';
import { ApproveTransactionRequest } from '../../types';
import { postJson } from '../../utils/request';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function approveTransaction(
  client: RequestClient,
  request: ApproveTransactionRequest,
): Promise<any> {
  return postJson(
    client,
    `${EMBEDDED_WALLET_BASE}/agent/transaction/approve`,
    request,
    'Failed to approve agent transaction',
  );
}
