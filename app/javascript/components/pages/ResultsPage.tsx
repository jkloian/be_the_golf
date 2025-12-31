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
      <div className="min-h-screen flex items-center justify-center bg-neutral-offwhite">
        <LoadingSpinner text={t('common.loading')} size="lg" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-offwhite">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || t('common.error')}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            {t('common.tryAgain')}
          </Button>
        </div>
      </div>
    )
  }

  const { assessment, tips } = data

  return (
    <div className="min-h-screen bg-neutral-offwhite p-4 sm:p-6">
      <div className="mx-auto py-8" style={{ maxWidth: '48rem' }}>
        <motion.div
          className="bg-neutral-surface rounded-2xl shadow-elevated"
          style={{ padding: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
        >
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mb-12"
          >
            <motion.div variants={scaleIn} transition={transition} className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-accent-gold to-yellow-600 rounded-full shadow-elevated">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              transition={transition}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-neutral-text mb-3 text-center"
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
            className="mb-12 bg-golf-light rounded-2xl border border-golf-emerald"
            style={{ padding: '2rem' }}
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
              <div className="flex items-center justify-center gap-2 text-lg sm:text-xl text-neutral-textSecondary">
                <Target className="w-5 h-5 text-golf-emerald" />
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
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <motion.div
              variants={slideUp}
              transition={{ ...transition, delay: 0.3 }}
              className="bg-neutral-offwhite rounded-xl border border-neutral-border"
              style={{ padding: '2rem' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent-gold" />
                <h3 className="text-xl font-display font-semibold text-neutral-text">
                  {t('results.tips.practice')}
                </h3>
              </div>
              <ul className="space-y-3 text-neutral-textSecondary">
                {tips.practice.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-golf-emerald mt-1.5">•</span>
                    <span className="flex-1">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={slideUp}
              transition={{ ...transition, delay: 0.4 }}
              className="bg-neutral-offwhite rounded-xl border border-neutral-border"
              style={{ padding: '2rem' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-golf-emerald" />
                <h3 className="text-xl font-display font-semibold text-neutral-text">
                  {t('results.tips.play')}
                </h3>
              </div>
              <ul className="space-y-3 text-neutral-textSecondary">
                {tips.play.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
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
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-neutral-text mb-4">
              {t('results.share.title')}
            </h3>
            <div className="bg-neutral-offwhite rounded-xl mb-4 border border-neutral-border" style={{ padding: '1.5rem' }}>
              <p className="text-sm sm:text-base text-neutral-textSecondary leading-relaxed">
                {t('results.share.text', {
                  pro: assessment.persona.display_example_pro,
                  persona: assessment.persona.name,
                  url: window.location.href,
                })}
              </p>
            </div>
            <Button
              onClick={handleCopyShare}
              variant="outline"
              icon={copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              {copied ? 'Copied!' : t('results.share.copy')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

