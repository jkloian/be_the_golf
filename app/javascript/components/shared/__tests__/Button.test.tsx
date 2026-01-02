import { render, screen } from '../../../__tests__/helpers/test-utils'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /Click me/i })
      expect(button).toHaveClass(/bg-gradient-to-r/)
    })

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Click me</Button>)
      const button = screen.getByRole('button', { name: /Click me/i })
      expect(button).toHaveClass(/bg-gradient-to-r/)
    })

    it('renders outline variant', () => {
      render(<Button variant="outline">Click me</Button>)
      const button = screen.getByRole('button', { name: /Click me/i })
      expect(button).toHaveClass(/border-2/)
    })

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Click me</Button>)
      const button = screen.getByRole('button', { name: /Click me/i })
      expect(button).toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('shows loading text when loading', () => {
      render(<Button loading>Click me</Button>)
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
      expect(screen.queryByText(/Click me/i)).not.toBeInTheDocument()
    })

    it('disables button when loading', () => {
      render(<Button loading>Click me</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('hides icon when loading', () => {
      const icon = <span>Icon</span>
      render(<Button icon={icon} loading>Click me</Button>)
      expect(screen.queryByText('Icon')).not.toBeInTheDocument()
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })
  })

  describe('disabled state', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Click me</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('applies disabled styling', () => {
      render(<Button disabled>Click me</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(/disabled:opacity-50/)
    })
  })

  describe('icon rendering', () => {
    it('renders icon when provided', () => {
      const icon = <span data-testid="icon">Icon</span>
      render(<Button icon={icon}>Click me</Button>)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('does not render icon when not provided', () => {
      render(<Button>Click me</Button>)
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    })
  })

  describe('click handlers', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      const button = screen.getByRole('button', { name: /Click me/i })
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      )

      const button = screen.getByRole('button', { name: /Click me/i })
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(
        <Button onClick={handleClick} loading>
          Click me
        </Button>
      )

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      const button = screen.getByRole('button', { name: /Click me/i })
      button.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('has proper button role', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('custom props', () => {
    it('passes through custom className', () => {
      render(<Button className="custom-class">Click me</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('passes through custom style', () => {
      render(<Button style={{ color: 'red' }}>Click me</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('style')
      expect(button.getAttribute('style')).toContain('color: red')
    })

    it('passes through other HTML attributes', () => {
      render(<Button data-testid="custom-button" aria-label="Custom label">Click me</Button>)
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
    })
  })
})

