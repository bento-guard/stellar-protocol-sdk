export interface CreateTransactionRequest {
  params: Record<string, unknown>;
}

export interface ApproveTransactionRequest {
  txId: string;
}

export interface TransferAssetRequest {
  toAddress: string;
  tokenId: string;
  amount: string;
}

export interface EmbeddedWalletPosition {
  balances: Array<{
    asset: string;
    amount: string;
  }>;
  nfts?: unknown[];
}
