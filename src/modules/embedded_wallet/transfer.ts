import type { BentoStellarClient } from "../../core/bento-client";
import { Module, Version, buildEndpoint } from "../../constants";
import { TransferAssetRequest } from "../../types";
import { executeSecureAgentAction } from "../../utils/security";

const EMBEDDED_WALLET_BASE = buildEndpoint(
  Version.Version2,
  Module.EMBEDDED_WALLET,
);

export async function transferAsset(
  client: BentoStellarClient,
  request: TransferAssetRequest,
): Promise<any> {
  return executeSecureAgentAction(client, {
    url: `${EMBEDDED_WALLET_BASE}/agent/transfer`,
    body: request,
    fallbackMessage: "Failed to execute agent asset transfer",
  });
}
