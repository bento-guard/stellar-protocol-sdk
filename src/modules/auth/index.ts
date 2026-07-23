import { BlendServiceClient } from "../../core/bento-client";
import { Module, Version, buildEndpoint } from "../../constants";
import {
  ClaimStatusResponse,
  RegisterAgentRequest,
  RegisterAgentResponse,
  AgentInfoResponse,
} from "../../types";
import { getJson, postJson } from "../../utils/request";

const AUTH_BASE = buildEndpoint(Version.Version2, Module.AUTH);

export class AgentIdentityApi {
  constructor(private readonly client: BlendServiceClient) {}

  async registerAgent(
    payload: RegisterAgentRequest,
  ): Promise<RegisterAgentResponse> {
    const response = await postJson<
      RegisterAgentResponse,
      RegisterAgentRequest
    >(
      this.client,
      `${AUTH_BASE}/register`,
      payload,
      "Failed to register agent",
    );
    this.client.setCredentials({
      agentId: response.agentId,
      apiKey: response.apiKey,
    });
    return response;
  }

  getClaimStatus(): Promise<ClaimStatusResponse> {
    return getJson<ClaimStatusResponse>(
      this.client,
      `${AUTH_BASE}/claim/status`,
      "Failed to fetch claim status",
    );
  }

  getAgentInfo(): Promise<AgentInfoResponse> {
    return getJson<AgentInfoResponse>(
      this.client,
      `${AUTH_BASE}/info`,
      "Failed to fetch agent info",
    );
  }

  regenerateClaimToken(): Promise<{
    claimToken: string;
    message: string;
    expiresIn: number;
  }> {
    return postJson<
      { claimToken: string; message: string; expiresIn: number },
      undefined
    >(
      this.client,
      `${AUTH_BASE}/claim/regenerate`,
      undefined,
      "Failed to regenerate claim token",
    );
  }
}

export function createAgentIdentityApi(
  client: BlendServiceClient,
): AgentIdentityApi {
  return new AgentIdentityApi(client);
}
