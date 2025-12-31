interface GolfBadgeProps {
  personaCode: string
  size?: number
  className?: string
}

// Icon path definitions for each persona - golf-themed designs
const getIconPath = (personaCode: string): string => {
  switch (personaCode) {
    case 'D':
      // Lightning bolt through target for Relentless Attacker
      return 'M50 18L38 42H45L40 72L60 38H52L55 18ZM50 50C45 45, 45 50, 50 50C55 50, 55 45, 50 50M50 50C48 48, 48 50, 50 50C52 50, 52 48, 50 50'
    case 'I':
      // Golf ball with creative curved swing path for Charismatic Shotmaker
      return 'M50 25C45 25, 42 28, 42 35C42 42, 45 45, 50 45C55 45, 58 42, 58 35C58 28, 55 25, 50 25M50 30C52 30, 54 32, 54 35C54 38, 52 40, 50 40C48 40, 46 38, 46 35C46 32, 48 30, 50 30M30 55C35 50, 45 48, 50 50C55 52, 65 50, 70 55'
    case 'S':
      // Smooth wave / steady flag for Smooth Rhythm Player
      return 'M25 50C35 42, 40 42, 50 50C60 58, 65 58, 75 50M25 60C35 52, 40 52, 50 60C60 68, 65 68, 75 60M30 45L30 75M35 45L35 75'
    case 'C':
      // Compass / crosshair target for Master Strategist
      return 'M50 25L50 40M50 60L50 75M25 50L40 50M60 50L75 50M50 50C45 45, 40 50, 50 50C60 50, 55 45, 50 50M50 50C48 48, 48 50, 50 50C52 50, 52 48, 50 50'
    case 'DI':
      // Lightning + flame (Electric Playmaker)
      return 'M50 18L40 42H45L42 68L58 38H52L55 18ZM50 70C48 68, 46 70, 48 72C50 74, 52 72, 50 70M50 65C49 64, 48 65, 49 67C50 69, 51 67, 50 65'
    case 'DS':
      // Lightning + wave (Controlled Aggressor)
      return 'M50 18L38 42H45L40 72L60 38H52L55 18ZM25 60C35 55, 40 55, 50 60C60 65, 65 65, 75 60M25 70C35 65, 40 65, 50 70C60 75, 65 75, 75 70'
    case 'CD':
    case 'DC':
      // Lightning + compass (Attacking Analyst)
      return 'M50 18L40 42H45L42 68L58 38H52L55 18ZM50 50C45 45, 40 50, 50 50C60 50, 55 45, 50 50M50 35L50 40M50 60L50 65M35 50L40 50M60 50L65 50'
    case 'IS':
      // Flame + wave (Positive Rhythm Player)
      return 'M50 25C48 25, 46 27, 46 33C46 39, 48 41, 50 43C52 41, 54 39, 54 33C54 27, 52 25, 50 25M50 30C51 30, 52 31, 52 33C52 35, 51 36, 50 36C49 36, 48 35, 48 33C48 31, 49 30, 50 30ZM25 58C35 53, 40 53, 50 58C60 63, 65 63, 75 58'
    case 'IC':
      // Flame + compass (Imaginative Planner)
      return 'M50 25C48 25, 46 27, 46 33C46 39, 48 41, 50 43C52 41, 54 39, 54 33C54 27, 52 25, 50 25M50 50C45 45, 40 50, 50 50C60 50, 55 45, 50 50M50 38L50 40M50 60L50 62M38 50L40 50M60 50L62 50'
    case 'SC':
      // Wave + compass (Steady Technician)
      return 'M25 50C35 45, 40 45, 50 50C60 55, 65 55, 75 50M25 60C35 55, 40 55, 50 60C60 65, 65 65, 75 60ZM50 50C45 45, 40 50, 50 50C60 50, 55 45, 50 50M50 38L50 40M50 60L50 62M38 50L40 50M60 50L62 50'
    case 'BALANCED':
      // Four-quadrant balanced symbol with all four elements
      return 'M50 25L50 50M50 50L50 75M25 50L50 50M50 50L75 50M35 35C38 38, 40 35, 50 50M65 35C62 38, 60 35, 50 50M35 65C38 62, 40 65, 50 50M65 65C62 62, 60 65, 50 50M50 50C48 48, 48 50, 50 50C52 50, 52 48, 50 50'
    default:
      // Default: simple golf ball
      return 'M50 25C45 25, 42 28, 42 35C42 42, 45 45, 50 45C55 45, 58 42, 58 35C58 28, 55 25, 50 25M50 30C52 30, 54 32, 54 35C54 38, 52 40, 50 40C48 40, 46 38, 46 35C46 32, 48 30, 50 30'
  }
}

