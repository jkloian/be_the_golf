import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

interface LoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({
  text,
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-golf-emerald`}
      />
      {text && (
        <p className="text-sm text-neutral-textSecondary font-medium">{text}</p>
      )}
    </div>
  )
}

