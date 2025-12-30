import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../modules/api/client'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import Button from '../shared/Button'

export default function ResultsPage() {
  const { publicToken } = useParams<{ publicToken: string }>()
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<PublicAssessmentResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!publicToken) {
      setError('Invalid token')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const result = await api.getPublicResult(publicToken, i18n.language)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [publicToken, i18n.language, t])

  const handleCopyShare = () => {
    if (!data) return

    const shareText = t('results.share.text', {
      pro: data.assessment.persona.display_example_pro,
      persona: data.assessment.persona.name,
      url: window.location.href,
    })

    void navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">{t('common.loading')}</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || t('common.error')}</p>
          <Button onClick={() => window.location.reload()}>{t('common.tryAgain')}</Button>
        </div>
      </div>
    )
  }

  const { assessment, tips } = data
  const scores = [
    { label: t('results.scores.drive'), value: assessment.scores.D, color: 'bg-red-500' },
    { label: t('results.scores.inspire'), value: assessment.scores.I, color: 'bg-yellow-500' },
    { label: t('results.scores.steady'), value: assessment.scores.S, color: 'bg-green-500' },
    { label: t('results.scores.control'), value: assessment.scores.C, color: 'bg-blue-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('results.title')}</h1>
          {assessment.first_name && (
            <p className="text-xl text-gray-700 mb-8">
              {t('results.greeting', { name: assessment.first_name })}
            </p>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {t('results.personaTitle')}
            </h2>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {assessment.persona.name}
            </p>
            <p className="text-lg text-gray-700">
              {t('results.playLike')} <span className="font-semibold">{assessment.persona.display_example_pro}</span>
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('results.scores.title')}</h2>
            <div className="space-y-4">
              {scores.map((score) => (
                <div key={score.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{score.label}</span>
                    <span className="text-sm font-medium text-gray-700">{score.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`${score.color} h-4 rounded-full transition-all duration-500`}
                      style={{ width: `${score.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {t('results.tips.practice')}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {tips.practice.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {t('results.tips.play')}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {tips.play.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('results.share.title')}</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700 mb-2">
                {t('results.share.text', {
                  pro: assessment.persona.display_example_pro,
                  persona: assessment.persona.name,
                  url: window.location.href,
                })}
              </p>
            </div>
            <Button onClick={handleCopyShare} variant="outline">
              {copied ? '✓ Copied!' : t('results.share.copy')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

