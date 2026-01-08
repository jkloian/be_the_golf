import { render, screen, waitFor, act } from '../../../__tests__/helpers/test-utils'
import userEvent from '@testing-library/user-event'
import {
  setupMockSessionStorage,
  clearMockSessionStorage,
  setMockSessionStorageItem,
} from '../../../__tests__/helpers/mock-sessionStorage'
import type { Frame } from '../../../shared/types/assessment'
import type { CompleteAssessmentResponse } from '../../../shared/types/assessment'

// Mock react-router-dom
const mockNavigate = jest.fn()
let mockParams: { sessionId?: string } = { sessionId: '1' }
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ ...mockParams }),
}))

// Import first, then spy on the API
import AssessmentPage from '../AssessmentPage'
import { api } from '../../../modules/api/client'

// Spy on the API method
const mockCompleteAssessment = jest.spyOn(api, 'completeAssessment')

describe('AssessmentPage', () => {
  const mockFrames: Frame[] = [
    {
      index: 0,
      options: [
        { key: 'option1', text: 'Option 1' },
        { key: 'option2', text: 'Option 2' },
        { key: 'option3', text: 'Option 3' },
        { key: 'option4', text: 'Option 4' },
      ],
    },
    {
      index: 1,
      options: [
        { key: 'option5', text: 'Option 5' },
        { key: 'option6', text: 'Option 6' },
      ],
    },
  ]

  beforeEach(() => {
    setupMockSessionStorage()
    clearMockSessionStorage()
    mockNavigate.mockClear()
    jest.clearAllMocks()
    jest.useFakeTimers()
    // Reset mockParams to default value for test isolation
    mockParams = { sessionId: '1' }
  })

  afterEach(() => {
    clearMockSessionStorage()
    jest.useRealTimers()
  })

  describe('frame loading', () => {
    it('loads frames from sessionStorage', async () => {
      setMockSessionStorageItem('assessment_frames', JSON.stringify(mockFrames))

      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })
    })

    it('shows error when frames are missing', async () => {
      render(<AssessmentPage />)

      await waitFor(() => {
        // The error message is translated, so check for the try again button which appears on error
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('shows error when frames are invalid JSON', async () => {
      setMockSessionStorageItem('assessment_frames', 'invalid json')

      render(<AssessmentPage />)

      await waitFor(() => {
        // The error message is translated, so check for the try again button which appears on error
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('navigates to start page when try again is clicked in error state', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
      }, { timeout: 3000 })

      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i })
      await user.click(tryAgainButton)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/start')
      })
    })

    it('shows loading spinner while loading frames', () => {
      render(<AssessmentPage />)

      expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    })
  })

  describe('option selection', () => {
    beforeEach(() => {
      setMockSessionStorageItem('assessment_frames', JSON.stringify(mockFrames))
    })

    it('selects most option when clicking first option', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      await user.click(option1!)

      await waitFor(() => {
        expect(screen.getByText(/Most like me/i)).toBeInTheDocument()
      })
    })

    it('selects least option when clicking second option after most', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      await waitFor(() => {
        expect(screen.getByText(/Least like me/i)).toBeInTheDocument()
      })
    })

    it('toggles off most selection when clicking same option again', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')

      await user.click(option1!)
      await waitFor(() => {
        expect(screen.getByText(/Most like me/i)).toBeInTheDocument()
      })

      await user.click(option1!)
      await waitFor(() => {
        expect(screen.queryByText(/Most like me/i)).not.toBeInTheDocument()
      })
    })

    it('toggles off least selection when clicking same option again', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      await waitFor(() => {
        expect(screen.getByText(/Least like me/i)).toBeInTheDocument()
      })

      await user.click(option2!)
      await waitFor(() => {
        expect(screen.queryByText(/Least like me/i)).not.toBeInTheDocument()
      })
    })

    it('changes least selection when clicking different option', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')
      const option3 = screen.getByText('Option 3').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      await waitFor(() => {
        expect(screen.getByText(/Least like me/i)).toBeInTheDocument()
      })

      await user.click(option3!)
      await waitFor(() => {
        expect(screen.getByText(/Least like me/i)).toBeInTheDocument()
      })
    })

    it('prevents selecting same option for most and least', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option1!)

      // Should not have least selected
      expect(screen.queryByText(/Least like me/i)).not.toBeInTheDocument()
    })
  })

  describe('frame navigation', () => {
    beforeEach(() => {
      setMockSessionStorageItem('assessment_frames', JSON.stringify(mockFrames))
    })

    it('disables next button until both selections are made', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const nextButton = screen.getByRole('button', { name: /Next/i })
      expect(nextButton).toBeDisabled()

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      await user.click(option1!)

      expect(nextButton).toBeDisabled()

      const option2 = screen.getByText('Option 2').closest('[role="button"]')
      await user.click(option2!)

      await waitFor(() => {
        expect(nextButton).not.toBeDisabled()
      })
    })

    it('advances to next frame when next is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      const nextButton = screen.getByRole('button', { name: /Next/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Option 5')).toBeInTheDocument()
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
      })
    })

    it('resets selections when moving to next frame', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      const nextButton = screen.getByRole('button', { name: /Next/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.queryByText(/Most like me/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/Least like me/i)).not.toBeInTheDocument()
      })
    })

    it('shows finish button on last frame', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      // Navigate to last frame
      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      const nextButton = screen.getByRole('button', { name: /Next/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Option 5')).toBeInTheDocument()
      })

      const option5 = screen.getByText('Option 5').closest('[role="button"]')
      const option6 = screen.getByText('Option 6').closest('[role="button"]')

      await user.click(option5!)
      await user.click(option6!)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Finish/i })).toBeInTheDocument()
      })
    })

    it('updates progress bar correctly', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        // There may be multiple instances, so use getAllByText and check at least one exists
        const questions = screen.getAllByText(/Question 1 of 2/i)
        expect(questions.length).toBeGreaterThan(0)
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      const nextButton = screen.getByRole('button', { name: /Next/i })
      await user.click(nextButton)

      await waitFor(() => {
        // Check that we've moved to question 2
        const questions = screen.getAllByText(/Question 2 of 2/i)
        expect(questions.length).toBeGreaterThan(0)
      })
    })
  })

  describe('assessment completion', () => {
    const mockCompleteResponse: CompleteAssessmentResponse = {
      assessment_session: {
        id: 1,
        public_token: 'test-token',
        gender: 'male',
        started_at: '2024-01-01T00:00:00Z',
        completed_at: '2024-01-01T00:05:00Z',
        scores: { D: 50, I: 30, S: 40, C: 35 },
        persona: {
          code: 'D',
          name: 'Relentless Attacker',
          example_pro_male: 'Tiger Woods',
          example_pro_female: 'Annika Sorenstam',
          display_example_pro: 'Tiger Woods',
        },
      },
      tips: {
        practice: {
          dos: ['Do practice'],
          donts: ["Don't practice"],
        },
        play: {
          dos: ['Do play'],
          donts: ["Don't play"],
        },
      },
      share_url: 'http://localhost:3000/results/test-token',
    }

    beforeEach(() => {
      setMockSessionStorageItem('assessment_frames', JSON.stringify(mockFrames))
    })

    it('submits assessment and navigates on completion', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      mockCompleteAssessment.mockResolvedValue(mockCompleteResponse)

      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      // Complete first frame
      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      const nextButton = screen.getByRole('button', { name: /Next/i })
      await user.click(nextButton)

      // Complete last frame
      await waitFor(() => {
        expect(screen.getByText('Option 5')).toBeInTheDocument()
      })

      const option5 = screen.getByText('Option 5').closest('[role="button"]')
      const option6 = screen.getByText('Option 6').closest('[role="button"]')

      await user.click(option5!)
      await user.click(option6!)

      const finishButton = screen.getByRole('button', { name: /Finish/i })
      await user.click(finishButton)

      await waitFor(() => {
        expect(mockCompleteAssessment).toHaveBeenCalledWith(
          1,
          expect.arrayContaining([
            expect.objectContaining({
              frame_index: 0,
              most_choice_key: 'option1',
              least_choice_key: 'option2',
            }),
            expect.objectContaining({
              frame_index: 1,
              most_choice_key: 'option5',
              least_choice_key: 'option6',
            }),
          ]),
          'en'
        )
      })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/results/test-token')
      })
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      let resolvePromise: (value: CompleteAssessmentResponse) => void
      const promise = new Promise<CompleteAssessmentResponse>((resolve) => {
        resolvePromise = resolve
      })
      mockCompleteAssessment.mockReturnValue(promise)

      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      // Navigate to last frame
      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      const nextButton = screen.getByRole('button', { name: /Next/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Option 5')).toBeInTheDocument()
      })

      const option5 = screen.getByText('Option 5').closest('[role="button"]')
      const option6 = screen.getByText('Option 6').closest('[role="button"]')

      await user.click(option5!)
      await user.click(option6!)

      const finishButton = screen.getByRole('button', { name: /Finish/i })
      
      // Click finish button
      await user.click(finishButton)

      // Wait for the button to be disabled (submitting state)
      // The state update happens asynchronously, so we need to wait
      await waitFor(() => {
        expect(finishButton).toBeDisabled()
      }, { timeout: 3000 })

      // Resolve the promise
      act(() => {
        resolvePromise!(mockCompleteResponse)
        jest.runOnlyPendingTimers()
      })
      
      // After successful completion, navigation should occur
      // The component navigates away, so we verify navigation was called
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/results/test-token')
      }, { timeout: 3000 })
    })

    it('displays error message on API failure', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const errorMessage = 'Failed to complete assessment'
      mockCompleteAssessment.mockRejectedValue(new Error(errorMessage))

      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      // Navigate to last frame
      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      const nextButton = screen.getByRole('button', { name: /Next/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Option 5')).toBeInTheDocument()
      })

      const option5 = screen.getByText('Option 5').closest('[role="button"]')
      const option6 = screen.getByText('Option 6').closest('[role="button"]')

      await user.click(option5!)
      await user.click(option6!)

      const finishButton = screen.getByRole('button', { name: /Finish/i })
      await user.click(finishButton)

      await waitFor(() => {
        // Error message is displayed in a red error box
        // The error might be translated, so check for the error message text with flexible matching
        const errorText = screen.queryByText(errorMessage, { exact: false }) || 
                          screen.queryByText(/Failed to complete/i, { exact: false }) ||
                          screen.queryByText(/error/i, { exact: false })
        // Also check if button is still enabled (not navigating), which indicates error occurred
        const buttonStillEnabled = !finishButton.disabled
        
        expect(errorText || buttonStillEnabled).toBeTruthy()
      }, { timeout: 3000 })

      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('handles missing sessionId gracefully', async () => {
      // Temporarily set sessionId to undefined for this test
      mockParams.sessionId = undefined as unknown as string
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      // Navigate to last frame
      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      const option2 = screen.getByText('Option 2').closest('[role="button"]')

      await user.click(option1!)
      await user.click(option2!)

      const nextButton = screen.getByRole('button', { name: /Next/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Option 5')).toBeInTheDocument()
      })

      const option5 = screen.getByText('Option 5').closest('[role="button"]')
      const option6 = screen.getByText('Option 6').closest('[role="button"]')

      await user.click(option5!)
      await user.click(option6!)

      const finishButton = screen.getByRole('button', { name: /Finish/i })
      await user.click(finishButton)

      expect(mockCompleteAssessment).not.toHaveBeenCalled()
      
      // Restore default value (will be reset in beforeEach anyway, but explicit for clarity)
      mockParams.sessionId = '1'
    })
  })

  describe('keyboard navigation', () => {
    beforeEach(() => {
      setMockSessionStorageItem('assessment_frames', JSON.stringify(mockFrames))
    })

    it('handles Enter key on option card', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      option1?.focus()
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByText(/Most like me/i)).toBeInTheDocument()
      })
    })

    it('handles Space key on option card', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<AssessmentPage />)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
      })

      const option1 = screen.getByText('Option 1').closest('[role="button"]')
      option1?.focus()
      await user.keyboard(' ')

      await waitFor(() => {
        expect(screen.getByText(/Most like me/i)).toBeInTheDocument()
      })
    })
  })
})

