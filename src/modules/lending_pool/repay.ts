import type { BentoStellarClient } from '../../core/bento-client';
import { Module, Version, buildEndpoint } from '../../constants';
import { IPoolAction } from '../../types';
import { postJson } from '../../utils/request';

const LENDING_POOL_BASE = buildEndpoint(Version.Version2, Module.LENDING_POOL);

export async function repay(client: BentoStellarClient, action: IPoolAction): Promise<any> {
  return postJson(client, `${LENDING_POOL_BASE}/repay`, action, 'Failed to repay lending pool debt');
}
