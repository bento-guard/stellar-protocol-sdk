import { BentoStellarClient } from '../../core/bento-client';
import { ITokenRefreshResponse } from './types';

export async function refreshToken(client: BentoStellarClient, apiKey: string): Promise<ITokenRefreshResponse> {
  const response = await client.http.post<ITokenRefreshResponse>('/v1/sign-in/agent/token', {
    api_key: apiKey,
  });
  return response.data;
}
