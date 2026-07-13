export type LendingActionType = 'DEPOSIT' | 'BORROW' | 'REPAY' | 'WITHDRAW' | 'SUBMIT' | '';

export interface LendingPoolActionRequest {
  /** User-scoped email in the current backend flow. Agent flows should not own this value directly. */
  email: string;
  assetId: string;
  amount: string;
}

export interface LendingPoolSubmitRequest {
  /** User-scoped email in the current backend flow. Agent flows should not own this value directly. */
  email: string;
  requests: Array<{
    actionType: Exclude<LendingActionType, 'SUBMIT' | ''>;
    assetId: string;
    amount: string;
  }>;
}

export interface AgentPoolActionRequest {
  assetId: string;
  amount: string;
}

export interface AgentSubmitRequest {
  actionType: Exclude<LendingActionType, 'SUBMIT' | ''>;
  assetId: string;
  amount: string;
}

export interface AgentSubmitActionRequest {
  requests: AgentSubmitRequest[];
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
