import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../shared/Button'

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          {t('landing.title')}
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          {t('landing.description')}
        </p>
        <Button
          onClick={() => {
            void navigate('/start')
          }}
          variant="primary"
          className="text-lg px-8 py-4"
        >
          {t('landing.startButton')}
        </Button>
      </div>
    </div>
  )
}

