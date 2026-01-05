import { render, screen } from '../../../__tests__/helpers/test-utils'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  describe('size variants', () => {
    it('renders with default medium size', () => {
      render(<LoadingSpinner />)
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('renders with small size', () => {
      render(<LoadingSpinner size="sm" />)
      // Size is applied via className, visual behavior tested through integration
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('renders with medium size', () => {
      render(<LoadingSpinner size="md" />)
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('renders with large size', () => {
      render(<LoadingSpinner size="lg" />)
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })

  describe('text display', () => {
    it('displays text when provided', () => {
      render(<LoadingSpinner text="Loading data..." />)
      expect(screen.getByText('Loading data...')).toBeInTheDocument()
    })

    it('does not display text when not provided', () => {
      render(<LoadingSpinner />)
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument()
    })

    it('renders without text', () => {
      const { container } = render(<LoadingSpinner />)
      expect(container.querySelector('.animate-spin')).toBeInTheDocument()
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />)
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('custom-class')
    })
  })

  describe('spinner rendering', () => {
    it('renders spinner icon', () => {
      render(<LoadingSpinner />)
      // Loader2 icon from lucide-react is rendered
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('applies spin animation', () => {
      render(<LoadingSpinner />)
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toHaveClass('animate-spin')
    })
  })
})

