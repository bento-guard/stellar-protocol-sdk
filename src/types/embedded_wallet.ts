export interface IPosition {
  address: string;
  balances: {
    asset: string;
    amount: string;
  }[];
}

export interface ITransferRequest {
  asset: string;
  amount: string;
  destination: string;
}