// Get colors for persona code
const getColors = (personaCode: string): { primary: string; secondary?: string } => {
  switch (personaCode) {
    case 'D':
      return { primary: 'var(--color-disc-drive)' }
    case 'I':
      return { primary: 'var(--color-disc-inspire)' }
    case 'S':
      return { primary: 'var(--color-disc-steady)' }
    case 'C':
      return { primary: 'var(--color-disc-control)' }
    case 'DI':
      return { primary: 'var(--color-disc-drive)', secondary: 'var(--color-disc-inspire)' }
    case 'DS':
      return { primary: 'var(--color-disc-drive)', secondary: 'var(--color-disc-steady)' }
    case 'CD':
    case 'DC':
      return { primary: 'var(--color-disc-control)', secondary: 'var(--color-disc-drive)' }
    case 'IS':
      return { primary: 'var(--color-disc-inspire)', secondary: 'var(--color-disc-steady)' }
    case 'IC':
      return { primary: 'var(--color-disc-inspire)', secondary: 'var(--color-disc-control)' }
    case 'SC':
      return { primary: 'var(--color-disc-steady)', secondary: 'var(--color-disc-control)' }
    case 'BALANCED':
      return { primary: 'var(--color-disc-drive)', secondary: 'var(--color-disc-inspire)' }
    default:
      return { primary: 'var(--color-neutral-text)' }
  }
}

// Get persona name for accessibility
const getPersonaName = (personaCode: string): string => {
  const names: Record<string, string> = {
    D: 'Relentless Attacker',
    I: 'Charismatic Shotmaker',
    S: 'Smooth Rhythm Player',
    C: 'Master Strategist',
    DI: 'Electric Playmaker',
    DS: 'Controlled Aggressor',
    CD: 'Attacking Analyst',
    DC: 'Attacking Analyst',
    IS: 'Positive Rhythm Player',
    IC: 'Imaginative Planner',
    SC: 'Steady Technician',
    BALANCED: 'Complete Game Planner',
  }
  return names[personaCode] || 'Golf Player'
}

export default function GolfBadge({
  personaCode,
  size = 120,
  className = '',
}: GolfBadgeProps) {
  const iconPath = getIconPath(personaCode)
  const colors = getColors(personaCode)
  const personaName = getPersonaName(personaCode)
  const gradientId = `gradient-${personaCode}-${size}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`drop-shadow-elevated ${className}`}
      aria-label={`${personaName} badge`}
      role="img"
    >
      <defs>
        {/* Gradient for combo styles or single color for single styles */}
        {colors.secondary ? (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        ) : (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.primary} />
          </linearGradient>
        )}
        {/* Special gradient for BALANCED with all four colors */}
        {personaCode === 'BALANCED' && (
          <linearGradient id={`${gradientId}-balanced`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-disc-drive)" />
            <stop offset="33%" stopColor="var(--color-disc-inspire)" />
            <stop offset="66%" stopColor="var(--color-disc-steady)" />
            <stop offset="100%" stopColor="var(--color-disc-control)" />
          </linearGradient>
        )}
      </defs>

      {/* Outer Gold Ring */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="var(--color-accent-gold)"
        strokeWidth="4"
      />

      {/* Inner Subtle Background */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="var(--color-golf-light)"
        opacity="0.5"
      />

      {/* Dynamic Icon */}
      <path
        d={iconPath}
        fill={personaCode === 'BALANCED' ? `url(#${gradientId}-balanced)` : `url(#${gradientId})`}
        stroke={personaCode === 'BALANCED' ? `url(#${gradientId}-balanced)` : colors.primary}
        strokeWidth={personaCode === 'BALANCED' ? '1.5' : '2'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

