export * from './types';
import { BlendServiceClient } from '../../core/bento-client';
import {
  ApproveTransactionRequest,
  CreateTransactionRequest,
  EmbeddedWalletPosition,
  TransferAssetRequest,
} from './types';

export class EmbeddedWalletApi {
  constructor(private readonly client: BlendServiceClient) {}

  getPosition(): Promise<EmbeddedWalletPosition> {
    return this.client.http.get('/v2/embedded-wallet/position').then((response) => response.data);
  }

  createWallet(network?: string) {
    return this.client.http.post('/v2/embedded-wallet/create', network ? { network } : {}).then((response) => response.data);
  }

  listProviders() {
    return this.client.http.get('/v2/embedded-wallet/provider').then((response) => response.data);
  }

  createTransaction(payload: CreateTransactionRequest) {
    return this.client.http.post('/v2/embedded-wallet/transaction/create', payload).then((response) => response.data);
  }

  approveTransaction(payload: ApproveTransactionRequest) {
    return this.client.http.post('/v2/embedded-wallet/transaction/approve', payload).then((response) => response.data);
  }

  transfer(payload: TransferAssetRequest) {
    return this.client.http.post('/v2/embedded-wallet/transfer', payload).then((response) => response.data);
  }
}

export function createEmbeddedWalletApi(client: BlendServiceClient): EmbeddedWalletApi {
  return new EmbeddedWalletApi(client);
}
