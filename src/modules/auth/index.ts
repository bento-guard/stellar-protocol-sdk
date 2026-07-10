import { BlendServiceClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import {
  ClaimAgentRequest,
  ClaimStatusResponse,
  RegisterAgentRequest,
  RegisterAgentResponse,
} from '../../types';

const AUTH_BASE = buildEndpoint(Version.Version2, Module.AUTH);

export class AgentIdentityApi {
  constructor(private readonly client: BlendServiceClient) {}

  registerAgent(payload: RegisterAgentRequest): Promise<RegisterAgentResponse> {
    return this.client.http.post(`${AUTH_BASE}/register`, payload).then((response) => response.data);
  }

  getClaimStatus(): Promise<ClaimStatusResponse> {
    return this.client.http.get(`${AUTH_BASE}/claim/status`).then((response) => response.data);
  }

  regenerateClaimToken(): Promise<{ claimToken: string; claimUrl: string; message: string; expiresIn: number }> {
    return this.client.http.post(`${AUTH_BASE}/claim/regenerate`).then((response) => response.data);
  }

  claimAgent(payload: ClaimAgentRequest): Promise<{ success: boolean; message: string; agentId: string }> {
    return this.client.http.post(`${AUTH_BASE}/claim/verify`, payload).then((response) => response.data);
  }

  getMyAgents(): Promise<{ items: unknown[]; total: number }> {
    return this.client.http.get(`${AUTH_BASE}/me`).then((response) => response.data);
  }
}

export function createAgentIdentityApi(client: BlendServiceClient): AgentIdentityApi {
  return new AgentIdentityApi(client);
}
