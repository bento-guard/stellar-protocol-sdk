export interface EmbeddedWalletPosition {
  balances: Array<{
    asset: string;
    amount: string;
  }>;
  nfts?: unknown[];
}

export interface CreateTransactionRequest {
  /** User-scoped wallet locator. Backend should resolve this from auth context for agent flows. */
  wallet_locator: string;
  params: Record<string, unknown>;
}

export interface ApproveTransactionRequest {
  /** User-scoped wallet locator. Backend should resolve this from auth context for agent flows. */
  wallet_locator: string;
  txId: string;
}

export interface TransferAssetRequest {
  /** User-scoped wallet locator. Backend should resolve this from auth context for agent flows. */
  wallet_locator: string;
  toAddress: string;
  tokenId: string;
  amount: string;
}

export interface AgentCreateTransactionRequest {
  params: Record<string, unknown>;
}

export interface AgentApproveTransactionRequest {
  txId: string;
}

export interface AgentTransferAssetRequest {
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
