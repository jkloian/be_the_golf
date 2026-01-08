import { useState } from 'react'
import { motion } from 'framer-motion'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import MedallionHero from './MedallionHero'
import ResultsContent from './ResultsContent'
import Button from '../shared/Button'
import { staggeredText, transition } from '../../modules/animations/variants'

interface ResultsRevealProps {
  data: PublicAssessmentResponse
  onShare: () => void
  showDevBanner?: boolean
  devPersonaCode?: string
  devGender?: string
  isShareModalOpen?: boolean
}

// Duration constants using var(--duration-golf) equivalent (300ms)
const TYPOGRAPHY_DELAY = 800 // Start typography after medallion
const TYPOGRAPHY_STAGGER = 200 // 200ms between headline and subtext
const BUTTON_DELAY = 1200 // Show continue button after typography

export default function ResultsReveal({
  data,
  onShare,
  showDevBanner = false,
  devPersonaCode,
  devGender,
  isShareModalOpen = false,
}: ResultsRevealProps) {
  const { assessment } = data
  const [showContent, setShowContent] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-offwhite overflow-y-auto">
      {!showContent ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        >
          {/* Phase 1: Medallion Hero */}
          <div className="mb-12 sm:mb-16">
            <MedallionHero personaCode={assessment.persona.code} />
          </div>

          {/* Phase 2: Typography - Headline */}
          <motion.h1
            variants={staggeredText}
            initial="initial"
            animate="animate"
            transition={{ ...transition, delay: TYPOGRAPHY_DELAY / 1000 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-golf-deep mb-4 sm:mb-6 leading-tight text-center"
            style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--font-size-5xl)',
              color: 'var(--color-neutral-text)',
            }}
          >
            You are the <span className="text-golf-emerald">{assessment.persona.name}</span>!
          </motion.h1>

          {/* Phase 2: Typography - Subtext */}
          <motion.div
            variants={staggeredText}
            initial="initial"
            animate="animate"
            transition={{
              ...transition,
              delay: (TYPOGRAPHY_DELAY + TYPOGRAPHY_STAGGER) / 1000,
            }}
            className="text-xl sm:text-2xl lg:text-3xl font-display font-semibold text-neutral-textSecondary text-center mb-8 sm:mb-12"
          >
            <p className="mb-3">
              <span className="font-bold text-golf-deep">{assessment.persona.display_example_pro}</span> shares your playing style
            </p>
            {assessment.persona.style_tagline && (
              <p className="text-lg sm:text-xl lg:text-2xl font-display font-medium text-neutral-textSecondary">
                {assessment.persona.style_tagline}
              </p>
            )}
          </motion.div>

          {/* Continue Button */}
          <motion.div
            variants={staggeredText}
            initial="initial"
            animate="animate"
            transition={{
              ...transition,
              delay: BUTTON_DELAY / 1000,
            }}
          >
            <Button onClick={() => setShowContent(true)} variant="primary">
              Continue
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ResultsContent
            data={data}
            onShare={onShare}
            showDevBanner={showDevBanner}
            devPersonaCode={devPersonaCode}
            devGender={devGender}
            isShareModalOpen={isShareModalOpen}
          />
        </motion.div>
      )}
    </div>
  )
}

