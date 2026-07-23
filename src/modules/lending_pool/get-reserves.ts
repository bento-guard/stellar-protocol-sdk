import type { BentoStellarClient } from "../../core/bento-client";
import { Module, Version, buildEndpoint } from "../../constants";
import { IReserves } from "../../types";
import { getJson } from "../../utils/request";

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function getReserves(
  client: BentoStellarClient,
): Promise<IReserves> {
  return getJson<IReserves>(
    client,
    `${LENDING_POOL_BASE}/reserves`,
    "Failed to fetch lending pool reserves",
  );
}
