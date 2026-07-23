import type { BentoStellarClient } from "../../core/bento-client";
import { Module, Version, buildEndpoint } from "../../constants";
import { PoolActionRequest } from "../../types";
import { executeSecureAgentAction } from "../../utils/security";

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function deposit(
  client: BentoStellarClient,
  action: PoolActionRequest,
): Promise<any> {
  return executeSecureAgentAction(client, {
    url: `${LENDING_POOL_BASE}/agent/deposit`,
    body: action,
    fallbackMessage: "Failed to deposit into agent lending pool",
  });
}
