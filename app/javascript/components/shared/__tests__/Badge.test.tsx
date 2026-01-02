import { render, screen } from '../../../__tests__/helpers/test-utils'
import Badge from '../Badge'

describe('Badge', () => {
  describe('variants', () => {
    it('renders default variant', () => {
      render(<Badge>Default Badge</Badge>)
      expect(screen.getByText('Default Badge')).toBeInTheDocument()
    })

    it('renders most variant', () => {
      render(<Badge variant="most">Most Badge</Badge>)
      const badge = screen.getByText('Most Badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-golf-light')
    })

    it('renders least variant', () => {
      render(<Badge variant="least">Least Badge</Badge>)
      const badge = screen.getByText('Least Badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-red-50')
    })

    it('renders disc-drive variant', () => {
      render(<Badge variant="disc-drive">Drive Badge</Badge>)
      const badge = screen.getByText('Drive Badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-red-50')
    })

    it('renders disc-inspire variant', () => {
      render(<Badge variant="disc-inspire">Inspire Badge</Badge>)
      const badge = screen.getByText('Inspire Badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-amber-50')
    })

    it('renders disc-steady variant', () => {
      render(<Badge variant="disc-steady">Steady Badge</Badge>)
      const badge = screen.getByText('Steady Badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-green-50')
    })

    it('renders disc-control variant', () => {
      render(<Badge variant="disc-control">Control Badge</Badge>)
      const badge = screen.getByText('Control Badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-blue-50')
    })
  })

  describe('custom className', () => {
    it('applies custom className', () => {
      render(<Badge className="custom-class">Custom Badge</Badge>)
      const badge = screen.getByText('Custom Badge')
      expect(badge).toHaveClass('custom-class')
    })
  })

  describe('base classes', () => {
    it('applies base classes to all variants', () => {
      const { rerender } = render(<Badge>Test</Badge>)
      const badge = screen.getByText('Test')
      expect(badge).toHaveClass('inline-flex', 'items-center', 'px-3', 'py-1', 'rounded-full')

      rerender(<Badge variant="most">Test</Badge>)
      expect(badge).toHaveClass('inline-flex', 'items-center', 'px-3', 'py-1', 'rounded-full')
    })
  })
})

