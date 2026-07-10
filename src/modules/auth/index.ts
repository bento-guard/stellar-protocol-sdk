export * from './types';
import { BlendServiceClient } from '../../core/bento-client';
import {
  ClaimAgentRequest,
  ClaimStatusResponse,
  RegisterAgentRequest,
  RegisterAgentResponse,
} from './types';

export class AgentIdentityApi {
  constructor(private readonly client: BlendServiceClient) {}

  registerAgent(payload: RegisterAgentRequest): Promise<RegisterAgentResponse> {
    return this.client.http.post('/v2/agents/auth/register', payload).then((response) => response.data);
  }

  getClaimStatus(): Promise<ClaimStatusResponse> {
    return this.client.http.get('/v2/agents/auth/claim/status').then((response) => response.data);
  }

  regenerateClaimToken(): Promise<{ claimToken: string; claimUrl: string; message: string; expiresIn: number }> {
    return this.client.http.post('/v2/agents/auth/claim/regenerate').then((response) => response.data);
  }

  claimAgent(payload: ClaimAgentRequest): Promise<{ success: boolean; message: string; agentId: string }> {
    return this.client.http.post('/v2/agents/auth/claim/verify', payload).then((response) => response.data);
  }

  getMyAgents(): Promise<{ items: unknown[]; total: number }> {
    return this.client.http.get('/v2/agents/auth/me').then((response) => response.data);
  }
}

export function createAgentIdentityApi(client: BlendServiceClient): AgentIdentityApi {
  return new AgentIdentityApi(client);
}
