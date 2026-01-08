import { renderHook, act } from '@testing-library/react'
import { useWebShare } from '../useWebShare'

// Mock navigator.share
const mockShare = jest.fn()
const originalNavigator = global.navigator

describe('useWebShare', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset navigator
    Object.defineProperty(global, 'navigator', {
      value: { ...originalNavigator },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    })
  })

  it('should detect Web Share API support', () => {
    Object.defineProperty(global.navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useWebShare())
    expect(result.current.isSupported).toBe(true)
  })

  it('should detect when Web Share API is not supported', () => {
    Object.defineProperty(global.navigator, 'share', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useWebShare())
    expect(result.current.isSupported).toBe(false)
  })

  it('should call navigator.share with correct data when supported', async () => {
    mockShare.mockResolvedValue(undefined)
    Object.defineProperty(global.navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useWebShare())

    const shareData = {
      title: 'Test Title',
      text: 'Test Text',
      url: 'https://example.com',
    }

    await act(async () => {
      await result.current.share(shareData)
    })

    expect(mockShare).toHaveBeenCalledWith(shareData)
  })

  it('should throw error when Web Share API is not supported', async () => {
    Object.defineProperty(global.navigator, 'share', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useWebShare())

    await act(async () => {
      await expect(
        result.current.share({
          title: 'Test',
          text: 'Test',
          url: 'https://example.com',
        })
      ).rejects.toThrow('Web Share API is not supported')
    })
  })

  it('should not throw on AbortError (user cancellation)', async () => {
    const abortError = new Error('User cancelled')
    abortError.name = 'AbortError'
    mockShare.mockRejectedValue(abortError)

    Object.defineProperty(global.navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useWebShare())

    await act(async () => {
      // Should not throw
      await result.current.share({
        title: 'Test',
        text: 'Test',
        url: 'https://example.com',
      })
    })

    expect(mockShare).toHaveBeenCalled()
  })
})

