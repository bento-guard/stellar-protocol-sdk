import type { AxiosInstance } from "axios";
import { BentoAPIError, isBentoError } from "../errors";

type HttpClient = Pick<AxiosInstance, "get" | "post">;

export interface RequestClient {
  http: HttpClient;
}

function wrapError(error: unknown, fallbackMessage: string): never {
  if (isBentoError(error)) throw error;
  const message = error instanceof Error ? error.message : fallbackMessage;
  throw new BentoAPIError(message || fallbackMessage, undefined, error);
}

export async function getJson<T>(
  client: RequestClient,
  url: string,
  fallbackMessage: string,
): Promise<T> {
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
