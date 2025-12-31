import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Trophy, Target, Copy, Check, Lightbulb, Play } from 'lucide-react'
import { api } from '../../modules/api/client'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import Button from '../shared/Button'
import LoadingSpinner from '../shared/LoadingSpinner'
import { fadeIn, slideUp, staggerContainer, scaleIn, transition } from '../../modules/animations/variants'

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
      <div className="min-h-screen flex justify-center bg-neutral-offwhite overflow-y-auto">
        <LoadingSpinner text={t('common.loading')} size="lg" />
      </div>
    )
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
    <div className="min-h-screen bg-neutral-offwhite flex justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="mx-auto max-w-3xl w-full py-8">
        <motion.div
          className="bg-neutral-surface shadow-elevated p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
        >
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-6 sm:mb-8 lg:mb-12"
          >
            <motion.div variants={scaleIn} transition={transition} className="flex justify-center mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-accent-gold to-yellow-600 rounded-full shadow-elevated">
                <Trophy className="text-white w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              </div>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              transition={transition}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-neutral-text mb-2 sm:mb-3 text-center"
            >
              {t('results.title')}
            </motion.h1>

            {assessment.first_name && (
              <motion.p
                variants={fadeIn}
                transition={{ ...transition, delay: 0.1 }}
                className="text-xl sm:text-2xl text-neutral-textSecondary text-center"
              >
                {t('results.greeting', { name: assessment.first_name })}
              </motion.p>
            )}
          </motion.div>

          {/* Persona Section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="bg-golf-light border border-golf-emerald p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 lg:mb-12"
          >
            <motion.div variants={fadeIn} transition={transition} className="text-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-golf-deep mb-2">
                {t('results.personaTitle')}
              </h2>
            </motion.div>

            <motion.div
              variants={scaleIn}
              transition={{ ...transition, delay: 0.2 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-golf-deep mb-3">
                {assessment.persona.name}
              </p>
              <div className="flex items-center justify-center text-lg sm:text-xl text-neutral-textSecondary space-x-2">
                <Target className="text-golf-emerald w-4 h-4 sm:w-5 sm:h-5" />
                <span>
                  {t('results.playLike')}{' '}
                  <span className="font-bold text-golf-deep">
                    {assessment.persona.display_example_pro}
                  </span>
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-12"
          >
            <motion.div
              variants={slideUp}
              transition={{ ...transition, delay: 0.3 }}
              className="bg-neutral-offwhite border border-neutral-border p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl"
            >
              <div className="flex items-center mb-3 sm:mb-4 space-x-2">
                <Lightbulb className="text-accent-gold w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="text-lg sm:text-xl font-display font-semibold text-neutral-text">
                  {t('results.tips.practice')}
                </h3>
              </div>
              <ul className="space-y-3 text-neutral-textSecondary">
                {tips.practice.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-golf-emerald mt-1.5">•</span>
                    <span className="flex-1">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={slideUp}
              transition={{ ...transition, delay: 0.4 }}
              className="bg-neutral-offwhite border border-neutral-border p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl"
            >
              <div className="flex items-center mb-3 sm:mb-4 space-x-2">
                <Play className="text-golf-emerald w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="text-lg sm:text-xl font-display font-semibold text-neutral-text">
                  {t('results.tips.play')}
                </h3>
              </div>
              <ul className="space-y-3 text-neutral-textSecondary">
                {tips.play.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-golf-emerald mt-1.5">•</span>
                    <span className="flex-1">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Share Section */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ ...transition, delay: 0.5 }}
            className="border-t border-neutral-border pt-8"
          >
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-neutral-text mb-3 sm:mb-4">
              {t('results.share.title')}
            </h3>
            <div className="bg-neutral-offwhite border border-neutral-border p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
              <p className="text-sm sm:text-base text-neutral-textSecondary leading-relaxed">
                {t('results.share.text', {
                  pro: assessment.persona.display_example_pro,
                  persona: assessment.persona.name,
                  url: window.location.href,
                })}
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleCopyShare}
                variant="outline"
                icon={copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="w-full sm:w-4/5 lg:w-3/5"
              >
                {copied ? 'Copied!' : t('results.share.copy')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

