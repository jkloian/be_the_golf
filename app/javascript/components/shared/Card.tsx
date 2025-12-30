import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
}

export default function Card({ children, className = '', onClick, selected }: CardProps) {
  const baseClasses = 'p-4 rounded-lg border-2 transition-all cursor-pointer'
  const stateClasses = selected
    ? 'border-blue-600 bg-blue-50 shadow-md'
    : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-sm'

  return (
    <div
      className={`${baseClasses} ${stateClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  )
}

