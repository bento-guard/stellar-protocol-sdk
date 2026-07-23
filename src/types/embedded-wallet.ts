export interface CreateTransactionRequest {
  params: Record<string, unknown>;
}

export interface ApproveTransactionRequest {
  txId: string;
}

import { ResolvedTargets } from "./lending-pool";

export interface TransferAssetRequest {
  targetPubkey: string;
  assetPubkey: string;
  amount: string;
  instruction?: string;
  resolvedTargets?: ResolvedTargets;
}

export interface EmbeddedWalletPosition {
  balances: Array<{
    asset: string;
    amount: string;
  }>;
  nfts?: unknown[];
}
