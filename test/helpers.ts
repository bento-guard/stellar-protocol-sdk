export function createMockHttp(defaultResponse: any = undefined) {
  return {
    getCalls: [] as Array<{ url: string }>,
    postCalls: [] as Array<{ url: string; payload: unknown }>,
    get<T = unknown>(url: string): Promise<{ data: T }> {
      this.getCalls.push({ url });
      return Promise.resolve({ data: defaultResponse as T });
    },
    post<T = unknown>(url: string, payload?: unknown): Promise<{ data: T }> {
      this.postCalls.push({ url, payload });
      // If we provided a defaultResponse for polling, return a jobId here so it polls
      if (defaultResponse && defaultResponse.status === 'completed') {
        return Promise.resolve({ data: { jobId: '123' } as T });
      }
      return Promise.resolve({ data: defaultResponse as T });
    },
  };
}
