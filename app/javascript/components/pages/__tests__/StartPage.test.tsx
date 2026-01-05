import { render, screen, waitFor } from '../../../__tests__/helpers/test-utils'
import userEvent from '@testing-library/user-event'
import { setupMockSessionStorage, clearMockSessionStorage } from '../../../__tests__/helpers/mock-sessionStorage'
import type { StartAssessmentResponse } from '../../../shared/types/assessment'

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock the API module - must be before importing StartPage
const mockStartAssessment = jest.fn()
jest.mock('../../../modules/api/client', () => ({
  api: {
    startAssessment: (...args: unknown[]) => mockStartAssessment(...args),
  },
}))

import StartPage from '../StartPage'

describe('StartPage', () => {
  beforeEach(() => {
    setupMockSessionStorage()
    mockNavigate.mockClear()
    mockStartAssessment.mockClear()
    jest.clearAllMocks()
  })

  afterEach(() => {
    clearMockSessionStorage()
  })

  describe('form rendering', () => {
    it('renders the form with all fields', () => {
      render(<StartPage />)

      expect(screen.getByPlaceholderText(/Enter your first name/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Male/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Female/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Prefer not to say/i).length).toBeGreaterThan(0)
      expect(screen.getByPlaceholderText(/Enter your handicap/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Start Assessment/i })).toBeInTheDocument()
    })

    it('renders with default gender selection (male)', () => {
      render(<StartPage />)

      const maleButtons = screen.getAllByText(/Male/i)
      const maleButton = maleButtons.find(btn => btn.closest('button'))
      expect(maleButton?.closest('button')).toHaveClass(/bg-gradient-to-br/)
    })
  })

  describe('form interactions', () => {
    it('updates first name input', async () => {
      const user = userEvent.setup()
      render(<StartPage />)

      const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i)
      await user.type(firstNameInput, 'John')

      expect(firstNameInput).toHaveValue('John')
    })

    it('updates handicap input', async () => {
      const user = userEvent.setup()
      render(<StartPage />)

      const handicapInput = screen.getByPlaceholderText(/Enter your handicap/i)
      await user.type(handicapInput, '15')

      expect(handicapInput).toHaveValue(15)
    })

    it('changes gender selection', async () => {
      const user = userEvent.setup()
      render(<StartPage />)

      const femaleTexts = screen.getAllByText(/Female/i)
      const femaleButton = femaleTexts.find(text => text.closest('button'))?.closest('button')
      await user.click(femaleButton!)

      expect(femaleButton).toHaveClass(/bg-gradient-to-br/)
    })

    it('shows warning when unspecified gender is selected', async () => {
      const user = userEvent.setup()
      render(<StartPage />)

      const unspecifiedTexts = screen.getAllByText(/Prefer not to say/i)
      const unspecifiedButton = unspecifiedTexts.find(text => text.closest('button'))?.closest('button')
      await user.click(unspecifiedButton!)

      await waitFor(() => {
        expect(screen.getByText(/can't personalize/i)).toBeInTheDocument()
      })
    })
  })

  describe('form submission', () => {
    const mockResponse: StartAssessmentResponse = {
      assessment_session: {
        id: 1,
        public_token: 'test-token',
        gender: 'male',
        started_at: '2024-01-01T00:00:00Z',
      },
      frames: [
        {
          index: 0,
          options: [
            { key: 'option1', text: 'Option 1' },
            { key: 'option2', text: 'Option 2' },
          ],
        },
      ],
    }

    it('submits form with all fields and navigates on success', async () => {
      const user = userEvent.setup()
      mockStartAssessment.mockResolvedValue(mockResponse)

      render(<StartPage />)

      const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i)
      const handicapInput = screen.getByPlaceholderText(/Enter your handicap/i)
      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })

      await user.type(firstNameInput, 'John')
      await user.type(handicapInput, '10')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockStartAssessment).toHaveBeenCalledWith(
          {
            first_name: 'John',
            gender: 'male',
            handicap: 10,
          },
          'en'
        )
      })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/assessment/1')
      })

      // Verify frames are stored in sessionStorage
      const storedFrames = window.sessionStorage.getItem('assessment_frames')
      expect(storedFrames).toBe(JSON.stringify(mockResponse.frames))
    })

    it('submits form with only required fields', async () => {
      const user = userEvent.setup()
      mockStartAssessment.mockResolvedValue(mockResponse)

      render(<StartPage />)

      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockStartAssessment).toHaveBeenCalledWith(
          {
            gender: 'male',
          },
          'en'
        )
      })
    })

    it('parses handicap as number', async () => {
      const user = userEvent.setup()
      mockStartAssessment.mockResolvedValue(mockResponse)

      render(<StartPage />)

      const handicapInput = screen.getByPlaceholderText(/Enter your handicap/i)
      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })

      await user.type(handicapInput, '25')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockStartAssessment).toHaveBeenCalledWith(
          expect.objectContaining({
            handicap: 25,
          }),
          expect.any(String)
        )
      })
    })

    it('handles empty handicap as undefined', async () => {
      const user = userEvent.setup()
      mockStartAssessment.mockResolvedValue(mockResponse)

      render(<StartPage />)

      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockStartAssessment).toHaveBeenCalledWith(
          expect.objectContaining({
            handicap: undefined,
          }),
          expect.any(String)
        )
      })
    })

    it('handles empty first name as undefined', async () => {
      const user = userEvent.setup()
      mockStartAssessment.mockResolvedValue(mockResponse)

      render(<StartPage />)

      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockStartAssessment).toHaveBeenCalledWith(
          expect.objectContaining({
            first_name: undefined,
          }),
          expect.any(String)
        )
      })
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      let resolvePromise: (value: StartAssessmentResponse) => void
      const promise = new Promise<StartAssessmentResponse>((resolve) => {
        resolvePromise = resolve
      })
      mockStartAssessment.mockReturnValue(promise)

      render(<StartPage />)

      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })
      await user.click(submitButton)

      expect(screen.getByText(/Starting.../i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()

      resolvePromise!(mockResponse)
      await waitFor(() => {
        expect(screen.queryByText(/Starting.../i)).not.toBeInTheDocument()
      })
    })

    it('displays error message on API failure', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Failed to start assessment'
      mockStartAssessment.mockRejectedValue(new Error(errorMessage))

      render(<StartPage />)

      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('displays generic error message on unknown error', async () => {
      const user = userEvent.setup()
      mockStartAssessment.mockRejectedValue('Unknown error')

      render(<StartPage />)

      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/An error occurred/i)).toBeInTheDocument()
      })
    })

    it('clears error on successful submission', async () => {
      const user = userEvent.setup()
      mockStartAssessment
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockResponse)

      render(<StartPage />)

      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })

      // First submission fails
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.getByText(/First error/i)).toBeInTheDocument()
      })

      // Second submission succeeds
      await user.click(submitButton)
      await waitFor(() => {
        expect(screen.queryByText(/First error/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('gender selection', () => {
    it('submits with selected gender', async () => {
      const user = userEvent.setup()
      const mockResponse: StartAssessmentResponse = {
        assessment_session: {
          id: 1,
          public_token: 'test-token',
          gender: 'female',
          started_at: '2024-01-01T00:00:00Z',
        },
        frames: [],
      }
      mockStartAssessment.mockResolvedValue(mockResponse)

      render(<StartPage />)

      const femaleTexts = screen.getAllByText(/Female/i)
      const femaleButton = femaleTexts.find(text => text.closest('button'))?.closest('button')
      await user.click(femaleButton!)

      const submitButton = screen.getByRole('button', { name: /Start Assessment/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockStartAssessment).toHaveBeenCalledWith(
          expect.objectContaining({
            gender: 'female',
          }),
          expect.any(String)
        )
      })
    })
  })
})
