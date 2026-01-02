import { render, screen } from '../../../__tests__/helpers/test-utils'
import userEvent from '@testing-library/user-event'
import ViewModeToggle from '../ViewModeToggle'

describe('ViewModeToggle', () => {
  describe('rendering', () => {
    it('renders both buttons', () => {
      const handleChange = jest.fn()
      render(<ViewModeToggle value="PRACTICE" onChange={handleChange} />)

      expect(screen.getByRole('button', { name: /Practice Protocol/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Course Strategy/i })).toBeInTheDocument()
    })
  })

  describe('value prop', () => {
    it('highlights PRACTICE button when value is PRACTICE', () => {
      const handleChange = jest.fn()
      render(<ViewModeToggle value="PRACTICE" onChange={handleChange} />)

      const practiceButton = screen.getByRole('button', { name: /Practice Protocol/i })
      expect(practiceButton).toHaveClass('text-white')
    })

    it('highlights COURSE button when value is COURSE', () => {
      const handleChange = jest.fn()
      render(<ViewModeToggle value="COURSE" onChange={handleChange} />)

      const courseButton = screen.getByRole('button', { name: /Course Strategy/i })
      expect(courseButton).toHaveClass('text-white')
    })
  })

  describe('onChange handler', () => {
    it('calls onChange with PRACTICE when Practice Protocol is clicked', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<ViewModeToggle value="COURSE" onChange={handleChange} />)

      const practiceButton = screen.getByRole('button', { name: /Practice Protocol/i })
      await user.click(practiceButton)

      expect(handleChange).toHaveBeenCalledWith('PRACTICE')
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('calls onChange with COURSE when Course Strategy is clicked', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<ViewModeToggle value="PRACTICE" onChange={handleChange} />)

      const courseButton = screen.getByRole('button', { name: /Course Strategy/i })
      await user.click(courseButton)

      expect(handleChange).toHaveBeenCalledWith('COURSE')
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('calls onChange when clicking already active button', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<ViewModeToggle value="PRACTICE" onChange={handleChange} />)

      const practiceButton = screen.getByRole('button', { name: /Practice Protocol/i })
      await user.click(practiceButton)

      expect(handleChange).toHaveBeenCalledWith('PRACTICE')
    })
  })

  describe('visual states', () => {
    it('applies correct text color for inactive PRACTICE button', () => {
      const handleChange = jest.fn()
      render(<ViewModeToggle value="COURSE" onChange={handleChange} />)

      const practiceButton = screen.getByRole('button', { name: /Practice Protocol/i })
      expect(practiceButton).toHaveClass('text-golf-deep/70')
    })

    it('applies correct text color for inactive COURSE button', () => {
      const handleChange = jest.fn()
      render(<ViewModeToggle value="PRACTICE" onChange={handleChange} />)

      const courseButton = screen.getByRole('button', { name: /Course Strategy/i })
      expect(courseButton).toHaveClass('text-golf-deep/70')
    })
  })
})

