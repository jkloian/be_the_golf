import { motion, useScroll, useTransform } from 'framer-motion'
import { medallionZoom, shimmer } from '../../modules/animations/variants'
import { getPersonaBadgePath } from '../../modules/utils/personaBadgeMap'

interface MedallionHeroProps {
  personaCode: string
  isFixed?: boolean
}

// Get colors for persona code (matching GolfBadge logic)
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
      return 'var(--color-disc-drive)'
    case 'DS':
      return 'var(--color-disc-drive)'
    case 'CD':
      return 'var(--color-disc-control)'
    case 'IS':
      return 'var(--color-disc-inspire)'
    case 'IC':
      return 'var(--color-disc-inspire)'
    case 'SC':
      return 'var(--color-disc-steady)'
    case 'BALANCED':
      return 'var(--color-disc-drive)'
    default:
      return 'var(--color-neutral-text)'
  }
}

export default function MedallionHero({ personaCode, isFixed = false }: MedallionHeroProps) {
  const badgePath = getPersonaBadgePath(personaCode)
  const primaryColor = getPersonaColor(personaCode)

  // Scroll-based animations for fixed medallion
  const { scrollY } = useScroll()
  const rotateY = useTransform(scrollY, [0, 500], [0, 360])
  const scale = useTransform(scrollY, [0, 500], [1, 0.7])

  return (
    <div className={`${isFixed ? 'fixed top-0 left-0 right-0 z-50 pt-4 pb-2' : 'relative'} flex items-center justify-center w-full ${isFixed ? 'bg-neutral-offwhite/80 backdrop-blur-sm' : ''}`}>
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Radial gradient glow behind medallion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          }}
        />

        {/* Medallion image with zoom animation and scroll effects */}
        <motion.div
          variants={!isFixed ? medallionZoom : undefined}
          initial={!isFixed ? 'initial' : false}
          animate={!isFixed ? 'animate' : false}
          className="relative z-10"
          style={{
            ...(isFixed && {
              rotateY,
              scale,
              transformStyle: 'preserve-3d',
            }),
          }}
        >
          <img
            src={`/${badgePath}`}
            alt="Persona medallion"
            className={`${isFixed ? 'w-32 h-32 sm:w-40 sm:h-40' : 'w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72'} drop-shadow-elevated`}
            style={{
              transform: isFixed ? 'translateZ(0)' : undefined,
            }}
          />

          {/* Shimmer effect overlay */}
          {!isFixed && (
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
                  width: '50%',
                  height: '100%',
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

