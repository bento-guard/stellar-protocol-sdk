import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { AgentCreateTransactionRequest, CreateTransactionRequest } from '../../types';
import { postJson } from '../../utils/request';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export async function createTransaction(client: BentoStellarClient, payload: CreateTransactionRequest): Promise<any> {
  return postJson(client, `${EMBEDDED_WALLET_BASE}/transaction/create`, payload, 'Failed to create embedded wallet transaction');
}

export async function createAgentTransaction(client: BentoStellarClient, payload: AgentCreateTransactionRequest): Promise<any> {
  return postJson(client, `${EMBEDDED_WALLET_BASE}/agent/transaction/create`, payload, 'Failed to create agent embedded wallet transaction');
}
