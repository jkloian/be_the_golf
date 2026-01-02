/**
 * Mock utilities for API testing
 */

export interface MockFetchResponse {
  ok?: boolean
  status?: number
  json?: () => Promise<unknown>
  text?: () => Promise<string>
}

export type MockFetch = (
  url: string | URL | Request,
  init?: RequestInit
) => Promise<Response>

/**
 * Creates a mock fetch function that returns a successful response
 */
export function createMockFetchSuccess(data: unknown): MockFetch {
  return jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    } as Response)
  )
}

/**
 * Creates a mock fetch function that returns an error response
 */
export function createMockFetchError(
  status: number = 500,
  message: string = 'An error occurred'
): MockFetch {
  return jest.fn(() =>
    Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve({ message }),
      text: () => Promise.resolve(JSON.stringify({ message })),
    } as Response)
  )
}

/**
 * Creates a mock fetch function that throws a network error
 */
export function createMockFetchNetworkError(): MockFetch {
  return jest.fn(() => Promise.reject(new Error('Network error')))
}

/**
 * Sets up global fetch mock
 */
export function setupFetchMock(mockFn: MockFetch): void {
  global.fetch = mockFn as typeof fetch
}

/**
 * Clears fetch mock
 */
export function clearFetchMock(): void {
  jest.restoreAllMocks()
}

/**
 * Helper to create a mock response with custom data
 */
export function mockResponse(data: unknown, options: { ok?: boolean; status?: number } = {}): Response {
  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response
}

