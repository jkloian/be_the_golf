import { renderHook, act, waitFor } from '@testing-library/react'
import { useCopyToClipboard } from '../useCopyToClipboard'

// Mock navigator.clipboard
const mockWriteText = jest.fn()
const originalNavigator = global.navigator

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    // Reset navigator
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        clipboard: {
          writeText: mockWriteText,
        },
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    })
  })

  it('should copy text to clipboard', async () => {
    mockWriteText.mockResolvedValue(undefined)

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('test text')
    })

    expect(mockWriteText).toHaveBeenCalledWith('test text')
    expect(result.current.copied).toBe(true)
  })

  it('should reset copied state after 2 seconds', async () => {
    mockWriteText.mockResolvedValue(undefined)

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy('test text')
    })

    expect(result.current.copied).toBe(true)

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    await waitFor(() => {
      expect(result.current.copied).toBe(false)
    })
  })

  it('should handle errors gracefully', async () => {
    const error = new Error('Clipboard write failed')
    mockWriteText.mockRejectedValue(error)

    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await expect(result.current.copy('test text')).rejects.toThrow('Clipboard write failed')
    })

    expect(result.current.copied).toBe(false)
    expect(result.current.error).toBe(error)
  })

  it('should clear error on successful copy', async () => {
    const error = new Error('Clipboard write failed')
    mockWriteText.mockRejectedValueOnce(error)
    mockWriteText.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useCopyToClipboard())

    // First copy fails
    await act(async () => {
      await expect(result.current.copy('test text')).rejects.toThrow()
    })

    expect(result.current.error).toBe(error)

    // Second copy succeeds
    await act(async () => {
      await result.current.copy('test text')
    })

    expect(result.current.error).toBe(null)
    expect(result.current.copied).toBe(true)
  })
})

