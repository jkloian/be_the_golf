/**
 * Mock utilities for sessionStorage testing
 */

/**
 * Sets up a mock sessionStorage
 */
export function setupMockSessionStorage(): void {
  const store: Record<string, string> = {}

  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key]
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((key) => delete store[key])
      }),
      get length() {
        return Object.keys(store).length
      },
      key: jest.fn((index: number) => {
        const keys = Object.keys(store)
        return keys[index] || null
      }),
    },
    writable: true,
  })
}

/**
 * Clears mock sessionStorage
 */
export function clearMockSessionStorage(): void {
  if (window.sessionStorage.clear) {
    window.sessionStorage.clear()
  }
}

/**
 * Sets a value in mock sessionStorage
 */
export function setMockSessionStorageItem(key: string, value: string): void {
  window.sessionStorage.setItem(key, value)
}

/**
 * Gets a value from mock sessionStorage
 */
export function getMockSessionStorageItem(key: string): string | null {
  return window.sessionStorage.getItem(key)
}

/**
 * Removes a value from mock sessionStorage
 */
export function removeMockSessionStorageItem(key: string): void {
  window.sessionStorage.removeItem(key)
}

