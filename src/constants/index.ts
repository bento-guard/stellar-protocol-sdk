export const CREDENTIALS_FILE = '.bento-credentials';
export const DEFAULT_TIMEOUT_MS = 30_000;

export enum BentoEnviroment {
  PROD = 'production',
  DEV = 'development',
  LOCAL = 'local',
}

export enum Relayer {
  PRODUCTION = '',
  DEVELOPMENT = '',
  LOCAL = 'http://localhost:4001',
}

export enum Version {
    Version1 = 'v1',
    Version2 = 'v2',
}

export enum Module {
    LENDING_POOL = 'lending-pool',
    AUTH = 'auth',
    EMBEDDED_WALLET = 'embedded-wallet',
}

export const NETWORK_CONFIG: Record<BentoEnviroment, { endpoint: string; defaultTimeout: number }> = {
  [BentoEnviroment.PROD]: {
    endpoint: Relayer.PRODUCTION,
    defaultTimeout: DEFAULT_TIMEOUT_MS,
  },
  [BentoEnviroment.DEV]: {
    endpoint: Relayer.DEVELOPMENT,
    defaultTimeout: DEFAULT_TIMEOUT_MS,
  },
  [BentoEnviroment.LOCAL]: {
    endpoint: Relayer.LOCAL,
    defaultTimeout: DEFAULT_TIMEOUT_MS,
  },
};

export const DEFAULT_BASE_URL =
  NETWORK_CONFIG[BentoEnviroment.LOCAL].endpoint;

export const buildEndpoint = (version: Version, module: Module, path = ''): string => {
  const suffix = path ? `/${path.replace(/^\/+/, '')}` : '';
  return `/${version}/${module}${suffix}`;
};
