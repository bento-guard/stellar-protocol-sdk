import axios, { AxiosInstance, AxiosError } from 'axios';
import { loadCredentials, saveCredentials } from './credentials';
import { DEFAULT_BASE_URL, logger, BentoAuthError } from '../utils';

export class BentoStellarClient {
  public readonly http: AxiosInstance;

  constructor(baseURL: string = process.env.BENTO_BASE_URL || DEFAULT_BASE_URL) {
    this.http = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Add token to requests
    this.http.interceptors.request.use((config) => {
      try {
        const creds = loadCredentials();
        if (creds.jwt_token) {
          config.headers['Authorization'] = `Bearer ${creds.jwt_token}`;
        }
      } catch (error) {
        logger.warn('Could not load credentials, sending request without token.');
      }
      return config;
    });

    // Handle token refresh on 401
    this.http.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
          (originalRequest as any)._retry = true;
          
          try {
            const creds = loadCredentials();
            
            // Note: We use a separate axios instance to avoid interceptor loops
            const refreshHttp = axios.create({ baseURL: this.http.defaults.baseURL });
            const response = await refreshHttp.post('/v1/sign-in/agent/token', {
              api_key: creds.agent_api_key
            });

            if (response.data && response.data.token) {
              // Update credentials file
              saveCredentials({
                agent_api_key: creds.agent_api_key,
                jwt_token: response.data.token
              });
              
              // Retry original request
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
              }
              return this.http(originalRequest);
            }
          } catch (refreshError) {
            return Promise.reject(new BentoAuthError('Failed to auto-refresh token. Agent API Key might be invalid.'));
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
}

