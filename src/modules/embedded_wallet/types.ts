export interface EmbeddedWalletPosition {
  balances: Array<{
    asset: string;
    amount: string;
  }>;
  nfts?: unknown[];
}

export interface CreateTransactionRequest {
  wallet_locator: string;
  params: Record<string, unknown>;
}

export interface ApproveTransactionRequest {
  wallet_locator: string;
  txId: string;
}

export interface TransferAssetRequest {
  wallet_locator: string;
  toAddress: string;
  tokenId: string;
  amount: string;
}

export interface IPosition {
  balances: Array<{
    asset: string;
    amount: string;
  }>;
  nfts?: unknown[];
}

export interface ITransferRequest {
  asset: string;
  amount: string;
  destination: string;
}
