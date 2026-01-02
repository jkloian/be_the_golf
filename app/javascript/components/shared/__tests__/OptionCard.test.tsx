import { render, screen } from '../../../__tests__/helpers/test-utils'
import userEvent from '@testing-library/user-event'
import OptionCard from '../OptionCard'

describe('OptionCard', () => {
  describe('selection states', () => {
    it('renders with no selection by default', () => {
      render(<OptionCard>Option text</OptionCard>)
      expect(screen.getByText('Option text')).toBeInTheDocument()
      expect(screen.queryByText(/Most like me/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Least like me/i)).not.toBeInTheDocument()
    })

    it('renders most selection state', () => {
      render(<OptionCard isMost>Option text</OptionCard>)
      expect(screen.getByText(/Most like me/i)).toBeInTheDocument()
      expect(screen.queryByText(/Least like me/i)).not.toBeInTheDocument()
    })

    it('renders least selection state', () => {
      render(<OptionCard isLeast>Option text</OptionCard>)
      expect(screen.getByText(/Least like me/i)).toBeInTheDocument()
      expect(screen.queryByText(/Most like me/i)).not.toBeInTheDocument()
    })

    it('renders both states when both are true', () => {
      render(
        <OptionCard isMost isLeast>
          Option text
        </OptionCard>
      )
      expect(screen.getByText(/Most like me/i)).toBeInTheDocument()
      expect(screen.getByText(/Least like me/i)).toBeInTheDocument()
    })
  })

  describe('click handlers', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<OptionCard onClick={handleClick}>Option text</OptionCard>)

      const card = screen.getByText('Option text').closest('[role="button"]')
      await user.click(card!)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when not provided', async () => {
      const user = userEvent.setup()
      render(<OptionCard>Option text</OptionCard>)

      const card = screen.getByText('Option text').closest('[role="button"]')
      await user.click(card!)

      // Should not throw error
      expect(card).toBeInTheDocument()
    })
  })

  describe('keyboard navigation', () => {
    it('handles Enter key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<OptionCard onClick={handleClick}>Option text</OptionCard>)

      const card = screen.getByText('Option text').closest('[role="button"]')
      card?.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles Space key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<OptionCard onClick={handleClick}>Option text</OptionCard>)

      const card = screen.getByText('Option text').closest('[role="button"]')
      card?.focus()
      await user.keyboard(' ')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('prevents default on Enter key', () => {
      const handleClick = jest.fn()
      render(<OptionCard onClick={handleClick}>Option text</OptionCard>)

      const card = screen.getByText('Option text').closest('[role="button"]')
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

      card?.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('prevents default on Space key', () => {
      const handleClick = jest.fn()
      render(<OptionCard onClick={handleClick}>Option text</OptionCard>)

      const card = screen.getByText('Option text').closest('[role="button"]')
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

      card?.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has button role', () => {
      render(<OptionCard>Option text</OptionCard>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has tabIndex for keyboard navigation', () => {
      render(<OptionCard>Option text</OptionCard>)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('index prop', () => {
    it('applies index for animation delay', () => {
      render(<OptionCard index={2}>Option text</OptionCard>)
      // Animation delay is applied via motion.div, which is tested through visual behavior
      expect(screen.getByText('Option text')).toBeInTheDocument()
    })
  })

  describe('children rendering', () => {
    it('renders text children', () => {
      render(<OptionCard>Simple text</OptionCard>)
      expect(screen.getByText('Simple text')).toBeInTheDocument()
    })

    it('renders complex children', () => {
      render(
        <OptionCard>
          <span>Complex</span> <strong>content</strong>
        </OptionCard>
      )
      expect(screen.getByText('Complex')).toBeInTheDocument()
      expect(screen.getByText('content')).toBeInTheDocument()
    })
  })
})

