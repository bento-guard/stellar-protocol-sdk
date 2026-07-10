import axios, { AxiosError, AxiosInstance } from 'axios';
import { BentoAPIError, BentoAuthError, DEFAULT_BASE_URL, DEFAULT_TIMEOUT_MS, logger } from '../utils';
import { BentoCredentials, FileTokenStore, TokenStore } from './auth-store';

export interface BlendServiceClientOptions {
  baseURL?: string;
  tokenStore?: TokenStore;
  timeoutMs?: number;
}

export class BlendServiceClient {
  public readonly http: AxiosInstance;
  private readonly tokenStore: TokenStore;

  constructor(options: BlendServiceClientOptions = {}) {
    this.tokenStore = options.tokenStore ?? new FileTokenStore();
    this.http = axios.create({
      baseURL: options.baseURL ?? process.env.BENTO_BASE_URL ?? DEFAULT_BASE_URL,
      timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  get credentials(): BentoCredentials {
    return this.tokenStore.load();
  }

  setCredentials(credentials: BentoCredentials): void {
    this.tokenStore.save(credentials);
  }

  setAccessToken(accessToken: string): void {
    const current = this.credentials;
    this.tokenStore.save({ ...current, accessToken });
  }

  setApiKey(agentApiKey: string): void {
    const current = this.credentials;
    this.tokenStore.save({ ...current, agentApiKey });
  }

  clearCredentials(): void {
    this.tokenStore.clear();
  }

  private setupInterceptors(): void {
    this.http.interceptors.request.use((config) => {
      const credentials = this.credentials;
      if (credentials.accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${credentials.accessToken}`;
      }
      if (credentials.agentApiKey) {
        config.headers = config.headers ?? {};
        config.headers['x-bento-api-key'] = credentials.agentApiKey;
      }
      return config;
    });

    this.http.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const statusCode = error.response?.status;
        const payload = error.response?.data;
        if (statusCode === 401) {
          return Promise.reject(new BentoAuthError('Authentication failed. Please refresh or set credentials again.'));
        }
        if (statusCode) {
          return Promise.reject(new BentoAPIError(this.extractMessage(payload) ?? error.message, statusCode, payload));
        }
        return Promise.reject(new BentoAPIError(error.message, undefined, payload));
      },
    );
  }

  private extractMessage(payload: unknown): string | undefined {
    if (typeof payload === 'object' && payload && 'message' in payload) {
      const value = (payload as { message?: unknown }).message;
      return Array.isArray(value) ? value.join(', ') : String(value);
    }
    return undefined;
  }
}

export type BentoStellarClient = BlendServiceClient;
