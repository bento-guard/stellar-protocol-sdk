export interface RegisterAgentRequest {
  handle: string;
  name: string;
  quote?: string;
}

export interface RegisterAgentResponse {
  agentId: string;
  apiKey: string;
  apiKeyPrefix: string;
  status: string;
  message: string;
  claimToken: string;
}

export interface ClaimStatusResponse {
  claimed: boolean;
  hasClaimToken: boolean;
  claimToken: string | null;
  status: string;
}

export interface AgentInfoResponse {
  agentId: string;
  handle: string;
  name: string;
  quote?: string;
  status: string;
  email: string | null;
  public_address: string | null;
}
