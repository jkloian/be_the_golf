import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Share2, Lightbulb, Play, Target } from 'lucide-react'
import { api } from '../../modules/api/client'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import Button from '../shared/Button'
import ProcessingResults from '../shared/ProcessingResults'
import Toast from '../shared/Toast'
import { fadeIn, slideUp, staggerContainer, scaleIn, transition } from '../../modules/animations/variants'

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
// Adjust this value to control how long the animation is shown
const MIN_PROCESSING_DISPLAY_MS = 4000 // 4 seconds

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

  const { assessment, tips } = data

  return (
    <>
      <Toast show={showToast} />
      <div className="min-h-screen bg-neutral-offwhite overflow-y-auto">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-12">
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
            {/* Practice Tips Card - Larger, spans full width on mobile */}
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
              {/* Stats tracking visual element */}
              <div className="mt-6 pt-6 border-t border-neutral-border">
                <div className="flex items-center justify-between text-sm text-neutral-textSecondary">
                  <span className="font-medium">Track your progress</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-golf-emerald/30"
                      />
                    ))}
                  </div>
                </div>
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
                  // Check if tip mentions attack/aggressive or safe/conservative
                  const isAttack = /attack|aggressive|aggressive|go for it|take risks/i.test(tip)
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
              {/* Attack vs Safe Strategy Highlight */}
              <div className="mt-6 pt-6 border-t border-neutral-border">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-medium text-neutral-textSecondary">Attack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-medium text-neutral-textSecondary">Safe</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
