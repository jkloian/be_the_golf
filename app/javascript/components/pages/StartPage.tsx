import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Users, HelpCircle } from 'lucide-react'
import { api } from '../../modules/api/client'
import Button from '../shared/Button'
import { fadeIn, slideUp, staggerContainer, transition } from '../../modules/animations/variants'

export default function StartPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [firstName, setFirstName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified'>('male')
  const [handicap, setHandicap] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const submitAsync = async () => {
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
        void navigate(`/assessment/${response.assessment_session.id}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'))
      } finally {
        setLoading(false)
      }
    }

    void submitAsync()
  }

  const genderIcons = {
    male: User,
    female: Users,
    unspecified: HelpCircle,
  }

  return (
    <div className="min-h-screen bg-neutral-offwhite flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        className="w-full bg-neutral-surface rounded-2xl shadow-elevated"
        style={{ maxWidth: '24rem', padding: '2rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        <motion.h1
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-3xl sm:text-4xl font-display font-bold text-neutral-text mb-10 text-center"
        >
          {t('start.title')}
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* First Name */}
          <motion.div variants={slideUp} transition={transition}>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-neutral-text mb-2"
            >
              {t('start.firstName')}
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('start.firstNamePlaceholder')}
              className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:ring-2 focus:ring-golf-emerald focus:border-golf-emerald transition-all duration-300 bg-neutral-surface text-neutral-text placeholder-neutral-textSecondary"
            />
          </motion.div>

          {/* Gender - Pill Buttons */}
          <motion.div variants={slideUp} transition={{ ...transition, delay: 0.1 }}>
            <label className="block text-sm font-semibold text-neutral-text mb-3">
              {t('start.gender')}
            </label>
            <div className="flex flex-wrap gap-3">
              {(['male', 'female', 'unspecified'] as const).map((g) => {
                const Icon = genderIcons[g]
                const isSelected = gender === g
                return (
                  <motion.button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                      ${
                        isSelected
                          ? 'bg-golf-emerald text-white shadow-card'
                          : 'bg-neutral-surface border border-neutral-border text-neutral-text hover:border-golf-emerald hover:bg-golf-light'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t(`start.gender${g.charAt(0).toUpperCase() + g.slice(1)}`)}</span>
                  </motion.button>
                )
              })}
            </div>
            <AnimatePresence>
              {gender === 'unspecified' && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-sm text-accent-gold bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl"
                >
                  {t('start.genderWarning')}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Handicap */}
          <motion.div variants={slideUp} transition={{ ...transition, delay: 0.2 }}>
            <label
              htmlFor="handicap"
              className="block text-sm font-semibold text-neutral-text mb-2"
            >
              {t('start.handicap')}
            </label>
            <input
              type="number"
              id="handicap"
              value={handicap}
              onChange={(e) => setHandicap(e.target.value)}
              placeholder={t('start.handicapPlaceholder')}
              min="0"
              className="w-full px-4 py-3 border border-neutral-border rounded-xl focus:ring-2 focus:ring-golf-emerald focus:border-golf-emerald transition-all duration-300 bg-neutral-surface text-neutral-text placeholder-neutral-textSecondary"
            />
            <p className="mt-2 text-sm text-neutral-textSecondary">{t('start.handicapNote')}</p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div variants={fadeIn} transition={{ ...transition, delay: 0.3 }}>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              loading={loading}
            >
              {t('start.submit')}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}

