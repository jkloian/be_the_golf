import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'most' | 'least' | 'disc-drive' | 'disc-inspire' | 'disc-steady' | 'disc-control'
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-golf'

  const variantClasses = {
    default: 'bg-neutral-offwhite text-neutral-text border border-neutral-border',
    most: 'bg-golf-light text-golf-deep border border-golf-emerald',
    least: 'bg-red-50 text-red-700 border border-red-200',
    'disc-drive': 'bg-red-50 text-disc-drive border border-red-200',
    'disc-inspire': 'bg-amber-50 text-disc-inspire border border-amber-200',
    'disc-steady': 'bg-green-50 text-disc-steady border border-green-200',
    'disc-control': 'bg-blue-50 text-disc-control border border-blue-200',
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

