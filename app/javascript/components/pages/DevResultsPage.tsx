import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Share2, Lightbulb, Play, Target } from 'lucide-react'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import Button from '../shared/Button'
import ProcessingResults from '../shared/ProcessingResults'
import Toast from '../shared/Toast'
import { fadeIn, slideUp, staggerContainer, transition } from '../../modules/animations/variants'

// Badge Placeholder SVG Component
function BadgePlaceholder() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-60"
    >
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
    </svg>
  )
}

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

    // Record when processing starts
    processingStartTimeRef.current = Date.now()

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

  const { assessment, tips } = data

  return (
    <>
      <Toast show={showToast} />
      <div className="min-h-screen bg-neutral-offwhite overflow-y-auto">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-12">
          {/* Dev Mode Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-center"
          >
            <p className="text-sm font-semibold text-yellow-800">
              🛠️ DEV MODE: Showing {assessment.persona.code} persona ({assessment.gender})
            </p>
          </motion.div>

          {/* Phase 4: Share Button - Prominent at top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="mb-8 flex justify-center"
          >
            <Button
              onClick={handleCopyShare}
              variant="primary"
              icon={<Share2 className="w-5 h-5 sm:w-6 sm:h-6" />}
              className="w-full sm:w-auto px-8"
            >
              {t('results.share.button')}
            </Button>
          </motion.div>

          {/* Phase 2: Hero Section - Result Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="text-center mb-12 sm:mb-16"
          >
            {/* Persona Name - Bold, Heavy Typography */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...transition, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-golf-deep mb-4 sm:mb-6 leading-tight"
            >
              {t('results.hero.youAre')} <span className="text-golf-emerald">{assessment.persona.name}</span>
            </motion.h1>

            {/* Pro Match Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...transition, delay: 0.2 }}
              className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-5 bg-white/80 backdrop-blur-sm border-2 border-golf-emerald/30 rounded-2xl shadow-elevated"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-golf-emerald" />
                <span className="text-lg sm:text-xl lg:text-2xl font-display font-semibold text-golf-deep">
                  {t('results.hero.playsLike')} <span className="font-bold">{assessment.persona.display_example_pro}</span>
                </span>
              </div>
              <div className="pl-2 sm:pl-3 border-l border-golf-emerald/20">
                <BadgePlaceholder />
              </div>
            </motion.div>
          </motion.div>

          {/* Phase 3: Bento Grid Layout for Tips */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8"
          >
            {/* Practice Tips Card */}
            <motion.div
              variants={slideUp}
              transition={{ ...transition, delay: 0.3 }}
              className="md:col-span-1 bg-neutral-surface border border-neutral-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-cardHover transition-shadow"
            >
              <div className="flex items-center mb-6 space-x-3">
                <div className="p-2 bg-accent-gold/10 rounded-lg">
                  <Lightbulb className="text-accent-gold w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-text">
                  {t('results.tips.practice')}
                </h2>
              </div>
              <div className="space-y-4">
                {tips.practice.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...transition, delay: 0.4 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-golf-light/50 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-golf-emerald" />
                    </div>
                    <p className="text-base sm:text-lg text-neutral-textSecondary leading-relaxed flex-1">
                      {tip}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* On-Course Tips Card */}
            <motion.div
              variants={slideUp}
              transition={{ ...transition, delay: 0.4 }}
              className="md:col-span-1 bg-neutral-surface border border-neutral-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-cardHover transition-shadow"
            >
              <div className="flex items-center mb-6 space-x-3">
                <div className="p-2 bg-golf-emerald/10 rounded-lg">
                  <Play className="text-golf-emerald w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-text">
                  {t('results.tips.play')}
                </h2>
              </div>
              <div className="space-y-4">
                {tips.play.map((tip, index) => {
                  const isAttack = /attack|aggressive|go for it|take risks/i.test(tip)
                  const isSafe = /safe|conservative|play it safe|defensive/i.test(tip)
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...transition, delay: 0.5 + index * 0.1 }}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        isAttack
                          ? 'bg-red-50 border border-red-200/50'
                          : isSafe
                          ? 'bg-blue-50 border border-blue-200/50'
                          : 'bg-golf-light/50'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isAttack
                              ? 'bg-red-500'
                              : isSafe
                              ? 'bg-blue-500'
                              : 'bg-golf-emerald'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        {isAttack && (
                          <span className="inline-block mb-1 px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded">
                            ATTACK
                          </span>
                        )}
                        {isSafe && (
                          <span className="inline-block mb-1 px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
                            SAFE
                          </span>
                        )}
                        <p className="text-base sm:text-lg text-neutral-textSecondary leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

