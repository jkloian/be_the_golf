import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../modules/api/client'
import type { Frame, AssessmentResponse } from '../../shared/types/assessment'
import Card from '../shared/Card'
import Button from '../shared/Button'
import ProgressBar from '../shared/ProgressBar'

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">{t('common.loading')}</p>
      </div>
    )
  }

  if (!currentFrame) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{t('common.error')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('assessment.question', { current: currentFrameIndex + 1, total: frames.length })}
          </h2>

          <ProgressBar current={currentFrameIndex + 1} total={frames.length} />

          <div className="space-y-4 mb-6">
            {currentFrame.options.map((option) => {
              const isMost = mostSelected === option.key
              const isLeast = leastSelected === option.key

              return (
                <Card
                  key={option.key}
                  onClick={() => handleOptionClick(option.key)}
                  selected={isMost || isLeast}
                  className={isMost ? 'border-blue-600 bg-blue-50' : isLeast ? 'border-red-600 bg-red-50' : ''}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-gray-900">{option.text}</p>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      {isMost && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {t('assessment.mostLike')}
                        </span>
                      )}
                      {isLeast && (
                        <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                          {t('assessment.leastLike')}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              variant="primary"
              disabled={!canProceed || submitting}
            >
              {submitting
                ? t('common.loading')
                : isLastFrame
                ? t('assessment.finish')
                : t('assessment.next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

