export * from './types';
import { BlendServiceClient } from '../../core/bento-client';
import {
  LendingPoolActionRequest,
  LendingPoolFaucetRequest,
  LendingPoolInfo,
  LendingPoolReserve,
  LendingPoolSubmitRequest,
} from './types';

export class LendingPoolApi {
  constructor(private readonly client: BlendServiceClient) {}

  getInfo(): Promise<LendingPoolInfo> {
    return this.client.http.get('/v2/lending-pool/info').then((response) => response.data);
  }

  getReserves(): Promise<LendingPoolReserve[]> {
    return this.client.http.get('/v2/lending-pool/reserves').then((response) => response.data);
  }

  getPosition(): Promise<unknown> {
    return this.client.http.get('/v2/lending-pool/position').then((response) => response.data);
  }

  discoverMarkets() {
    return Promise.all([this.getInfo(), this.getReserves()]).then(([info, reserves]) => ({
      info,
      reserves,
    }));
  }

  deposit(payload: LendingPoolActionRequest) {
    return this.client.http.post('/v2/lending-pool/deposit', payload).then((response) => response.data);
  }

  borrow(payload: LendingPoolActionRequest) {
    return this.client.http.post('/v2/lending-pool/borrow', payload).then((response) => response.data);
  }

  repay(payload: LendingPoolActionRequest) {
    return this.client.http.post('/v2/lending-pool/repay', payload).then((response) => response.data);
  }

  withdraw(payload: LendingPoolActionRequest) {
    return this.client.http.post('/v2/lending-pool/withdraw', payload).then((response) => response.data);
  }

  submit(payload: LendingPoolSubmitRequest) {
    return this.client.http.post('/v2/lending-pool/submit', payload).then((response) => response.data);
  }

  faucet(payload: LendingPoolFaucetRequest) {
    return this.client.http.post('/v2/lending-pool/faucet', payload).then((response) => response.data);
  }
}

export function createLendingPoolApi(client: BlendServiceClient): LendingPoolApi {
  return new LendingPoolApi(client);
}
