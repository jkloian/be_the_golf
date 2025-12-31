import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  children: ReactNode
  icon?: ReactNode
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  icon,
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-5 px-6 py-6 rounded-[16px] font-bold text-3xl transition-all duration-300 min-h-[72px] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-golf-emerald to-[#15803d] text-white hover:shadow-xl hover:shadow-golf-emerald/40 active:scale-[0.98] focus:ring-golf-emerald shadow-lg shadow-golf-emerald/30',
    secondary:
      'bg-gradient-to-r from-golf-emerald to-[#15803d] text-white hover:shadow-xl hover:shadow-golf-emerald/40 active:scale-[0.98] focus:ring-golf-emerald shadow-lg shadow-golf-emerald/30',
    outline:
      'border-2 border-golf-emerald text-golf-deep hover:bg-golf-light hover:border-golf-deep active:scale-[0.98] focus:ring-golf-emerald bg-neutral-surface',
    ghost:
      'text-golf-deep hover:bg-golf-light active:scale-[0.98] focus:ring-golf-emerald',
  }

  const isWhiteText = variant === 'primary' || variant === 'secondary'
  const textColorClass = isWhiteText ? 'text-white' : ''

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className={`w-6 h-6 animate-spin ${textColorClass}`} />
          <span className={textColorClass}>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className={`w-6 h-6 ${textColorClass}`}>{icon}</span>}
          <span className={textColorClass}>{children}</span>
        </>
      )}
    </button>
  )
}

