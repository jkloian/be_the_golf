import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import Button from '../shared/Button'
import { fadeIn, slideUp, staggerContainer, transition } from '../../modules/animations/variants'

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-neutral-offwhite flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        className="w-full text-center"
        style={{ maxWidth: '42rem' }}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={fadeIn}
          transition={transition}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-neutral-surface rounded-full shadow-card">
            <Target className="w-12 h-12 text-golf-emerald" />
          </div>
        </motion.div>

        <motion.h1
          variants={slideUp}
          transition={transition}
          className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-neutral-text mb-6 leading-tight"
        >
          {t('landing.title')}
        </motion.h1>

        <motion.p
          variants={slideUp}
          transition={{ ...transition, delay: 0.1 }}
          className="text-lg sm:text-xl lg:text-2xl text-neutral-textSecondary mb-10 mx-auto leading-relaxed"
          style={{ maxWidth: '42rem' }}
        >
          {t('landing.description')}
        </motion.p>

        <motion.div
          variants={fadeIn}
          transition={{ ...transition, delay: 0.2 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => {
              void navigate('/start')
            }}
            variant="primary"
            className="text-lg px-8 py-4 min-w-[200px]"
          >
            {t('landing.startButton')}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

