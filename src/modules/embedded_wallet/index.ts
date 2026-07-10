import { BlendServiceClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import {
  ApproveTransactionRequest,
  CreateTransactionRequest,
  EmbeddedWalletPosition,
  TransferAssetRequest,
} from '../../types';

const EMBEDDED_WALLET_BASE = buildEndpoint(Version.Version2, Module.EMBEDDED_WALLET);

export class EmbeddedWalletApi {
  constructor(private readonly client: BlendServiceClient) {}

  getPosition(): Promise<EmbeddedWalletPosition> {
    return this.client.http.get(`${EMBEDDED_WALLET_BASE}/position`).then((response) => response.data);
  }

  createWallet(network?: string) {
    return this.client.http.post(`${EMBEDDED_WALLET_BASE}/create`, network ? { network } : {}).then((response) => response.data);
  }

  listProviders() {
    return this.client.http.get(`${EMBEDDED_WALLET_BASE}/provider`).then((response) => response.data);
  }

  createTransaction(payload: CreateTransactionRequest) {
    return this.client.http.post(`${EMBEDDED_WALLET_BASE}/transaction/create`, payload).then((response) => response.data);
  }

  approveTransaction(payload: ApproveTransactionRequest) {
    return this.client.http.post(`${EMBEDDED_WALLET_BASE}/transaction/approve`, payload).then((response) => response.data);
  }

  transfer(payload: TransferAssetRequest) {
    return this.client.http.post(`${EMBEDDED_WALLET_BASE}/transfer`, payload).then((response) => response.data);
  }
}

export function createEmbeddedWalletApi(client: BlendServiceClient): EmbeddedWalletApi {
  return new EmbeddedWalletApi(client);
}
