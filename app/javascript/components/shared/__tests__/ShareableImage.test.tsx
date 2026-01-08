import { render, screen } from '../../../__tests__/helpers/test-utils'
import ShareableImage from '../ShareableImage'
import type { PublicAssessmentResponse } from '../../../shared/types/assessment'

const mockData: PublicAssessmentResponse = {
  assessment: {
    gender: 'male',
    scores: {
      D: 70,
      I: 30,
      S: 20,
      C: 10,
    },
    persona: {
      code: 'D',
      name: 'Relentless Attacker',
      style_tagline: 'A bold, pressure-driven game',
      style_truth: 'Aggressive by instinct. Dangerous when disciplined.',
      display_example_pro: 'Tiger Woods',
    },
    completed_at: '2024-01-01T00:00:00Z',
  },
  tips: {
    practice: {
      dos: [],
      donts: [],
    },
    play: {
      dos: [],
      donts: [],
    },
  },
}

describe('ShareableImage', () => {
  it('renders all required elements', () => {
    render(<ShareableImage data={mockData} />)

    // Check for style name
    expect(screen.getByText('Relentless Attacker')).toBeInTheDocument()

    // Check for pro comparison (text is split across elements)
    expect(screen.getByText('Tiger Woods')).toBeInTheDocument()
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Tiger Woods shares my playing style'
    })).toBeInTheDocument()

    // Check for style truth
    expect(screen.getByText('Aggressive by instinct. Dangerous when disciplined.')).toBeInTheDocument()

    // Check for brand name
    expect(screen.getByText('Be The Golf')).toBeInTheDocument()

    // Check for CTA (text is split across elements)
    expect(screen.getByText(/Discover your golf style at/)).toBeInTheDocument()
    expect(screen.getByText(/bethegolf\.com/)).toBeInTheDocument()
  })

  it('renders with square aspect ratio by default', () => {
    const { container } = render(<ShareableImage data={mockData} />)
    const shareableDiv = container.querySelector('[data-shareable-image="true"]')
    expect(shareableDiv).toHaveStyle({ width: '1080px', height: '1080px' })
  })

  it('renders with vertical aspect ratio when specified', () => {
    const { container } = render(<ShareableImage data={mockData} aspectRatio="vertical" />)
    const shareableDiv = container.querySelector('[data-shareable-image="true"]')
    expect(shareableDiv).toHaveStyle({ width: '1080px', height: '1350px' })
  })

  it('does not render style_truth when not provided', () => {
    const dataWithoutTruth: PublicAssessmentResponse = {
      ...mockData,
      assessment: {
        ...mockData.assessment,
        persona: {
          ...mockData.assessment.persona,
          style_truth: undefined,
        },
      },
    }

    render(<ShareableImage data={dataWithoutTruth} />)
    expect(screen.queryByText('Aggressive by instinct. Dangerous when disciplined.')).not.toBeInTheDocument()
  })
})

