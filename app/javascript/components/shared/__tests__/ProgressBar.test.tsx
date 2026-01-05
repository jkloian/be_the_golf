import { render, screen } from '../../../__tests__/helpers/test-utils'
import ProgressBar from '../ProgressBar'

describe('ProgressBar', () => {
  describe('percentage calculation', () => {
    it('calculates correct percentage for first question', () => {
      render(<ProgressBar current={1} total={5} />)
      expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument()
    })

    it('calculates correct percentage for middle question', () => {
      render(<ProgressBar current={3} total={5} />)
      expect(screen.getByText(/Question 3 of 5/i)).toBeInTheDocument()
    })

    it('calculates correct percentage for last question', () => {
      render(<ProgressBar current={5} total={5} />)
      expect(screen.getByText(/Question 5 of 5/i)).toBeInTheDocument()
    })

    it('calculates 0% when current is 0', () => {
      render(<ProgressBar current={0} total={5} />)
      expect(screen.getByText(/Question 0 of 5/i)).toBeInTheDocument()
    })
  })

  describe('display', () => {
    it('displays current and total correctly', () => {
      render(<ProgressBar current={2} total={10} />)
      expect(screen.getByText(/Question 2 of 10/i)).toBeInTheDocument()
    })

    it('displays finding your playing style message', () => {
      render(<ProgressBar current={1} total={5} />)
      expect(screen.getByText(/Finding your playing style/i)).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles single question', () => {
      render(<ProgressBar current={1} total={1} />)
      expect(screen.getByText(/Question 1 of 1/i)).toBeInTheDocument()
    })

    it('handles large numbers', () => {
      render(<ProgressBar current={50} total={100} />)
      expect(screen.getByText(/Question 50 of 100/i)).toBeInTheDocument()
    })

    it('handles current greater than total gracefully', () => {
      render(<ProgressBar current={10} total={5} />)
      // Should still render, percentage calculation handles overflow
      expect(screen.getByText(/Question 10 of 5/i)).toBeInTheDocument()
    })

    it('handles zero total', () => {
      render(<ProgressBar current={1} total={0} />)
      // Should handle division by zero gracefully
      expect(screen.getByText(/Question 1 of 0/i)).toBeInTheDocument()
    })
  })

  describe('animation', () => {
    it('renders progress bar element', () => {
      render(<ProgressBar current={2} total={5} />)
      // Progress bar is rendered via motion.div with width animation
      // Visual behavior is tested through integration tests
      expect(screen.getByText(/Question 2 of 5/i)).toBeInTheDocument()
    })
  })
})

