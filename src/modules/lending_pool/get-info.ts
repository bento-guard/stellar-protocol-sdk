import type { BentoStellarClient } from "../../core/bento-client";
import { Module, Version, buildEndpoint } from "../../constants";
import { getJson } from "../../utils/request";

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function getInfo(client: BentoStellarClient): Promise<any> {
  return getJson(
    client,
    `${LENDING_POOL_BASE}/info`,
    "Failed to fetch lending pool info",
  );
}
