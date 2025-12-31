import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-neutral-textSecondary">
          Question {current} of {total}
        </span>
        <span className="text-xs text-neutral-textSecondary italic">
          Finding your playing style...
        </span>
      </div>
      <div className="w-full bg-neutral-border rounded-full h-1 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-golf-deep to-golf-emerald h-1 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>
    </div>
  )
}

