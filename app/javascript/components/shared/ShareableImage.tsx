import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import { getPersonaBadgePath } from '../../modules/utils/personaBadgeMap'
import { WEBSITE_URL } from '../../modules/constants'

interface ShareableImageProps {
  data: PublicAssessmentResponse
  aspectRatio?: 'square' | 'vertical'
  className?: string
}

/**
 * ShareableImage component - renders the shareable design
 * This component is hidden from the main page and only rendered for image capture
 */
export default function ShareableImage({
  data,
  aspectRatio = 'square',
  className = '',
}: ShareableImageProps) {
  const { assessment } = data
  const { persona } = assessment

  // Calculate dimensions based on aspect ratio
  // Square: 1080x1080 (common social media size)
  // Vertical: 1080x1350 (4:5 ratio)
  const width = 1080
  const height = aspectRatio === 'square' ? 1080 : 1350

  return (
    <div
      className={`bg-neutral-offwhite ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        overflow: 'hidden',
      }}
      data-shareable-image="true"
    >
      {/* Background gradient for depth */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 61, 46, 0.05) 0%, rgba(31, 111, 84, 0.1) 100%)',
        }}
      />

      {/* Main content container - centered vertically, bumped up */}
      <div className="relative h-full flex flex-col items-center justify-center px-12" style={{ transform: 'translateY(-5%)' }}>
        {/* Hero Badge - Large, centered/top-weighted */}
        <div className="mb-6 flex-shrink-0">
          <img
            src={`/${getPersonaBadgePath(persona.code)}`}
            alt={`${persona.name} badge`}
            className="drop-shadow-elevated"
            style={{ width: '368px', height: '368px' }}
          />
        </div>

        {/* Style Name - Bold, declarative */}
        <h1 className="text-7xl font-display font-black text-golf-deep mb-5 text-center leading-tight">
          {persona.name}
        </h1>

        {/* Pro Comparison Line */}
        <p className="text-3xl font-display font-medium text-neutral-textSecondary mb-6 text-center">
          <span className="text-golf-deep">{persona.display_example_pro}</span> shares my playing style
        </p>

        {/* One-line Style Truth */}
        {persona.style_truth && (
          <p className="text-4xl font-display font-medium text-neutral-text text-center leading-relaxed max-w-3xl">
            {persona.style_truth}
          </p>
        )}
      </div>

      {/* Footer - fixed at bottom */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
        {/* Brand Mark / App Name - Bottom corner, subtle */}
        <div className="flex items-center gap-3">
          <img
            src="/be-the-golf-logo.svg"
            alt="Be The Golf"
            className="h-10 w-auto opacity-70"
          />
          <span className="text-xl font-display font-medium text-neutral-textSecondary">
            Be The Golf
          </span>
        </div>

        {/* Soft CTA - Small, subtle, non-salesy */}
        <p className="text-lg font-display font-normal text-neutral-textSecondary mt-3 text-center">
          Discover your golf style at {WEBSITE_URL}
        </p>
      </div>
    </div>
  )
}

