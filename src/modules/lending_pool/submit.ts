import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { SubmitActionRequest } from '../../types';
import { executeSecureAgentAction } from '../../utils/security';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function submit(client: BentoStellarClient, action: SubmitActionRequest): Promise<any> {
  return executeSecureAgentAction(client, {
    url: `${LENDING_POOL_BASE}/agent/submit`,
    body: action,
    fallbackMessage: 'Failed to submit agent lending pool action'
  });
}
