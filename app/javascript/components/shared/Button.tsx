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
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-golf font-semibold text-base transition-all duration-golf min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary:
      'bg-golf-deep text-white hover:bg-golf-emerald hover:shadow-cardHover active:scale-[0.98] focus:ring-golf-emerald shadow-card',
    secondary:
      'bg-neutral-textSecondary text-white hover:bg-neutral-text hover:shadow-cardHover active:scale-[0.98] focus:ring-neutral-textSecondary shadow-card',
    outline:
      'border border-golf-emerald text-golf-deep hover:bg-golf-light hover:border-golf-deep active:scale-[0.98] focus:ring-golf-emerald bg-neutral-surface',
    ghost:
      'text-golf-deep hover:bg-golf-light active:scale-[0.98] focus:ring-golf-emerald',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        icon && <span className="w-5 h-5">{icon}</span>
      )}
      {children}
    </button>
  )
}

