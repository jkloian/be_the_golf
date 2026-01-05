import { render } from '../../../__tests__/helpers/test-utils'
import MedallionHero from '../MedallionHero'

// Mock the personaBadgeMap module
jest.mock('../../../modules/utils/personaBadgeMap', () => ({
  getPersonaBadgePath: jest.fn((code: string) => `badges/${code}.png`),
}))

describe('MedallionHero', () => {
  describe('rendering', () => {
    it('renders medallion image', () => {
      const { container } = render(<MedallionHero personaCode="D" />)
      const img = container.querySelector('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('alt', 'Persona medallion')
    })

    it('renders with correct badge path', () => {
      const { container } = render(<MedallionHero personaCode="D" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/D.png')
    })
  })

  describe('persona codes', () => {
    it('renders D persona', () => {
      const { container } = render(<MedallionHero personaCode="D" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/D.png')
    })

    it('renders I persona', () => {
      const { container } = render(<MedallionHero personaCode="I" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/I.png')
    })

    it('renders S persona', () => {
      const { container } = render(<MedallionHero personaCode="S" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/S.png')
    })

    it('renders C persona', () => {
      const { container } = render(<MedallionHero personaCode="C" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/C.png')
    })

    it('renders combo personas', () => {
      const { container } = render(<MedallionHero personaCode="DI" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/DI.png')
    })

    it('renders DS persona', () => {
      const { container } = render(<MedallionHero personaCode="DS" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/DS.png')
    })

    it('renders CD persona', () => {
      const { container } = render(<MedallionHero personaCode="CD" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/CD.png')
    })

    it('renders DC persona', () => {
      const { container } = render(<MedallionHero personaCode="DC" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/DC.png')
    })

    it('renders IS persona', () => {
      const { container } = render(<MedallionHero personaCode="IS" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/IS.png')
    })

    it('renders IC persona', () => {
      const { container } = render(<MedallionHero personaCode="IC" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/IC.png')
    })

    it('renders SC persona', () => {
      const { container } = render(<MedallionHero personaCode="SC" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/SC.png')
    })

    it('renders BALANCED persona', () => {
      const { container } = render(<MedallionHero personaCode="BALANCED" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/BALANCED.png')
    })

    it('renders default for unknown persona code', () => {
      const { container } = render(<MedallionHero personaCode="UNKNOWN" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('src', '/badges/UNKNOWN.png')
    })
  })

  describe('isFixed prop', () => {
    it('renders in relative mode by default', () => {
      const { container } = render(<MedallionHero personaCode="D" />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).not.toHaveClass('fixed')
    })

    it('renders in fixed mode when isFixed is true', () => {
      const { container } = render(<MedallionHero personaCode="D" isFixed={true} />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('fixed', 'top-0')
    })

    it('applies fixed size classes when isFixed is true', () => {
      const { container } = render(<MedallionHero personaCode="D" isFixed={true} />)
      const img = container.querySelector('img')
      expect(img).toHaveClass('w-32', 'h-32', 'sm:w-40', 'sm:h-40')
    })

    it('applies relative size classes when isFixed is false', () => {
      const { container } = render(<MedallionHero personaCode="D" isFixed={false} />)
      const img = container.querySelector('img')
      expect(img).toHaveClass('w-48', 'h-48', 'sm:w-60', 'sm:h-60', 'md:w-72', 'md:h-72')
    })
  })

  describe('shimmer effect', () => {
    it('renders shimmer effect when not fixed', () => {
      const { container } = render(<MedallionHero personaCode="D" isFixed={false} />)
      const shimmer = container.querySelector('[class*="absolute inset-0 pointer-events-none"]')
      expect(shimmer).toBeInTheDocument()
    })

    it('does not render shimmer effect when fixed', () => {
      const { container } = render(<MedallionHero personaCode="D" isFixed={true} />)
      const shimmer = container.querySelector('[class*="absolute inset-0 pointer-events-none"]')
      expect(shimmer).not.toBeInTheDocument()
    })
  })

  describe('radial gradient', () => {
    it('renders radial gradient glow', () => {
      const { container } = render(<MedallionHero personaCode="D" />)
      const gradient = container.querySelector('[style*="radial-gradient"]')
      expect(gradient).toBeInTheDocument()
    })
  })
})

