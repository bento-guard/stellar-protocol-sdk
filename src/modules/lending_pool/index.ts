import { BlendServiceClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import {
  LendingPoolActionRequest,
  LendingPoolFaucetRequest,
  LendingPoolInfo,
  LendingPoolReserve,
  LendingPoolSubmitRequest,
} from '../../types';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export class LendingPoolApi {
  constructor(private readonly client: BlendServiceClient) {}

  getInfo(): Promise<LendingPoolInfo> {
    return this.client.http.get(`${LENDING_POOL_BASE}/info`).then((response) => response.data);
  }

  getReserves(): Promise<LendingPoolReserve[]> {
    return this.client.http.get(`${LENDING_POOL_BASE}/reserves`).then((response) => response.data);
  }

  getPosition(): Promise<unknown> {
    return this.client.http.get(`${LENDING_POOL_BASE}/position`).then((response) => response.data);
  }

  discoverMarkets() {
    return Promise.all([this.getInfo(), this.getReserves()]).then(([info, reserves]) => ({
      info,
      reserves,
    }));
  }

  deposit(payload: LendingPoolActionRequest) {
    return this.client.http.post(`${LENDING_POOL_BASE}/deposit`, payload).then((response) => response.data);
  }

  borrow(payload: LendingPoolActionRequest) {
    return this.client.http.post(`${LENDING_POOL_BASE}/borrow`, payload).then((response) => response.data);
  }

  repay(payload: LendingPoolActionRequest) {
    return this.client.http.post(`${LENDING_POOL_BASE}/repay`, payload).then((response) => response.data);
  }

  withdraw(payload: LendingPoolActionRequest) {
    return this.client.http.post(`${LENDING_POOL_BASE}/withdraw`, payload).then((response) => response.data);
  }

  submit(payload: LendingPoolSubmitRequest) {
    return this.client.http.post(`${LENDING_POOL_BASE}/submit`, payload).then((response) => response.data);
  }

  faucet(payload: LendingPoolFaucetRequest) {
    return this.client.http.post(`${LENDING_POOL_BASE}/faucet`, payload).then((response) => response.data);
  }
}

export function createLendingPoolApi(client: BlendServiceClient): LendingPoolApi {
  return new LendingPoolApi(client);
}
