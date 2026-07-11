import { BlendServiceClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import {
  ClaimAgentRequest,
  ClaimStatusResponse,
  RegisterAgentRequest,
  RegisterAgentResponse,
} from '../../types';
import { getJson, postJson } from '../../utils/request';

const AUTH_BASE = buildEndpoint(Version.Version2, Module.AUTH);

export class AgentIdentityApi {
  constructor(private readonly client: BlendServiceClient) {}

  registerAgent(payload: RegisterAgentRequest): Promise<RegisterAgentResponse> {
    return postJson<RegisterAgentResponse, RegisterAgentRequest>(this.client, `${AUTH_BASE}/register`, payload, 'Failed to register agent');
  }

  getClaimStatus(): Promise<ClaimStatusResponse> {
    return getJson<ClaimStatusResponse>(this.client, `${AUTH_BASE}/claim/status`, 'Failed to fetch claim status');
  }

  regenerateClaimToken(): Promise<{ claimToken: string; claimUrl: string; message: string; expiresIn: number }> {
    return postJson<{ claimToken: string; claimUrl: string; message: string; expiresIn: number }, undefined>(
      this.client,
      `${AUTH_BASE}/claim/regenerate`,
      undefined,
      'Failed to regenerate claim token',
    );
  }

  claimAgent(payload: ClaimAgentRequest): Promise<{ success: boolean; message: string; agentId: string }> {
    return postJson<{ success: boolean; message: string; agentId: string }, ClaimAgentRequest>(
      this.client,
      `${AUTH_BASE}/claim/verify`,
      payload,
      'Failed to claim agent',
    );
  }

  getMyAgents(): Promise<{ items: unknown[]; total: number }> {
    return getJson<{ items: unknown[]; total: number }>(this.client, `${AUTH_BASE}/me`, 'Failed to fetch claimed agents');
  }
}

export function createAgentIdentityApi(client: BlendServiceClient): AgentIdentityApi {
  return new AgentIdentityApi(client);
}
