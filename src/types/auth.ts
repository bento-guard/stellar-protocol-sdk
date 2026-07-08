export interface ITokenRefreshRequest {
  api_key: string;
}

export interface ITokenRefreshResponse {
  success: boolean;
  token: string;
}
