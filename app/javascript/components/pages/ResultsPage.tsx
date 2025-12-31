import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../modules/api/client'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import Button from '../shared/Button'
import ProcessingResults from '../shared/ProcessingResults'
import Toast from '../shared/Toast'
import ResultsContent from './ResultsContent'

// Minimum display duration for processing animation (in milliseconds)
// Ensures all 4 loading phrases are shown (4 phrases × 2 seconds each = 8 seconds minimum)
const MIN_PROCESSING_DISPLAY_MS = 8500 // 8.5 seconds to show all phrases with buffer

export default function ResultsPage() {
  const { publicToken } = useParams<{ publicToken: string }>()
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<PublicAssessmentResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const processingStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!publicToken) {
      setError('Invalid token')
      setLoading(false)
      return
    }

    // Record when processing starts
    processingStartTimeRef.current = Date.now()

    const fetchData = async () => {
      try {
        const result = await api.getPublicResult(publicToken, i18n.language)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'))
      } finally {
        // Ensure minimum display time has elapsed before hiding processing animation
        const elapsed = Date.now() - (processingStartTimeRef.current || Date.now())
        const remaining = Math.max(0, MIN_PROCESSING_DISPLAY_MS - elapsed)
        
        if (remaining > 0) {
          setTimeout(() => {
            setLoading(false)
          }, remaining)
        } else {
          setLoading(false)
        }
      }
    }

    void fetchData()
  }, [publicToken, i18n.language, t])

  const handleCopyShare = () => {
    if (!data) return

    void navigator.clipboard.writeText(window.location.href).then(() => {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    })
  }

  // Phase 1: Loading State with ProcessingResults
  if (loading) {
    return <ProcessingResults />
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex justify-center bg-neutral-offwhite overflow-y-auto">
        <div className="text-center">
          <p className="text-base sm:text-lg text-red-600 mb-3 sm:mb-4">{error || t('common.error')}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            {t('common.tryAgain')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toast show={showToast} />
      <ResultsContent data={data} onShare={handleCopyShare} />
    </>
  )
}
