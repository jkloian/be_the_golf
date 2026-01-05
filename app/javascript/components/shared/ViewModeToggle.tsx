import { motion } from 'framer-motion'

type ViewMode = 'PRACTICE' | 'COURSE'

interface ViewModeToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export default function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  const isPractice = value === 'PRACTICE'

  return (
    <div className="relative inline-flex items-center rounded-full p-1 bg-golf-deep/20 backdrop-blur-sm border border-golf-deep/30">
      {/* Active indicator */}
      <motion.div
        layout
        className="absolute inset-y-1 rounded-full"
        style={{
          width: 'calc(50% - 4px)',
          left: isPractice ? '4px' : 'calc(50% + 4px)',
          background: isPractice
            ? 'linear-gradient(135deg, var(--color-golf-deep) 0%, var(--color-golf-deep) 100%)'
            : 'linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-golf-deep) 100%)',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      />

      {/* Practice Protocol Button */}
      <button
        onClick={() => onChange('PRACTICE')}
        className={`relative z-10 px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition-colors ${
          isPractice
            ? 'text-white'
            : 'text-golf-deep/70 hover:text-golf-deep'
        }`}
      >
        Practice Protocol
      </button>

      {/* Course Strategy Button */}
      <button
        onClick={() => onChange('COURSE')}
        className={`relative z-10 px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition-colors ${
          !isPractice
            ? 'text-white'
            : 'text-golf-deep/70 hover:text-golf-deep'
        }`}
      >
        Course Strategy
      </button>
    </div>
  )
}

