import { motion } from 'framer-motion'
import { CheckCircle2, MinusCircle } from 'lucide-react'
import type { ReactNode } from 'react'

interface OptionCardProps {
  children: ReactNode
  onClick?: () => void
  isMost?: boolean
  isLeast?: boolean
  index?: number
}

export default function OptionCard({
  children,
  onClick,
  isMost = false,
  isLeast = false,
  index = 0,
}: OptionCardProps) {
  const isSelected = isMost || isLeast

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={!isSelected ? { y: -2 } : {}}
      whileTap={{ scale: 0.98 }}
    >
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        }}
        className={`
          relative p-5 rounded-xl cursor-pointer transition-all duration-300
          min-h-[72px] flex items-center
          ${
            isMost
              ? 'bg-golf-light border-2 border-golf-emerald shadow-card'
              : isLeast
              ? 'bg-neutral-surface border-2 border-neutral-border shadow-card'
              : 'bg-neutral-surface border border-neutral-border hover:border-golf-emerald hover:shadow-cardHover'
          }
          focus:outline-none focus:ring-2 focus:ring-golf-emerald focus:ring-offset-2
        `}
      >
        <div className="flex-1 pr-4">
          <p
            className={`text-base leading-relaxed ${
              isMost
                ? 'text-golf-deep font-medium'
                : isLeast
                ? 'text-neutral-textSecondary'
                : 'text-neutral-text'
            }`}
          >
            {children}
          </p>
        </div>

        {isMost && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex-shrink-0"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-golf-emerald text-white rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Most like me</span>
            </div>
          </motion.div>
        )}

        {isLeast && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex-shrink-0"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-textSecondary text-white rounded-full text-xs font-semibold">
              <MinusCircle className="w-4 h-4" />
              <span>Least like me</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

