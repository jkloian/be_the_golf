import { useState, useCallback } from 'react'

export interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<void>
  copied: boolean
  error: Error | null
}

/**
 * Custom hook for clipboard functionality
 * Provides copy-to-clipboard with feedback state
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const copy = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setError(null)
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to copy to clipboard')
      setError(error)
      setCopied(false)
      throw error
    }
  }, [])

  return { copy, copied, error }
}

