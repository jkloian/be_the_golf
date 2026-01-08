import { useCallback } from 'react'

export interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

export interface UseWebShareReturn {
  share: (data: ShareData) => Promise<void>
  isSupported: boolean
}

/**
 * Custom hook for Web Share API
 * Provides share functionality with native sharing when available
 */
export function useWebShare(): UseWebShareReturn {
  const isSupported =
    typeof navigator !== 'undefined' &&
    'share' in navigator &&
    typeof navigator.share === 'function'

  const share = useCallback(
    async (data: ShareData): Promise<void> => {
      if (!isSupported) {
        throw new Error('Web Share API is not supported in this browser')
      }

      try {
        await navigator.share(data)
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          throw error
        }
        // AbortError is expected when user cancels - we don't need to throw
      }
    },
    [isSupported]
  )

  return { share, isSupported }
}

