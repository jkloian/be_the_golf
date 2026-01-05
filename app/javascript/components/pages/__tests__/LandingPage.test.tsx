import { render, screen } from '../../../__tests__/helpers/test-utils'
import userEvent from '@testing-library/user-event'
import LandingPage from '../LandingPage'

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('LandingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('rendering', () => {
    it('renders the title and description', () => {
      render(<LandingPage />)
      expect(screen.getByText('Be Your Golf')).toBeInTheDocument()
      expect(screen.getByText(/Find out who you play like/i)).toBeInTheDocument()
    })

    it('renders the start button', () => {
      render(<LandingPage />)
      expect(screen.getByRole('button', { name: /Start Free Assessment/i })).toBeInTheDocument()
    })

    it('renders the golf icon', () => {
      render(<LandingPage />)
      // SVG icon is rendered
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('navigates to /start when button is clicked', async () => {
      const user = userEvent.setup()
      render(<LandingPage />)

      const startButton = screen.getByRole('button', { name: /Start Free Assessment/i })
      await user.click(startButton)

      expect(mockNavigate).toHaveBeenCalledWith('/start')
    })

    it('handles keyboard navigation on button', async () => {
      const user = userEvent.setup()
      render(<LandingPage />)

      const startButton = screen.getByRole('button', { name: /Start Free Assessment/i })
      startButton.focus()
      await user.keyboard('{Enter}')

      expect(mockNavigate).toHaveBeenCalledWith('/start')
    })
  })

  describe('interactions', () => {
    it('button is clickable', async () => {
      const user = userEvent.setup()
      render(<LandingPage />)

      const startButton = screen.getByRole('button', { name: /Start Free Assessment/i })
      expect(startButton).not.toBeDisabled()

      await user.click(startButton)
      expect(mockNavigate).toHaveBeenCalled()
    })
  })
})

