import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Button from '../shared/Button'
import { fadeIn, slideUp, staggerContainer, transition } from '../../modules/animations/variants'

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-full bg-neutral-offwhite flex justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        className="w-full max-w-2xl text-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={fadeIn}
          transition={transition}
          className="flex justify-center mb-4 sm:mb-6"
        >
          <div className="p-3 sm:p-4 bg-neutral-surface rounded-full shadow-card flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              width="144"
              height="144"
              className="block w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36"
            >
              <circle cx="32" cy="32" r="30" fill="#1F6F54" />
              <ellipse cx="32" cy="40" rx="14" ry="6" fill="#0B1F17" />
              <ellipse cx="32" cy="42" rx="10" ry="4" fill="#000000" opacity="0.85" />
              <rect x="31" y="10" width="2" height="30" rx="1" fill="#FFFFFF" />
              <path d="M33 12 L48 18 L33 24 Z" fill="#FFFFFF" />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          variants={slideUp}
          transition={transition}
          className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-neutral-text mb-4 sm:mb-6 leading-tight"
        >
          {t('landing.title')}
        </motion.h1>

        <motion.p
          variants={slideUp}
          transition={{ ...transition, delay: 0.1 }}
          className="text-lg sm:text-xl lg:text-2xl text-neutral-textSecondary mb-4 sm:mb-6 mx-auto max-w-2xl leading-relaxed"
        >
          {t('landing.description')}
        </motion.p>

        <motion.div
          variants={fadeIn}
          transition={{ ...transition, delay: 0.2 }}
          className="flex justify-center mt-6 sm:mt-8"
        >
          <Button
            onClick={() => {
              void navigate('/start')
            }}
            variant="primary"
            className="w-full sm:w-4/5 lg:w-3/5"
          >
            {t('landing.startButton')}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

