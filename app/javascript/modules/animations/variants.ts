// Animation variants for consistent motion across the app
// Smooth, confident easing curves (not bouncy)

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1], // Custom easing for smooth, confident motion
}

export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

// Medallion zoom animation - physics-based spring with blur transition
export const medallionZoom = {
  initial: {
    opacity: 0,
    scale: 0.5,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    scale: [0.5, 1.1, 1],
    filter: 'blur(0px)',
  },
  transition: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
    opacity: { duration: 0.4 },
    filter: { duration: 0.5 },
  },
}

// Shimmer effect - linear gradient that moves across element
export const shimmer = {
  initial: {
    x: '-200%',
  },
  animate: {
    x: ['-200%', '200%'],
  },
  transition: {
    duration: 1.2,
    ease: 'easeInOut',
    repeat: 1,
    repeatType: 'reverse' as const,
  },
}

// Staggered text animation - upward slide
export const staggeredText = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
}

// Staggered list animation for bullet points
export const staggeredList = {
  initial: {
    opacity: 0,
    x: -10,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
}

// Content switch animation for AnimatePresence
export const contentSwitch = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
}

// Continuous shimmer for buttons
export const buttonShimmer = {
  initial: {
    backgroundPosition: '200% 0',
  },
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 3,
    ease: 'linear',
    repeat: Infinity,
  },
}

