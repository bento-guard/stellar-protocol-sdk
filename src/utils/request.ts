import type { AxiosInstance } from 'axios';
import { BentoAPIError, isBentoError } from '../errors';
import { DEFAULT_MAX_POLL_ATTEMPTS, DEFAULT_POLL_INTERVAL_MS, buildEndpoint, Version, Module } from '../constants';

type HttpClient = Pick<AxiosInstance, 'get' | 'post'>;

export interface RequestClient {
  http: HttpClient;
}

function wrapError(error: unknown, fallbackMessage: string): never {
  if (isBentoError(error)) throw error;
  const message = error instanceof Error ? error.message : fallbackMessage;
  throw new BentoAPIError(message || fallbackMessage, undefined, error);
}

export async function getJson<T>(client: RequestClient, url: string, fallbackMessage: string): Promise<T> {
  try {
    const response = await client.http.get<T>(url);
    return response.data;
  } catch (error) {
    wrapError(error, fallbackMessage);
  }
}

export async function postJson<TResponse, TBody = unknown>(
  client: RequestClient,
  url: string,
  body: TBody,
  fallbackMessage: string,
): Promise<TResponse> {
  try {
    const response = await client.http.post<TResponse>(url, body);
    return response.data;
  } catch (error) {
    wrapError(error, fallbackMessage);
  }
}

export async function postJobAndWait<TResponse, TBody = unknown>(
  client: RequestClient,
  url: string,
  body: TBody,
  fallbackMessage: string,
  pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
  maxAttempts = DEFAULT_MAX_POLL_ATTEMPTS,
): Promise<TResponse> {
  // 1. Submit the action
  const jobResponse: any = await postJson(client, url, body, fallbackMessage);
  
  const jobId = jobResponse?.data?.jobId || jobResponse?.jobId;
  if (!jobId) {
    // If there's no jobId, it might be a synchronous response or unexpected format
    return jobResponse as TResponse;
  }

  // 2. Poll the job status
  const JOBS_ENDPOINT = buildEndpoint(Version.Version2, Module.JOBS);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    
    try {
      const statusRes = await client.http.get<any>(`${JOBS_ENDPOINT}/${jobId}`);
      const jobData = statusRes.data?.data || statusRes.data;
      
      if (jobData?.status === 'completed') {
        return jobData.result as TResponse;
      }
      
      if (jobData?.status === 'failed') {
        throw new Error(jobData.error || 'Job processing failed');
      }
      // If 'waiting', 'active', 'delayed', continue polling
    } catch (error) {
      if (isBentoError(error)) throw error;
      // If the error is an HTTP error fetching the job, we can wrap it
      // but usually we might want to just retry or throw. For now, wrap it if it's a hard error.
      // E.g., 404 might mean job was deleted, throw error.
      const status = (error as any)?.response?.status;
      if (status >= 400 && status < 500) {
        wrapError(error, `Failed to poll job status for jobId: ${jobId}`);
      }
    }
  }

  throw new BentoAPIError(`Timeout waiting for job ${jobId} to complete`);
}
