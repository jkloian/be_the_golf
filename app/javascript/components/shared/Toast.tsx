import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { slideUp, transition } from '../../modules/animations/variants'

interface ToastProps {
  show: boolean
  message?: string
  duration?: number
}

export default function Toast({ show, message = 'Copied!', duration = 2500 }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideUp}
          transition={transition}
        >
          <div className="bg-golf-deep text-white px-6 py-4 rounded-xl shadow-elevated flex items-center space-x-3 min-w-[200px] justify-center">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-lg">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

