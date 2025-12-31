import { motion } from 'framer-motion'
import { Share2, Lightbulb, Play, Target } from 'lucide-react'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import Button from '../shared/Button'
import GolfBadge from '../shared/GolfBadge'
import { slideUp, staggerContainer, transition } from '../../modules/animations/variants'
import { useTranslation } from 'react-i18next'

interface ResultsContentProps {
  data: PublicAssessmentResponse
  onShare: () => void
  showDevBanner?: boolean
  devPersonaCode?: string
  devGender?: string
}

export default function ResultsContent({
  data,
  onShare,
  showDevBanner = false,
  devPersonaCode,
  devGender,
}: ResultsContentProps) {
  const { t } = useTranslation()
  const { assessment, tips } = data

  return (
    <div className="min-h-screen bg-neutral-offwhite overflow-y-auto">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Dev Mode Banner */}
        {showDevBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-center"
          >
            <p className="text-sm font-semibold text-yellow-800">
              🛠️ DEV MODE: Showing {devPersonaCode} persona ({devGender})
            </p>
          </motion.div>
        )}

        {/* Phase 2: Hero Section - Result Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Persona Name - Bold, Heavy Typography */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...transition, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-golf-deep mb-4 sm:mb-6 leading-tight"
          >
            {t('results.hero.youAre')} <span className="text-golf-emerald">{assessment.persona.name}</span>
          </motion.h1>

          {/* Badge - Large and prominent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...transition, delay: 0.15 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <GolfBadge personaCode={assessment.persona.code} size={160} />
          </motion.div>

          {/* Pro Match Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...transition, delay: 0.2 }}
            className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-5 bg-white/80 backdrop-blur-sm border-2 border-golf-emerald/30 rounded-2xl shadow-elevated"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-golf-emerald" />
              <span className="text-lg sm:text-xl lg:text-2xl font-display font-semibold text-golf-deep">
                {t('results.hero.playsLike')} <span className="font-bold">{assessment.persona.display_example_pro}</span>
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Phase 3: Bento Grid Layout for Tips */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8"
        >
          {/* Practice Tips Card - Larger, spans full width on mobile */}
          <motion.div
            variants={slideUp}
            transition={{ ...transition, delay: 0.3 }}
            className="md:col-span-1 bg-neutral-surface border border-neutral-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-cardHover transition-shadow"
          >
            <div className="flex items-center mb-6 space-x-3">
              <div className="p-2 bg-accent-gold/10 rounded-lg">
                <Lightbulb className="text-accent-gold w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-text">
                {t('results.tips.practice')}
              </h2>
            </div>
            <div className="space-y-4">
              {tips.practice.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...transition, delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-golf-light/50 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-golf-emerald" />
                  </div>
                  <p className="text-base sm:text-lg text-neutral-textSecondary leading-relaxed flex-1">
                    {tip}
                  </p>
                </motion.div>
              ))}
            </div>
            {/* Stats tracking visual element */}
            <div className="mt-6 pt-6 border-t border-neutral-border">
              <div className="flex items-center justify-between text-sm text-neutral-textSecondary">
                <span className="font-medium">Track your progress</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-golf-emerald/30"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* On-Course Tips Card */}
          <motion.div
            variants={slideUp}
            transition={{ ...transition, delay: 0.4 }}
            className="md:col-span-1 bg-neutral-surface border border-neutral-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-cardHover transition-shadow"
          >
            <div className="flex items-center mb-6 space-x-3">
              <div className="p-2 bg-golf-emerald/10 rounded-lg">
                <Play className="text-golf-emerald w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-text">
                {t('results.tips.play')}
              </h2>
            </div>
            <div className="space-y-4">
              {tips.play.map((tip, index) => {
                // Check if tip mentions attack/aggressive or safe/conservative
                const isAttack = /attack|aggressive|aggressive|go for it|take risks/i.test(tip)
                const isSafe = /safe|conservative|play it safe|defensive/i.test(tip)
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...transition, delay: 0.5 + index * 0.1 }}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      isAttack
                        ? 'bg-red-50 border border-red-200/50'
                        : isSafe
                        ? 'bg-blue-50 border border-blue-200/50'
                        : 'bg-golf-light/50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isAttack
                            ? 'bg-red-500'
                            : isSafe
                            ? 'bg-blue-500'
                            : 'bg-golf-emerald'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      {isAttack && (
                        <span className="inline-block mb-1 px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded">
                          ATTACK
                        </span>
                      )}
                      {isSafe && (
                        <span className="inline-block mb-1 px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
                          SAFE
                        </span>
                      )}
                      <p className="text-base sm:text-lg text-neutral-textSecondary leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            {/* Attack vs Safe Strategy Highlight */}
            <div className="mt-6 pt-6 border-t border-neutral-border">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-medium text-neutral-textSecondary">Attack</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-medium text-neutral-textSecondary">Safe</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Share Button - At bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.6 }}
          className="mt-12 sm:mt-16 flex justify-center"
        >
          <Button
            onClick={onShare}
            variant="primary"
            icon={<Share2 className="w-5 h-5 sm:w-6 sm:h-6" />}
            className="w-full sm:w-auto px-8"
          >
            {t('results.share.button')}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

