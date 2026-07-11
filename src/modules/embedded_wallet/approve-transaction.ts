import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { AgentApproveTransactionRequest, ApproveTransactionRequest } from '../../types';
import { postJson } from '../../utils/request';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function approveTransaction(client: BentoStellarClient, payload: ApproveTransactionRequest): Promise<any> {
  return postJson(client, `${EMBEDDED_WALLET_BASE}/transaction/approve`, payload, 'Failed to approve embedded wallet transaction');
}

export async function approveAgentTransaction(client: BentoStellarClient, payload: AgentApproveTransactionRequest): Promise<any> {
  return postJson(client, `${EMBEDDED_WALLET_BASE}/agent/transaction/approve`, payload, 'Failed to approve agent embedded wallet transaction');
}
