import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  variant?: 'default' | 'most' | 'least'
}

export default function Card({
  children,
  className = '',
  onClick,
  selected,
  variant = 'default',
}: CardProps) {
  const baseClasses =
    'p-5 rounded-golf border-2 transition-all duration-golf cursor-pointer min-h-[60px] focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation'
  
  const variantClasses = {
    default: selected
      ? 'border-golf-green-500 bg-golf-green-50 shadow-medium'
      : 'border-warm-200 bg-white hover:border-golf-green-300 hover:shadow-soft hover:-translate-y-0.5',
    most: selected
      ? 'border-golf-green-500 bg-golf-green-50 shadow-medium ring-2 ring-golf-green-200'
      : 'border-warm-200 bg-white hover:border-golf-green-300 hover:shadow-soft hover:-translate-y-0.5',
    least: selected
      ? 'border-disc-drive bg-red-50 shadow-medium ring-2 ring-red-200'
      : 'border-warm-200 bg-white hover:border-red-300 hover:shadow-soft hover:-translate-y-0.5',
  }

  const focusRingClass = selected
    ? variant === 'most'
      ? 'focus:ring-golf-green-500'
      : variant === 'least'
      ? 'focus:ring-red-500'
      : 'focus:ring-golf-green-500'
    : 'focus:ring-golf-green-400'

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${focusRingClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}

