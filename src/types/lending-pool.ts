export type LendingActionType = 'DEPOSIT' | 'BORROW' | 'REPAY' | 'WITHDRAW' | 'SUBMIT' | '';

export interface PoolActionRequest {
  assetId: string;
  amount: string;
}

export interface SubmitActionRequest {
  requests: Array<{
    actionType: Exclude<LendingActionType, 'SUBMIT' | ''>;
    assetId: string;
    amount: string;
  }>;
}

export interface LendingPoolInfo {
  [key: string]: unknown;
}

export interface LendingPoolReserve {
  [key: string]: unknown;
}

export interface IReserves {
  reserves: LendingPoolReserve[];
}
