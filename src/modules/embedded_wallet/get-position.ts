import type { BentoStellarClient } from "../../core/bento-client";
import { Module, Version, buildEndpoint } from "../../constants";
import { EmbeddedWalletPosition } from "../../types";
import { getJson } from "../../utils/request";

const EMBEDDED_WALLET_BASE = buildEndpoint(
  Version.Version2,
  Module.EMBEDDED_WALLET,
);

export async function getWalletBalance(
  client: BentoStellarClient,
): Promise<EmbeddedWalletPosition> {
  return getJson<EmbeddedWalletPosition>(
    client,
    `${EMBEDDED_WALLET_BASE}/agent/position`,
    "Failed to fetch agent wallet position",
  );
}
