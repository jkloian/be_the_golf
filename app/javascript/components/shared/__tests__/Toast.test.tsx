import { render, screen } from '../../../__tests__/helpers/test-utils'
import Toast from '../Toast'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Toast', () => {
  describe('visibility', () => {
    it('does not render when show is false', () => {
      render(<Toast show={false} />)

      expect(screen.queryByText(/Copied!/i)).not.toBeInTheDocument()
    })

    it('renders when show is true', () => {
      render(<Toast show={true} />)

      expect(screen.getByText(/Copied!/i)).toBeInTheDocument()
    })
  })

  describe('message display', () => {
    it('displays default message when no message prop is provided', () => {
      render(<Toast show={true} />)

      expect(screen.getByText('Copied!')).toBeInTheDocument()
    })

    it('displays custom message when provided', () => {
      render(<Toast show={true} message="Custom message" />)

      expect(screen.getByText('Custom message')).toBeInTheDocument()
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument()
    })
  })

  describe('rendering', () => {
    it('renders check icon', () => {
      render(<Toast show={true} />)

      // Check icon is rendered (lucide-react Check component)
      const icon = screen.getByText(/Copied!/i).closest('div')?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('has correct styling classes', () => {
      render(<Toast show={true} />)

      const toast = screen.getByText(/Copied!/i).closest('div')
      expect(toast).toHaveClass(/bg-golf-deep/)
      expect(toast).toHaveClass(/text-white/)
    })
  })
})

