import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../modules/api/client'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import Button from '../shared/Button'
import ProcessingResults from '../shared/ProcessingResults'
import Toast from '../shared/Toast'
import ResultsReveal from './ResultsReveal'

// Minimum display duration for processing animation (in milliseconds)
const MIN_PROCESSING_DISPLAY_MS = 4000 // 4 seconds

// Valid persona codes
const VALID_PERSONA_CODES = [
  'D', 'I', 'S', 'C',
  'DI', 'DS', 'CD', 'DC',
  'IS', 'IC', 'SC',
  'BALANCED'
] as const

/**
 * Generate mock scores based on persona code
 * - Single style (D, I, S, C): primary = 65-75, others = 30-45
 * - Combination (DI, DS, etc.): both styles = 60-70, others = 30-45
 * - Balanced: all = 50-55
 */
function generateScoresForPersona(personaCode: string): { D: number; I: number; S: number; C: number } {
  const getRandomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
  const getRandomLow = () => getRandomInRange(30, 45)
  
  if (personaCode === 'BALANCED') {
    return {
      D: getRandomInRange(50, 55),
      I: getRandomInRange(50, 55),
      S: getRandomInRange(50, 55),
      C: getRandomInRange(50, 55),
    }
  }
  
  if (personaCode.length === 1) {
    // Single style persona
    const primary = personaCode as 'D' | 'I' | 'S' | 'C'
    return {
      D: primary === 'D' ? getRandomInRange(65, 75) : getRandomLow(),
      I: primary === 'I' ? getRandomInRange(65, 75) : getRandomLow(),
      S: primary === 'S' ? getRandomInRange(65, 75) : getRandomLow(),
      C: primary === 'C' ? getRandomInRange(65, 75) : getRandomLow(),
    }
  }
  
  // Combination persona (2 styles)
  const style1 = personaCode[0] as 'D' | 'I' | 'S' | 'C'
  const style2 = personaCode[1] as 'D' | 'I' | 'S' | 'C'
  return {
    D: style1 === 'D' || style2 === 'D' ? getRandomInRange(60, 70) : getRandomLow(),
    I: style1 === 'I' || style2 === 'I' ? getRandomInRange(60, 70) : getRandomLow(),
    S: style1 === 'S' || style2 === 'S' ? getRandomInRange(60, 70) : getRandomLow(),
    C: style1 === 'C' || style2 === 'C' ? getRandomInRange(60, 70) : getRandomLow(),
  }
}

/**
 * Dev-only page to view results with specific persona and gender
 * Usage: /dev/results?gender=m&style=D or /dev/results?gender=f&style=DI
 * Defaults: gender=male, style=DI (if not provided)
 * Only available in development mode
 */
export default function DevResultsPage() {
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<PublicAssessmentResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const processingStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    // Parse query parameters with defaults
    const genderParam = searchParams.get('gender')?.toLowerCase() || 'm'
    const styleParam = searchParams.get('style')?.toUpperCase() || 'DI'
    const skipParam = searchParams.get('skip')

    // Check if animation should be skipped
    const shouldSkipAnimation = skipParam === '1' || skipParam === 'true'

    // Validate and normalize gender (default to male)
    let gender: 'male' | 'female' = 'male'
    if (genderParam && ['m', 'f', 'male', 'female'].includes(genderParam)) {
      gender = genderParam === 'm' || genderParam === 'male' ? 'male' : 'female'
    }

    // Validate and normalize style (default to DI)
    let personaCode: typeof VALID_PERSONA_CODES[number] = 'DI'
    if (styleParam && VALID_PERSONA_CODES.includes(styleParam as typeof VALID_PERSONA_CODES[number])) {
      personaCode = styleParam as typeof VALID_PERSONA_CODES[number]
    }

    // Record when processing starts (only if not skipping)
    if (!shouldSkipAnimation) {
      processingStartTimeRef.current = Date.now()
    }

    // Fetch real data from API
    const fetchDevData = async () => {
      try {
        // Generate scores based on persona code
        const scores = generateScoresForPersona(personaCode)

        // Call the dev API endpoint to get real tips
        const result = await api.getDevPreview(scores, personaCode, gender, i18n.language)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dev data')
      } finally {
        // Skip animation if skip parameter is set
        if (shouldSkipAnimation) {
          setLoading(false)
        } else {
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
    }

    void fetchDevData()
  }, [searchParams, t, i18n.language])

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
        <div className="text-center p-8">
          <p className="text-base sm:text-lg text-red-600 mb-3 sm:mb-4">{error || 'Error loading data'}</p>
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
      <ResultsReveal
        data={data}
        onShare={handleCopyShare}
        showDevBanner={true}
        devPersonaCode={data.assessment.persona.code}
        devGender={data.assessment.gender}
      />
    </>
  )
}

