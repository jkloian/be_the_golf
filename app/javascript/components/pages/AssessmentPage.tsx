import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../modules/api/client'
import type { Frame, AssessmentResponse } from '../../shared/types/assessment'
import OptionCard from '../shared/OptionCard'
import Button from '../shared/Button'
import ProgressBar from '../shared/ProgressBar'
import LoadingSpinner from '../shared/LoadingSpinner'
import { fadeIn, transition } from '../../modules/animations/variants'

export default function AssessmentPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [frames, setFrames] = useState<Frame[]>([])
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [responses, setResponses] = useState<AssessmentResponse[]>([])
  const [mostSelected, setMostSelected] = useState<string | null>(null)
  const [leastSelected, setLeastSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load frames from sessionStorage (set by StartPage)
    const loadFrames = () => {
      const storedFrames = sessionStorage.getItem('assessment_frames')
      if (storedFrames) {
        try {
          const parsedFrames = JSON.parse(storedFrames) as Frame[]
          setFrames(parsedFrames)
          setLoading(false)
        } catch {
          setError('Failed to load assessment frames')
          setLoading(false)
        }
      } else {
        setError('No assessment data found. Please start a new assessment.')
        setLoading(false)
      }
    }

    // Use setTimeout to defer state updates and avoid synchronous setState in effect
    const timeoutId = setTimeout(loadFrames, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const handleOptionClick = (optionKey: string) => {
    if (!mostSelected) {
      setMostSelected(optionKey)
    } else if (!leastSelected && optionKey !== mostSelected) {
      setLeastSelected(optionKey)
    } else if (optionKey === mostSelected) {
      // Toggle off most
      setMostSelected(null)
      setLeastSelected(null)
    } else if (optionKey === leastSelected) {
      // Toggle off least
      setLeastSelected(null)
    } else {
      // Change selection
      if (optionKey !== mostSelected) {
        setLeastSelected(optionKey)
      }
    }
  }

  const handleFinish = async (finalResponses: AssessmentResponse[]) => {
    if (!sessionId) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await api.completeAssessment(
        parseInt(sessionId, 10),
        finalResponses,
        i18n.language
      )

      void navigate(`/results/${response.assessment_session.public_token}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (mostSelected && leastSelected) {
      const currentFrame = frames[currentFrameIndex]
      const newResponse: AssessmentResponse = {
        frame_index: currentFrame.index,
        most_choice_key: mostSelected,
        least_choice_key: leastSelected,
      }

      const updatedResponses = [...responses]
      updatedResponses[currentFrameIndex] = newResponse
      setResponses(updatedResponses)

      if (currentFrameIndex < frames.length - 1) {
        setCurrentFrameIndex(currentFrameIndex + 1)
        setMostSelected(null)
        setLeastSelected(null)
      } else {
        void handleFinish(updatedResponses)
      }
    }
  }

  const currentFrame = frames[currentFrameIndex]
  const isLastFrame = currentFrameIndex === frames.length - 1
  const canProceed = mostSelected && leastSelected

  if (loading) {
    return (
      <div className="min-h-full flex justify-center bg-neutral-offwhite">
        <LoadingSpinner text={t('common.loading')} size="lg" />
      </div>
    )
  }

  if (!currentFrame) {
    return (
      <div className="min-h-full flex justify-center bg-neutral-offwhite">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{t('common.error')}</p>
          <Button onClick={() => void navigate('/start')} variant="primary">
            {t('common.tryAgain')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-neutral-offwhite flex justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto">
        <motion.div
          className="bg-neutral-surface shadow-elevated p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
        >
          {/* Question Header */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
              className="mb-6 sm:mb-8 lg:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-text mb-2 sm:mb-3 leading-tight">
              {t('assessment.question', {
                current: currentFrameIndex + 1,
                total: frames.length,
              })}
            </h2>
            <p className="text-sm text-neutral-textSecondary leading-relaxed">
              Select the option that is <strong className="text-neutral-text">most</strong> like
              you and the one that is <strong className="text-neutral-text">least</strong> like you
            </p>
          </motion.div>

          {/* Progress */}
          <ProgressBar current={currentFrameIndex + 1} total={frames.length} />

          {/* Options */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrameIndex}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeIn}
              className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 lg:mb-8"
            >
              {currentFrame.options.map((option, index) => {
                const isMost = mostSelected === option.key
                const isLeast = leastSelected === option.key

                return (
                  <OptionCard
                    key={option.key}
                    onClick={() => handleOptionClick(option.key)}
                    isMost={isMost}
                    isLeast={isLeast}
                    index={index}
                  >
                    {option.text}
                  </OptionCard>
                )
              })}
            </motion.div>
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-lg sm:rounded-xl mb-4 sm:mb-6"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          <div className="flex justify-center pt-4 border-t border-neutral-border">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleNext}
                variant="primary"
                disabled={!canProceed || submitting}
                loading={submitting}
                className="w-full sm:w-4/5 lg:w-3/5"
              >
                {isLastFrame ? t('assessment.finish') : t('assessment.next')}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

