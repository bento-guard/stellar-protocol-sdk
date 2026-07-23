export type LendingActionType =
  "DEPOSIT" | "BORROW" | "REPAY" | "WITHDRAW" | "SUBMIT" | "";

export interface ResolvedTargets {
  assetPubkeys?: string[];
  contractPubkeys?: string[];
  receiverPubkey?: string;
}

export interface PoolActionRequest {
  assetPubkey: string;
  amount: string;
  instruction?: string;
  resolvedTargets?: ResolvedTargets;
}

export interface SubmitActionRequest {
  requests: Array<{
    actionType: Exclude<LendingActionType, "SUBMIT" | "">;
    assetPubkey: string;
    amount: string;
  }>;
  instruction?: string;
  resolvedTargets?: ResolvedTargets;
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
