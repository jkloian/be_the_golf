import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn, transition } from '../../modules/animations/variants'

const PHRASES = [
  'Analyzing your competitive temperament...',
  'Identifying your natural performance rhythm...',
  'Decoding your on-course decision-making style...',
  'Finalizing your Signature Playing Persona...',
]

const PHRASE_INTERVAL_MS = 2000

export default function ProcessingResults() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % PHRASES.length)
    }, PHRASE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-offwhite p-4">
      <div className="flex flex-col items-center space-y-8">
        {/* Golf Ball Animation */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transition, duration: 0.5 }}
        >
          <motion.div
            className="w-24 h-24 sm:w-32 sm:h-32 relative"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* Golf Ball SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" fill="#1F6F54" />
              <circle cx="50" cy="50" r="40" fill="#0F3D2E" />
              {/* Dimples */}
              <circle cx="35" cy="35" r="3" fill="#1F6F54" opacity="0.6" />
              <circle cx="65" cy="35" r="3" fill="#1F6F54" opacity="0.6" />
              <circle cx="35" cy="65" r="3" fill="#1F6F54" opacity="0.6" />
              <circle cx="65" cy="65" r="3" fill="#1F6F54" opacity="0.6" />
              <circle cx="50" cy="25" r="2.5" fill="#1F6F54" opacity="0.5" />
              <circle cx="50" cy="75" r="2.5" fill="#1F6F54" opacity="0.5" />
              <circle cx="25" cy="50" r="2.5" fill="#1F6F54" opacity="0.5" />
              <circle cx="75" cy="50" r="2.5" fill="#1F6F54" opacity="0.5" />
            </svg>
          </motion.div>
          
          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-golf-emerald"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Cycling Text */}
        <div className="h-12 sm:h-16 flex items-center justify-center min-w-[280px] sm:min-w-[320px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPhraseIndex}
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ ...transition, duration: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl font-display font-semibold text-golf-deep text-center"
            >
              {PHRASES[currentPhraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

