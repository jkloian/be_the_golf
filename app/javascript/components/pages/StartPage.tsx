import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Users, HelpCircle, Target } from 'lucide-react'
import { api } from '../../modules/api/client'
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-offwhite via-golf-light/30 to-neutral-offwhite flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        className="w-full max-w-3xl bg-white shadow-elevated relative overflow-hidden p-6 sm:p-10 lg:p-14 rounded-xl sm:rounded-2xl lg:rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        {/* Subtle golf-themed background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-golf-emerald/5 to-transparent rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-tr from-golf-light/40 to-transparent rounded-full blur-2xl -z-0" />

        <div className="relative z-10">
          {/* Golf icon accent */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="flex justify-center mb-4 sm:mb-6"
          >
            <div className="p-3 sm:p-4 bg-gradient-to-br from-golf-emerald/10 to-golf-light rounded-lg sm:rounded-xl lg:rounded-2xl">
              <Target className="text-golf-emerald w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="text-4xl sm:text-5xl font-display font-bold text-neutral-text mb-3 sm:mb-4 text-center"
          >
            {t('start.title')}
          </motion.h1>

          <motion.form
            onSubmit={handleSubmit}
            className="mt-6 sm:mt-8 lg:mt-10 flex flex-col space-y-4 sm:space-y-6 lg:space-y-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* First Name */}
            <motion.div variants={slideUp} transition={transition}>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('start.firstNamePlaceholder')}
                className="w-full px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-7 border-2 border-neutral-border rounded-lg sm:rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-golf-emerald/20 focus:border-golf-emerald transition-all duration-300 bg-gradient-to-br from-white to-golf-light/20 text-neutral-text placeholder-neutral-textSecondary text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium shadow-soft hover:shadow-card min-h-[64px] sm:min-h-[72px]"
              />
            </motion.div>

            {/* Gender - Pill Buttons */}
            <motion.div variants={slideUp} transition={{ ...transition, delay: 0.1 }}>
              <div className="flex flex-wrap -m-2 sm:-m-3">
                {(['male', 'female', 'unspecified'] as const).map((g) => {
                  const Icon = genderIcons[g]
                  const isSelected = gender === g
                  return (
                    <motion.button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        flex items-center justify-center font-bold transition-all duration-300 min-h-[56px] sm:min-h-[64px] flex-1 m-2 sm:m-3 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-2xl text-lg sm:text-xl lg:text-2xl
                        ${
                          isSelected
                            ? 'bg-gradient-to-br from-golf-emerald to-[#15803d] text-white shadow-lg shadow-golf-emerald/30'
                            : 'bg-white border-2 border-neutral-border text-neutral-text hover:border-golf-emerald hover:bg-gradient-to-br hover:from-golf-light/50 hover:to-white shadow-soft'
                        }
                      `}
                    >
                      <Icon className={`${isSelected ? 'text-white' : 'text-golf-emerald'} w-5 h-5 sm:w-6 sm:h-6`} />
                      <span className={isSelected ? 'text-white' : ''}>{t(`start.gender${g.charAt(0).toUpperCase() + g.slice(1)}`)}</span>
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
                    className="mt-4 sm:mt-5 text-sm sm:text-base text-accent-gold bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-soft"
                  >
                    {t('start.genderWarning')}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Handicap */}
            <motion.div variants={slideUp} transition={{ ...transition, delay: 0.2 }}>
              <input
                type="number"
                id="handicap"
                value={handicap}
                onChange={(e) => setHandicap(e.target.value)}
                placeholder={t('start.handicapPlaceholder')}
                min="0"
                className="w-full px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-7 border-2 border-neutral-border rounded-lg sm:rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-golf-emerald/20 focus:border-golf-emerald transition-all duration-300 bg-gradient-to-br from-white to-golf-light/20 text-neutral-text placeholder-neutral-textSecondary text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium shadow-soft hover:shadow-card min-h-[64px] sm:min-h-[72px]"
              />
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-textSecondary leading-relaxed">{t('start.handicapNote')}</p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-4 text-base sm:text-lg rounded-lg sm:rounded-xl lg:rounded-2xl shadow-soft"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div variants={fadeIn} transition={{ ...transition, delay: 0.3 }} className="mt-3 sm:mt-4 flex justify-center">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-golf-emerald to-[#15803d] text-white font-bold shadow-lg shadow-golf-emerald/30 hover:shadow-xl hover:shadow-golf-emerald/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[64px] sm:min-h-[72px] px-6 py-4 sm:px-7 sm:py-5 lg:px-8 lg:py-6 text-lg sm:text-2xl lg:text-3xl rounded-lg sm:rounded-xl lg:rounded-2xl w-full sm:w-4/5 lg:w-3/5"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-white">Starting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-white">{t('start.submit')}</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  )
}

