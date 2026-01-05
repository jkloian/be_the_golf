import { render } from '../../../__tests__/helpers/test-utils'
import GolfBadge from '../GolfBadge'

describe('GolfBadge', () => {
  describe('rendering', () => {
    it('renders with default size', () => {
      const { container } = render(<GolfBadge personaCode="D" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '120')
      expect(svg).toHaveAttribute('height', '120')
    })

    it('renders with custom size', () => {
      const { container } = render(<GolfBadge personaCode="D" size={200} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '200')
      expect(svg).toHaveAttribute('height', '200')
    })

    it('applies custom className', () => {
      const { container } = render(<GolfBadge personaCode="D" className="custom-class" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
    })

    it('has accessibility attributes', () => {
      const { container } = render(<GolfBadge personaCode="D" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Relentless Attacker badge')
      expect(svg).toHaveAttribute('role', 'img')
    })
  })

  describe('persona codes', () => {
    it('renders D persona (Relentless Attacker)', () => {
      const { container } = render(<GolfBadge personaCode="D" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Relentless Attacker badge')
    })

    it('renders I persona (Charismatic Shotmaker)', () => {
      const { container } = render(<GolfBadge personaCode="I" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Charismatic Shotmaker badge')
    })

    it('renders S persona (Smooth Rhythm Player)', () => {
      const { container } = render(<GolfBadge personaCode="S" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Smooth Rhythm Player badge')
    })

    it('renders C persona (Master Strategist)', () => {
      const { container } = render(<GolfBadge personaCode="C" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Master Strategist badge')
    })

    it('renders DI persona (Electric Playmaker)', () => {
      const { container } = render(<GolfBadge personaCode="DI" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Electric Playmaker badge')
    })

    it('renders DS persona (Controlled Aggressor)', () => {
      const { container } = render(<GolfBadge personaCode="DS" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Controlled Aggressor badge')
    })

    it('renders CD persona (Attacking Analyst)', () => {
      const { container } = render(<GolfBadge personaCode="CD" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Attacking Analyst badge')
    })

    it('renders DC persona (Attacking Analyst)', () => {
      const { container } = render(<GolfBadge personaCode="DC" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Attacking Analyst badge')
    })

    it('renders IS persona (Positive Rhythm Player)', () => {
      const { container } = render(<GolfBadge personaCode="IS" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Positive Rhythm Player badge')
    })

    it('renders IC persona (Imaginative Planner)', () => {
      const { container } = render(<GolfBadge personaCode="IC" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Imaginative Planner badge')
    })

    it('renders SC persona (Steady Technician)', () => {
      const { container } = render(<GolfBadge personaCode="SC" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Steady Technician badge')
    })

    it('renders BALANCED persona (Complete Game Planner)', () => {
      const { container } = render(<GolfBadge personaCode="BALANCED" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Complete Game Planner badge')
    })

    it('renders default persona for unknown code', () => {
      const { container } = render(<GolfBadge personaCode="UNKNOWN" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Golf Player badge')
    })
  })

  describe('SVG structure', () => {
    it('renders outer gold ring', () => {
      const { container } = render(<GolfBadge personaCode="D" />)
      const circle = container.querySelector('circle[stroke="var(--color-accent-gold)"]')
      expect(circle).toBeInTheDocument()
    })

    it('renders inner background circle', () => {
      const { container } = render(<GolfBadge personaCode="D" />)
      const circles = container.querySelectorAll('circle')
      expect(circles.length).toBeGreaterThan(1)
    })

    it('renders icon path', () => {
      const { container } = render(<GolfBadge personaCode="D" />)
      const path = container.querySelector('path')
      expect(path).toBeInTheDocument()
    })

    it('renders gradient definitions', () => {
      const { container } = render(<GolfBadge personaCode="D" />)
      const defs = container.querySelector('defs')
      expect(defs).toBeInTheDocument()
    })
  })

  describe('BALANCED persona special handling', () => {
    it('renders special gradient for BALANCED persona', () => {
      const { container } = render(<GolfBadge personaCode="BALANCED" />)
      const gradient = container.querySelector('linearGradient[id*="balanced"]')
      expect(gradient).toBeInTheDocument()
    })
  })
})

