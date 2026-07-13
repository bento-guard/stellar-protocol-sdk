import assert from 'node:assert/strict';

export type TestFn = () => void | Promise<void>;

export interface TestCase {
  name: string;
  run: TestFn;
}

export async function runSuite(title: string, cases: TestCase[]): Promise<void> {
  console.log(`\n${title}`);

  for (const testCase of cases) {
    try {
      await testCase.run();
      console.log(`  ✓ ${testCase.name}`);
    } catch (error) {
      console.error(`  ✗ ${testCase.name}`);
      throw error;
    }
  }
}

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

export function expectEqual(actual: unknown, expected: unknown, message?: string): void {
  if (message) {
    assert.deepEqual(actual, expected, message);
    return;
  }
  assert.deepEqual(actual, expected);
}
