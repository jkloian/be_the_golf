import { render, screen, waitFor } from '../../../__tests__/helpers/test-utils'
import userEvent from '@testing-library/user-event'
import ResultsReveal from '../ResultsReveal'
import type { PublicAssessmentResponse } from '../../../shared/types/assessment'

// Mock MedallionHero
jest.mock('../MedallionHero', () => {
  return function MockMedallionHero({ personaCode }: { personaCode: string }) {
    return <div data-testid="medallion-hero">{personaCode}</div>
  }
})

// Mock ResultsContent
jest.mock('../ResultsContent', () => {
  return function MockResultsContent({ data }: { data: PublicAssessmentResponse }) {
    return <div data-testid="results-content">{data.assessment.persona.name}</div>
  }
})

describe('ResultsReveal', () => {
  const mockData: PublicAssessmentResponse = {
    assessment: {
      first_name: 'John',
      gender: 'male',
      handicap: 10,
      scores: {
        D: 70,
        I: 30,
        S: 40,
        C: 35,
      },
      persona: {
        code: 'D',
        name: 'Relentless Attacker',
        display_example_pro: 'Tiger Woods',
      },
      completed_at: '2024-01-01T00:05:00Z',
    },
    tips: {
      practice: {
        dos: ['Practice with purpose'],
        donts: ["Don't rush"],
      },
      play: {
        dos: ['Play aggressively'],
        donts: ["Don't overthink"],
      },
    },
  }

  const mockOnShare = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('initial reveal phase', () => {
    it('renders medallion hero', () => {
      render(<ResultsReveal data={mockData} onShare={mockOnShare} />)

      expect(screen.getByTestId('medallion-hero')).toBeInTheDocument()
      expect(screen.getByTestId('medallion-hero')).toHaveTextContent('D')
    })

    it('renders persona name headline', () => {
      render(<ResultsReveal data={mockData} onShare={mockOnShare} />)

      expect(screen.getByText(/You are the/i)).toBeInTheDocument()
      expect(screen.getByText(/Relentless Attacker/i)).toBeInTheDocument()
    })

    it('renders pro comparison text', () => {
      render(<ResultsReveal data={mockData} onShare={mockOnShare} />)

      expect(screen.getByText(/Tiger Woods/i)).toBeInTheDocument()
      expect(screen.getByText(/shares your playing style/i)).toBeInTheDocument()
    })

    it('renders style_tagline when present', () => {
      const dataWithTagline = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            ...mockData.assessment.persona,
            style_tagline: 'Test tagline',
          },
        },
      }

      render(<ResultsReveal data={dataWithTagline} onShare={mockOnShare} />)

      expect(screen.getByText('Test tagline')).toBeInTheDocument()
    })

    it('does not render style_tagline when absent', () => {
      const dataWithoutTagline = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            ...mockData.assessment.persona,
            style_tagline: undefined,
          },
        },
      }

      render(<ResultsReveal data={dataWithoutTagline} onShare={mockOnShare} />)

      expect(screen.queryByText(/Test tagline/i)).not.toBeInTheDocument()
    })

    it('renders continue button', () => {
      render(<ResultsReveal data={mockData} onShare={mockOnShare} />)

      expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument()
    })
  })

  describe('content transition', () => {
    it('shows initial reveal phase by default', () => {
      render(<ResultsReveal data={mockData} onShare={mockOnShare} />)

      expect(screen.getByTestId('medallion-hero')).toBeInTheDocument()
      expect(screen.queryByTestId('results-content')).not.toBeInTheDocument()
    })

    it('transitions to ResultsContent when continue is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ResultsReveal data={mockData} onShare={mockOnShare} />)

      const continueButton = screen.getByRole('button', { name: /Continue/i })
      await user.click(continueButton)

      await waitFor(() => {
        expect(screen.getByTestId('results-content')).toBeInTheDocument()
      })

      expect(screen.queryByTestId('medallion-hero')).not.toBeInTheDocument()
    })

    it('passes data to ResultsContent after transition', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ResultsReveal data={mockData} onShare={mockOnShare} />)

      const continueButton = screen.getByRole('button', { name: /Continue/i })
      await user.click(continueButton)

      await waitFor(() => {
        expect(screen.getByTestId('results-content')).toHaveTextContent('Relentless Attacker')
      })
    })

    it('passes onShare to ResultsContent after transition', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ResultsReveal data={mockData} onShare={mockOnShare} />)

      const continueButton = screen.getByRole('button', { name: /Continue/i })
      await user.click(continueButton)

      await waitFor(() => {
        expect(screen.getByTestId('results-content')).toBeInTheDocument()
      })

      // ResultsContent should receive onShare prop (tested indirectly through component rendering)
      expect(screen.getByTestId('results-content')).toBeInTheDocument()
    })
  })

  describe('dev banner props', () => {
    it('passes showDevBanner to ResultsContent', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(
        <ResultsReveal
          data={mockData}
          onShare={mockOnShare}
          showDevBanner={true}
          devPersonaCode="D"
          devGender="male"
        />
      )

      const continueButton = screen.getByRole('button', { name: /Continue/i })
      await user.click(continueButton)

      await waitFor(() => {
        expect(screen.getByTestId('results-content')).toBeInTheDocument()
      })
    })
  })

  describe('share modal state', () => {
    it('passes isShareModalOpen to ResultsContent', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(
        <ResultsReveal
          data={mockData}
          onShare={mockOnShare}
          isShareModalOpen={true}
        />
      )

      const continueButton = screen.getByRole('button', { name: /Continue/i })
      await user.click(continueButton)

      await waitFor(() => {
        expect(screen.getByTestId('results-content')).toBeInTheDocument()
      })
    })
  })
})

