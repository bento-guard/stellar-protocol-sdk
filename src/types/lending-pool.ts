export type LendingActionType = 'DEPOSIT' | 'BORROW' | 'REPAY' | 'WITHDRAW' | 'SUBMIT' | 'FAUCET';

export interface LendingPoolActionRequest {
  email: string;
  assetId: string;
  amount: string;
}

export interface LendingPoolSubmitRequest {
  email: string;
  requests: Array<{
    actionType: Exclude<LendingActionType, 'SUBMIT' | 'FAUCET'>;
    assetId: string;
    amount: string;
  }>;
}

export interface LendingPoolFaucetRequest {
  email: string;
}

export interface LendingPoolInfo {
  [key: string]: unknown;
}

export interface LendingPoolReserve {
  [key: string]: unknown;
}

export interface IPoolAction {
  email: string;
  assetId: string;
  amount: string;
}

export interface IReserves {
  reserves: LendingPoolReserve[];
}
