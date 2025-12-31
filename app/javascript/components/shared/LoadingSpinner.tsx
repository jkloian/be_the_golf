import { Loader2 } from 'lucide-react'

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
    sm: 'w-3 h-3 sm:w-4 sm:h-4',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-7 h-7 sm:w-8 sm:h-8',
  }

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-2 sm:space-y-3 ${className}`}
    >
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-golf-emerald`}
      />
      {text && (
        <p className="text-xs sm:text-sm text-neutral-textSecondary font-medium">{text}</p>
      )}
    </div>
  )
}

