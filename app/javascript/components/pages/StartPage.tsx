import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../../modules/api/client'
import Button from '../shared/Button'

export default function StartPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [firstName, setFirstName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified'>('male')
  const [handicap, setHandicap] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const handicapNum = handicap ? parseInt(handicap, 10) : undefined
      const response = await api.startAssessment(
        {
          first_name: firstName || undefined,
          gender,
          handicap: handicapNum,
        },
        i18n.language
      )

      // Store frames in sessionStorage for AssessmentPage to use
      sessionStorage.setItem('assessment_frames', JSON.stringify(response.frames))
      navigate(`/assessment/${response.assessment_session.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          {t('start.title')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              {t('start.firstName')}
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('start.firstNamePlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('start.gender')}
            </label>
            <div className="space-y-2">
              {(['male', 'female', 'unspecified'] as const).map((g) => (
                <label key={g} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={() => setGender(g)}
                    className="mr-2"
                  />
                  <span>{t(`start.gender${g.charAt(0).toUpperCase() + g.slice(1)}`)}</span>
                </label>
              ))}
            </div>
            {gender === 'unspecified' && (
              <p className="mt-2 text-sm text-amber-600">{t('start.genderWarning')}</p>
            )}
          </div>

          <div>
            <label htmlFor="handicap" className="block text-sm font-medium text-gray-700 mb-2">
              {t('start.handicap')}
            </label>
            <input
              type="number"
              id="handicap"
              value={handicap}
              onChange={(e) => setHandicap(e.target.value)}
              placeholder={t('start.handicapPlaceholder')}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">{t('start.handicapNote')}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? t('common.loading') : t('start.submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}

