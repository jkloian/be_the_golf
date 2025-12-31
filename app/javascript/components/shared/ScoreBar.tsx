import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScoreBarProps {
  label: string
  value: number
  color: 'disc-drive' | 'disc-inspire' | 'disc-steady' | 'disc-control'
  delay?: number
}

const colorClasses = {
  'disc-drive': 'from-red-500 to-red-600',
  'disc-inspire': 'from-amber-500 to-amber-600',
  'disc-steady': 'from-green-500 to-green-600',
  'disc-control': 'from-blue-500 to-blue-600',
}

const bgColorClasses = {
  'disc-drive': 'bg-red-50',
  'disc-inspire': 'bg-amber-50',
  'disc-steady': 'bg-green-50',
  'disc-control': 'bg-blue-50',
}

export default function ScoreBar({
  label,
  value,
  color,
  delay = 0,
}: ScoreBarProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-neutral-text">{label}</span>
        <motion.span
          className="text-sm font-semibold text-neutral-textSecondary tabular-nums"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.3 }}
        >
          {displayValue}%
        </motion.span>
      </div>
      <div className="w-full bg-neutral-border rounded-full h-4 overflow-hidden">
        <motion.div
          className={`bg-gradient-to-r ${colorClasses[color]} h-4 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{
            delay: delay + 0.1,
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>
    </motion.div>
  )
}

