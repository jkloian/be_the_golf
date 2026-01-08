import { render, screen } from '../../../__tests__/helpers/test-utils'
import userEvent from '@testing-library/user-event'
import ResultsContent from '../ResultsContent'
import type { PublicAssessmentResponse } from '../../../shared/types/assessment'

// Mock MedallionHero to avoid image loading issues
jest.mock('../MedallionHero', () => {
  return function MockMedallionHero({ personaCode }: { personaCode: string }) {
    return <div data-testid="medallion-hero">{personaCode}</div>
  }
})

describe('ResultsContent', () => {
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
        dos: ['Practice with purpose', 'Focus on power'],
        donts: ["Don't rush", "Don't skip warm-up"],
      },
      play: {
        dos: ['Play aggressively', 'Take calculated risks'],
        donts: ["Don't overthink", "Don't play safe"],
      },
    },
  }

  const mockOnShare = jest.fn()

  describe('rendering', () => {
    it('renders persona information', () => {
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      expect(screen.getByText(/You are the/i)).toBeInTheDocument()
      expect(screen.getByText(/Relentless Attacker/i)).toBeInTheDocument()
      expect(screen.getByText(/Tiger Woods/i)).toBeInTheDocument()
    })

    it('renders MedallionHero with correct persona code', () => {
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      const medallion = screen.getByTestId('medallion-hero')
      expect(medallion).toHaveTextContent('D')
    })

    it('renders ViewModeToggle', () => {
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      expect(screen.getByRole('button', { name: /Practice Protocol/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Course Strategy/i })).toBeInTheDocument()
    })

    it('renders share button', () => {
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      expect(screen.getByRole('button', { name: /Share/i })).toBeInTheDocument()
    })
  })

  describe('view mode toggle', () => {
    it('defaults to PRACTICE mode', () => {
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      // Should show practice tips (default view)
      expect(screen.getByText(/During Practice/i)).toBeInTheDocument()
    })

    it('switches to COURSE mode when Course Strategy is clicked', async () => {
      const user = userEvent.setup()
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      const courseButton = screen.getByRole('button', { name: /Course Strategy/i })
      await user.click(courseButton)

      // Wait for content to switch
      await screen.findByText(/On the Course/i)
      expect(screen.getByText(/On the Course/i)).toBeInTheDocument()
    })

    it('switches back to PRACTICE mode when Practice Protocol is clicked', async () => {
      const user = userEvent.setup()
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      // Switch to COURSE first
      const courseButton = screen.getByRole('button', { name: /Course Strategy/i })
      await user.click(courseButton)

      // Switch back to PRACTICE
      const practiceButton = screen.getByRole('button', { name: /Practice Protocol/i })
      await user.click(practiceButton)

      expect(screen.getByText(/During Practice/i)).toBeInTheDocument()
    })
  })

  describe('practice tips display', () => {
    it('displays practice tips when in PRACTICE mode', () => {
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      expect(screen.getByText(/During Practice/i)).toBeInTheDocument()
      expect(screen.getByText('Practice with purpose')).toBeInTheDocument()
      expect(screen.getByText("Don't rush")).toBeInTheDocument()
    })

    it('displays all practice dos', () => {
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      expect(screen.getByText('Practice with purpose')).toBeInTheDocument()
      expect(screen.getByText('Focus on power')).toBeInTheDocument()
    })

    it('displays all practice donts', () => {
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      expect(screen.getByText("Don't rush")).toBeInTheDocument()
      expect(screen.getByText("Don't skip warm-up")).toBeInTheDocument()
    })
  })

  describe('course tips display', () => {
    it('displays course tips when in COURSE mode', async () => {
      const user = userEvent.setup()
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      const courseButton = screen.getByRole('button', { name: /Course Strategy/i })
      await user.click(courseButton)

      // Wait for content to switch
      await screen.findByText(/On the Course/i)
      expect(screen.getByText('Play aggressively')).toBeInTheDocument()
      expect(screen.getByText("Don't overthink")).toBeInTheDocument()
    })

    it('displays all course dos', async () => {
      const user = userEvent.setup()
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      const courseButton = screen.getByRole('button', { name: /Course Strategy/i })
      await user.click(courseButton)

      // Wait for content to switch
      await screen.findByText(/On the Course/i)
      expect(screen.getByText('Play aggressively')).toBeInTheDocument()
      expect(screen.getByText('Take calculated risks')).toBeInTheDocument()
    })

    it('displays all course donts', async () => {
      const user = userEvent.setup()
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      const courseButton = screen.getByRole('button', { name: /Course Strategy/i })
      await user.click(courseButton)

      // Wait for content to switch
      await screen.findByText(/On the Course/i)
      expect(screen.getByText("Don't overthink")).toBeInTheDocument()
      expect(screen.getByText("Don't play safe")).toBeInTheDocument()
    })
  })

  describe('share functionality', () => {
    it('calls onShare when share button is clicked', async () => {
      const user = userEvent.setup()
      render(<ResultsContent data={mockData} onShare={mockOnShare} />)

      const shareButton = screen.getByRole('button', { name: /Share/i })
      await user.click(shareButton)

      expect(mockOnShare).toHaveBeenCalledTimes(1)
    })
  })

  describe('dev banner', () => {
    it('renders dev banner when showDevBanner is true', () => {
      render(
        <ResultsContent
          data={mockData}
          onShare={mockOnShare}
          showDevBanner={true}
          devPersonaCode="D"
          devGender="male"
        />
      )

      expect(screen.getByText(/DEV MODE/i)).toBeInTheDocument()
      expect(screen.getByText(/Showing D persona/i)).toBeInTheDocument()
      expect(screen.getByText(/male/i)).toBeInTheDocument()
    })

    it('does not render dev banner when showDevBanner is false', () => {
      render(<ResultsContent data={mockData} onShare={mockOnShare} showDevBanner={false} />)

      expect(screen.queryByText(/DEV MODE/i)).not.toBeInTheDocument()
    })
  })

  describe('different persona codes', () => {
    it('renders I persona correctly', () => {
      const iData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'I',
            name: 'Charismatic Shotmaker',
            display_example_pro: 'Phil Mickelson',
          },
        },
      }

      render(<ResultsContent data={iData} onShare={mockOnShare} />)

      expect(screen.getByText(/Charismatic Shotmaker/i)).toBeInTheDocument()
      expect(screen.getByText(/Phil Mickelson/i)).toBeInTheDocument()
    })

    it('renders combo persona correctly', () => {
      const comboData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'DI',
            name: 'Electric Playmaker',
            display_example_pro: 'Bubba Watson',
          },
        },
      }

      render(<ResultsContent data={comboData} onShare={mockOnShare} />)

      expect(screen.getByText(/Electric Playmaker/i)).toBeInTheDocument()
      expect(screen.getByText(/Bubba Watson/i)).toBeInTheDocument()
    })

    it('renders S persona correctly', () => {
      const sData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'S',
            name: 'Smooth Rhythm Player',
            display_example_pro: 'Ernie Els',
          },
        },
      }

      render(<ResultsContent data={sData} onShare={mockOnShare} />)

      expect(screen.getByText(/Smooth Rhythm Player/i)).toBeInTheDocument()
    })

    it('renders C persona correctly', () => {
      const cData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'C',
            name: 'Master Strategist',
            display_example_pro: 'Jack Nicklaus',
          },
        },
      }

      render(<ResultsContent data={cData} onShare={mockOnShare} />)

      expect(screen.getByText(/Master Strategist/i)).toBeInTheDocument()
    })

    it('renders DS persona correctly', () => {
      const dsData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'DS',
            name: 'Controlled Aggressor',
            display_example_pro: 'Vijay Singh',
          },
        },
      }

      render(<ResultsContent data={dsData} onShare={mockOnShare} />)

      expect(screen.getByText(/Controlled Aggressor/i)).toBeInTheDocument()
    })

    it('renders CD persona correctly', () => {
      const cdData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'CD',
            name: 'Attacking Analyst',
            display_example_pro: 'Ben Hogan',
          },
        },
      }

      render(<ResultsContent data={cdData} onShare={mockOnShare} />)

      expect(screen.getByText(/Attacking Analyst/i)).toBeInTheDocument()
    })

    it('renders DC persona correctly', () => {
      const dcData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'DC',
            name: 'Attacking Analyst',
            display_example_pro: 'Ben Hogan',
          },
        },
      }

      render(<ResultsContent data={dcData} onShare={mockOnShare} />)

      expect(screen.getByText(/Attacking Analyst/i)).toBeInTheDocument()
    })

    it('renders IS persona correctly', () => {
      const isData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'IS',
            name: 'Positive Rhythm Player',
            display_example_pro: 'Arnold Palmer',
          },
        },
      }

      render(<ResultsContent data={isData} onShare={mockOnShare} />)

      expect(screen.getByText(/Positive Rhythm Player/i)).toBeInTheDocument()
    })

    it('renders IC persona correctly', () => {
      const icData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'IC',
            name: 'Imaginative Planner',
            display_example_pro: 'Seve Ballesteros',
          },
        },
      }

      render(<ResultsContent data={icData} onShare={mockOnShare} />)

      expect(screen.getByText(/Imaginative Planner/i)).toBeInTheDocument()
    })

    it('renders SC persona correctly', () => {
      const scData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'SC',
            name: 'Steady Technician',
            display_example_pro: 'Bernhard Langer',
          },
        },
      }

      render(<ResultsContent data={scData} onShare={mockOnShare} />)

      expect(screen.getByText(/Steady Technician/i)).toBeInTheDocument()
    })

    it('renders BALANCED persona correctly', () => {
      const balancedData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'BALANCED',
            name: 'Complete Game Planner',
            display_example_pro: 'Gary Player',
          },
        },
      }

      render(<ResultsContent data={balancedData} onShare={mockOnShare} />)

      expect(screen.getByText(/Complete Game Planner/i)).toBeInTheDocument()
    })

    it('renders default persona for unknown code', () => {
      const unknownData = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            code: 'UNKNOWN',
            name: 'Unknown Persona',
            display_example_pro: 'Unknown Pro',
          },
        },
      }

      render(<ResultsContent data={unknownData} onShare={mockOnShare} />)

      expect(screen.getByText(/Unknown Persona/i)).toBeInTheDocument()
    })
  })

  describe('conditional rendering of style insights', () => {
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

      render(<ResultsContent data={dataWithTagline} onShare={mockOnShare} />)

      expect(screen.getByText('Test tagline')).toBeInTheDocument()
    })

    it('does not render style_tagline section when absent', () => {
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

      render(<ResultsContent data={dataWithoutTagline} onShare={mockOnShare} />)

      // The section container should not render when no tagline
      const taglineSection = screen.queryByText(/Test tagline/i)
      expect(taglineSection).not.toBeInTheDocument()
    })

    it('renders style_watchout when present', () => {
      const dataWithWatchout = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            ...mockData.assessment.persona,
            style_watchout: 'Watch out for this',
          },
        },
      }

      render(<ResultsContent data={dataWithWatchout} onShare={mockOnShare} />)

      expect(screen.getByText(/Round Killer/i)).toBeInTheDocument()
      expect(screen.getByText('Watch out for this')).toBeInTheDocument()
    })

    it('does not render style_watchout section when absent', () => {
      const dataWithoutWatchout = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            ...mockData.assessment.persona,
            style_watchout: undefined,
          },
        },
      }

      render(<ResultsContent data={dataWithoutWatchout} onShare={mockOnShare} />)

      expect(screen.queryByText(/Round Killer/i)).not.toBeInTheDocument()
    })

    it('renders style_reset when present', () => {
      const dataWithReset = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            ...mockData.assessment.persona,
            style_reset: 'Reset action',
          },
        },
      }

      render(<ResultsContent data={dataWithReset} onShare={mockOnShare} />)

      expect(screen.getByText(/When this happens, do this:/i)).toBeInTheDocument()
      expect(screen.getByText('Reset action')).toBeInTheDocument()
    })

    it('does not render style_reset section when absent', () => {
      const dataWithoutReset = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            ...mockData.assessment.persona,
            style_reset: undefined,
          },
        },
      }

      render(<ResultsContent data={dataWithoutReset} onShare={mockOnShare} />)

      expect(screen.queryByText(/When this happens, do this:/i)).not.toBeInTheDocument()
    })

    it('renders all style insights when all are present', () => {
      const dataWithAll = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            ...mockData.assessment.persona,
            style_tagline: 'Test tagline',
            style_watchout: 'Watch out',
            style_reset: 'Reset action',
          },
        },
      }

      render(<ResultsContent data={dataWithAll} onShare={mockOnShare} />)

      expect(screen.getByText('Test tagline')).toBeInTheDocument()
      expect(screen.getByText(/Round Killer/i)).toBeInTheDocument()
      expect(screen.getByText('Watch out')).toBeInTheDocument()
      expect(screen.getByText(/When this happens, do this:/i)).toBeInTheDocument()
      expect(screen.getByText('Reset action')).toBeInTheDocument()
    })

    it('renders divider when watchout or reset are present', () => {
      const dataWithWatchout = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            ...mockData.assessment.persona,
            style_tagline: 'Test tagline',
            style_watchout: 'Watch out',
          },
        },
      }

      render(<ResultsContent data={dataWithWatchout} onShare={mockOnShare} />)

      // Divider should be present between tagline and watchout
      expect(screen.getByText('Test tagline')).toBeInTheDocument()
      expect(screen.getByText(/Round Killer/i)).toBeInTheDocument()
    })

    it('does not render style insights card when none are present', () => {
      const dataWithoutInsights = {
        ...mockData,
        assessment: {
          ...mockData.assessment,
          persona: {
            ...mockData.assessment.persona,
            style_tagline: undefined,
            style_watchout: undefined,
            style_reset: undefined,
          },
        },
      }

      render(<ResultsContent data={dataWithoutInsights} onShare={mockOnShare} />)

      // The unified style insight card should not render
      expect(screen.queryByText(/Test tagline/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Round Killer/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/When this happens, do this:/i)).not.toBeInTheDocument()
    })
  })
})

