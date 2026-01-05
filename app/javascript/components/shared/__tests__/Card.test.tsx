import { render, screen } from '../../../__tests__/helpers/test-utils'
import userEvent from '@testing-library/user-event'
import Card from '../Card'

describe('Card', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Card>Card Content</Card>)
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Card className="custom-class">Content</Card>)
      const card = screen.getByText('Content').closest('div')
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('variants', () => {
    it('renders default variant', () => {
      render(<Card>Default Card</Card>)
      const card = screen.getByText('Default Card').closest('div')
      expect(card).toHaveClass('border-warm-200')
    })

    it('renders most variant', () => {
      render(<Card variant="most">Most Card</Card>)
      const card = screen.getByText('Most Card').closest('div')
      expect(card).toHaveClass('border-warm-200')
    })

    it('renders least variant', () => {
      render(<Card variant="least">Least Card</Card>)
      const card = screen.getByText('Least Card').closest('div')
      expect(card).toHaveClass('border-warm-200')
    })
  })

  describe('selected state', () => {
    it('applies selected styles when selected is true', () => {
      render(<Card selected>Selected Card</Card>)
      const card = screen.getByText('Selected Card').closest('div')
      expect(card).toHaveClass('border-golf-green-500', 'bg-golf-green-50')
    })

    it('applies selected styles for most variant', () => {
      render(
        <Card variant="most" selected>
          Selected Most Card
        </Card>
      )
      const card = screen.getByText('Selected Most Card').closest('div')
      expect(card).toHaveClass('border-golf-green-500', 'bg-golf-green-50', 'ring-2')
    })

    it('applies selected styles for least variant', () => {
      render(
        <Card variant="least" selected>
          Selected Least Card
        </Card>
      )
      const card = screen.getByText('Selected Least Card').closest('div')
      expect(card).toHaveClass('border-disc-drive', 'bg-red-50', 'ring-2')
    })
  })

  describe('click handlers', () => {
    it('calls onClick when card is clicked', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      render(<Card onClick={handleClick}>Clickable Card</Card>)

      const card = screen.getByText('Clickable Card').closest('div')
      await user.click(card!)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when onClick is not provided', async () => {
      const user = userEvent.setup()
      render(<Card>Non-clickable Card</Card>)

      const card = screen.getByText('Non-clickable Card').closest('div')
      await user.click(card!)

      // Should not throw error
      expect(card).toBeInTheDocument()
    })
  })

  describe('keyboard navigation', () => {
    it('calls onClick when Enter key is pressed', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      render(<Card onClick={handleClick}>Keyboard Card</Card>)

      const card = screen.getByText('Keyboard Card').closest('div')
      card?.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick when Space key is pressed', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      render(<Card onClick={handleClick}>Keyboard Card</Card>)

      const card = screen.getByText('Keyboard Card').closest('div')
      card?.focus()
      await user.keyboard(' ')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('has role="button" when onClick is provided', () => {
      render(<Card onClick={() => {}}>Clickable Card</Card>)
      const card = screen.getByRole('button', { name: /Clickable Card/i })
      expect(card).toBeInTheDocument()
    })

    it('does not have role="button" when onClick is not provided', () => {
      render(<Card>Non-clickable Card</Card>)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('has tabIndex when onClick is provided', () => {
      render(<Card onClick={() => {}}>Clickable Card</Card>)
      const card = screen.getByRole('button', { name: /Clickable Card/i })
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('does not have tabIndex when onClick is not provided', () => {
      render(<Card>Non-clickable Card</Card>)
      const card = screen.getByText('Non-clickable Card').closest('div')
      expect(card).not.toHaveAttribute('tabIndex')
    })
  })
})

