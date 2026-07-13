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
  claimUrl: string;
}

export interface ClaimStatusResponse {
  claimed: boolean;
  hasClaimToken: boolean;
  claimToken: string | null;
  claimUrl: string | null;
  status: string;
}
