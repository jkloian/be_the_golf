import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import Button from '../shared/Button'
import ProcessingResults from '../shared/ProcessingResults'
import Toast from '../shared/Toast'
import ResultsContent from './ResultsContent'

// Minimum display duration for processing animation (in milliseconds)
const MIN_PROCESSING_DISPLAY_MS = 4000 // 4 seconds

// Valid persona codes
const VALID_PERSONA_CODES = [
  'D', 'I', 'S', 'C',
  'DI', 'DS', 'CD', 'DC',
  'IS', 'IC', 'SC',
  'BALANCED'
] as const

// Persona data (dev-only, matches config/locales/personas.en.yml)
const PERSONA_DATA: Record<string, { name: string; example_pro_male: string; example_pro_female: string }> = {
  D: { name: 'Relentless Attacker', example_pro_male: 'Tiger Woods', example_pro_female: 'Annika Sörenstam' },
  I: { name: 'Charismatic Shotmaker', example_pro_male: 'Rickie Fowler', example_pro_female: 'Michelle Wie West' },
  S: { name: 'Smooth Rhythm Player', example_pro_male: 'Ernie Els', example_pro_female: 'Inbee Park' },
  C: { name: 'Master Strategist', example_pro_male: 'Bernhard Langer', example_pro_female: 'Jin Young Ko' },
  DI: { name: 'Electric Playmaker', example_pro_male: 'Rory McIlroy', example_pro_female: 'Lexi Thompson' },
  DS: { name: 'Controlled Aggressor', example_pro_male: 'Brooks Koepka', example_pro_female: 'Ariya Jutanugarn' },
  CD: { name: 'Attacking Analyst', example_pro_male: 'Jon Rahm', example_pro_female: 'Lorena Ochoa' },
  DC: { name: 'Attacking Analyst', example_pro_male: 'Jon Rahm', example_pro_female: 'Lorena Ochoa' },
  IS: { name: 'Positive Rhythm Player', example_pro_male: 'Jordan Spieth', example_pro_female: 'Danielle Kang' },
  IC: { name: 'Imaginative Planner', example_pro_male: 'Phil Mickelson', example_pro_female: 'Lydia Ko' },
  SC: { name: 'Steady Technician', example_pro_male: 'Jim Furyk', example_pro_female: 'Inbee Park' },
  BALANCED: { name: 'Complete Game Planner', example_pro_male: 'Jack Nicklaus', example_pro_female: 'Nelly Korda' },
}

// Tips data (dev-only, matches config/locales/tips.en.yml)
const TIPS_DATA: Record<string, { practice: string[]; play: string[] }> = {
  D: {
    practice: [
      'Give them challenging targets, time-pressure drills, and score-based games.',
      'Provide specific drills with measurable targets and use stats tracking.',
    ],
    play: [
      'Build a game plan with clear attack holes and safe holes.',
      'Use a hole-by-hole strategy and avoid overthinking by limiting pre-shot checkpoints.',
    ],
  },
  I: {
    practice: [
      'Use varied games, "up-and-down" challenges, and creative shot-shaping drills.',
      'Keep sessions engaging and fun.',
    ],
    play: [
      'Use cues that keep them relaxed and upbeat.',
      'Encourage a simple, feel-based swing thought, not heavy mechanics.',
    ],
  },
  S: {
    practice: [
      'Use repetition with a consistent routine, small incremental changes, and rhythm-focused drills.',
      'Protect their tempo and routine.',
    ],
    play: [
      'Encourage them to manage expectations, play to safe areas, and accept pars as wins.',
      'Protect their tempo and routine.',
    ],
  },
  C: {
    practice: [
      'Provide specific drills with measurable targets, use stats tracking, and video or numbers where possible.',
      'Use specific drills with measurable targets.',
    ],
    play: [
      'Build a hole-by-hole game plan.',
      'Guard against over-thinking by limiting them to one or two key checkpoints before each shot.',
    ],
  },
}

/**
 * Dev-only page to view results with specific persona and gender
 * Usage: /dev/results?gender=m&style=D or /dev/results?gender=f&style=DI
 * Defaults: gender=male, style=DI (if not provided)
 * Only available in development mode
 */
export default function DevResultsPage() {
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
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
    let personaCode = 'DI'
    if (styleParam && VALID_PERSONA_CODES.includes(styleParam as any)) {
      personaCode = styleParam
    }

    // Record when processing starts (only if not skipping)
    if (!shouldSkipAnimation) {
      processingStartTimeRef.current = Date.now()
    }

    // Generate mock data
    const generateMockData = async () => {
      try {
        // Get persona data from hardcoded map
        const personaInfo = PERSONA_DATA[personaCode]
        if (!personaInfo) {
          setError(`Persona data not found for style: ${personaCode}`)
          setLoading(false)
          return
        }

        // Select display example pro based on gender
        const displayExamplePro = gender === 'male' ? personaInfo.example_pro_male : personaInfo.example_pro_female

        // Get tips for the primary style (first letter of persona code)
        const primaryStyle = personaCode.charAt(0)
        const tipsInfo = TIPS_DATA[primaryStyle] || {
          practice: ['Practice tip 1', 'Practice tip 2'],
          play: ['On-course tip 1', 'On-course tip 2'],
        }

        // Generate mock scores (higher for primary style)
        const scores = {
          D: primaryStyle === 'D' ? 65 : Math.floor(Math.random() * 40) + 20,
          I: primaryStyle === 'I' ? 65 : Math.floor(Math.random() * 40) + 20,
          S: primaryStyle === 'S' ? 65 : Math.floor(Math.random() * 40) + 20,
          C: primaryStyle === 'C' ? 65 : Math.floor(Math.random() * 40) + 20,
        }

        const mockData: PublicAssessmentResponse = {
          assessment: {
            first_name: 'Dev',
            gender,
            scores,
            persona: {
              code: personaCode,
              name: personaInfo.name,
              display_example_pro: displayExamplePro,
            },
            completed_at: new Date().toISOString(),
          },
          tips: {
            practice: tipsInfo.practice,
            play: tipsInfo.play,
          },
        }

        setData(mockData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate mock data')
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

    void generateMockData()
  }, [searchParams, t])

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
      <ResultsContent
        data={data}
        onShare={handleCopyShare}
        showDevBanner={true}
        devPersonaCode={data.assessment.persona.code}
        devGender={data.assessment.gender}
      />
    </>
  )
}

