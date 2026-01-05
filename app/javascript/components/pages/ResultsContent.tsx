import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Lightbulb, Play } from 'lucide-react'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import Button from '../shared/Button'
import ViewModeToggle from '../shared/ViewModeToggle'
import MedallionHero from './MedallionHero'
import { staggerContainer, transition, contentSwitch, staggeredList, buttonShimmer } from '../../modules/animations/variants'
import { useTranslation } from 'react-i18next'

type ViewMode = 'PRACTICE' | 'COURSE'

interface ResultsContentProps {
  data: PublicAssessmentResponse
  onShare: () => void
  showDevBanner?: boolean
  devPersonaCode?: string
  devGender?: string
}

// Get persona color for green glow effect
function getPersonaColor(personaCode: string): string {
  switch (personaCode) {
    case 'D':
      return 'var(--color-disc-drive)'
    case 'I':
      return 'var(--color-disc-inspire)'
    case 'S':
      return 'var(--color-disc-steady)'
    case 'C':
      return 'var(--color-disc-control)'
    case 'DI':
    case 'DS':
      return 'var(--color-disc-drive)'
    case 'CD':
    case 'DC':
      return 'var(--color-disc-control)'
    case 'IS':
    case 'IC':
      return 'var(--color-disc-inspire)'
    case 'SC':
      return 'var(--color-disc-steady)'
    case 'BALANCED':
      return 'var(--color-disc-drive)'
    default:
      return 'var(--color-golf-emerald)'
  }
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
  const [viewMode, setViewMode] = useState<ViewMode>('PRACTICE')
  const personaColor = getPersonaColor(assessment.persona.code)

  return (
    <div className="min-h-screen bg-neutral-offwhite overflow-y-auto relative">
      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Fixed Medallion at top */}
      <MedallionHero personaCode={assessment.persona.code} isFixed={true} />

      {/* Spacer for fixed medallion */}
      <div className="h-32 sm:h-40" />

      <div className="relative z-10 mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-12">
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

        {/* Hero Section - Persona Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="text-center mb-8 sm:mb-12"
        >
          {/* Persona Name - Bold, Heavy Typography */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...transition, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-golf-deep mb-4 sm:mb-6 leading-tight"
          >
            You are the <span className="text-golf-emerald">{assessment.persona.name}</span>
          </motion.h1>

          {/* Pro Match - Text style like reveal page */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition, delay: 0.15 }}
            className="text-xl sm:text-2xl lg:text-3xl font-display font-semibold text-neutral-textSecondary mb-5"
          >
            Your style aligns with <span className="font-bold text-golf-deep">{assessment.persona.display_example_pro}</span>
          </motion.p>

          {/* ViewMode Toggle - ~20px below persona title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.2 }}
            className="flex justify-center"
          >
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </motion.div>
        </motion.div>

        {/* Animated Content Switch */}
        <AnimatePresence mode="wait">
          {viewMode === 'PRACTICE' ? (
            <motion.div
              key="practice"
              variants={contentSwitch}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              {/* Practice Tips Card with green glow theme */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="bg-neutral-surface border border-neutral-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-cardHover transition-shadow relative overflow-hidden"
                style={{
                  boxShadow: `0 2px 8px 0 rgba(15, 61, 46, 0.06), 0 0 20px ${personaColor}15`,
                }}
              >
                {/* Subtle green glow accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-60"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${personaColor} 50%, transparent 100%)`,
                  }}
                />

                <div className="flex items-center mb-6 space-x-3">
                  <div className="p-2 bg-accent-gold/10 rounded-lg">
                    <Lightbulb className="text-accent-gold w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-text">
                    {t('results.tips.practice')}
                  </h2>
                </div>
                <div className="space-y-6">
                  {/* Do Section */}
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-text">
                      {t('results.tips.do')}
                    </h3>
                    {tips.practice.dos.map((tip, index) => (
                      <motion.div
                        key={`do-${index}`}
                        variants={staggeredList}
                        transition={{ ...transition, delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-golf-light/50 rounded-lg"
                        style={{
                          boxShadow: `0 1px 3px ${personaColor}08`,
                        }}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className="w-2 h-2 rounded-full bg-green-500"
                          />
                        </div>
                        <p className="text-base sm:text-lg text-neutral-textSecondary leading-relaxed flex-1">
                          {tip}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Don't Section */}
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-text">
                      {t('results.tips.dont')}
                    </h3>
                    {tips.practice.donts.map((tip, index) => (
                      <motion.div
                        key={`dont-${index}`}
                        variants={staggeredList}
                        transition={{ ...transition, delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-golf-light/50 rounded-lg"
                        style={{
                          boxShadow: `0 1px 3px ${personaColor}08`,
                        }}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className="w-2 h-2 rounded-full bg-red-500"
                          />
                        </div>
                        <p className="text-base sm:text-lg text-neutral-textSecondary leading-relaxed flex-1">
                          {tip}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="course"
              variants={contentSwitch}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              {/* Course Tips Card with tactical map theme */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="bg-neutral-surface border-2 border-neutral-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-card hover:shadow-cardHover transition-shadow"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(247, 249, 248, 0.98))',
                }}
              >
                <div className="flex items-center mb-6 space-x-3">
                  <div className="p-2 bg-golf-emerald/10 rounded-lg">
                    <Play className="text-golf-emerald w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-text">
                    {t('results.tips.play')}
                  </h2>
                </div>
                <div className="space-y-6">
                  {/* Do Section */}
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-text">
                      {t('results.tips.do')}
                    </h3>
                    {tips.play.dos.map((tip, index) => (
                      <motion.div
                        key={`do-${index}`}
                        variants={staggeredList}
                        transition={{ ...transition, delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-golf-light/50 rounded-lg"
                        style={{
                          boxShadow: `0 1px 3px ${personaColor}08`,
                        }}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className="w-2 h-2 rounded-full bg-green-500"
                          />
                        </div>
                        <p className="text-base sm:text-lg text-neutral-textSecondary leading-relaxed flex-1">
                          {tip}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Don't Section */}
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-text">
                      {t('results.tips.dont')}
                    </h3>
                    {tips.play.donts.map((tip, index) => (
                      <motion.div
                        key={`dont-${index}`}
                        variants={staggeredList}
                        transition={{ ...transition, delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-golf-light/50 rounded-lg"
                        style={{
                          boxShadow: `0 1px 3px ${personaColor}08`,
                        }}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className="w-2 h-2 rounded-full bg-red-500"
                          />
                        </div>
                        <p className="text-base sm:text-lg text-neutral-textSecondary leading-relaxed flex-1">
                          {tip}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Button with shimmer effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.3 }}
          className="mt-12 sm:mt-16 flex justify-center"
        >
          <div className="relative inline-block overflow-hidden rounded-xl">
            <Button
              onClick={onShare}
              variant="primary"
              icon={<Share2 className="w-5 h-5 sm:w-6 sm:h-6" />}
              className="w-full sm:w-auto px-8 relative z-10"
            >
              {t('results.share.button')}
            </Button>
            <motion.div
              variants={buttonShimmer}
              animate="animate"
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
