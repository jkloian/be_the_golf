import { render, screen, waitFor, act } from '../../../__tests__/helpers/test-utils'
import ScoreBar from '../ScoreBar'

describe('ScoreBar', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('rendering', () => {
    it('renders label and value', () => {
      render(<ScoreBar label="Drive" value={75} color="disc-drive" />)
      expect(screen.getByText('Drive')).toBeInTheDocument()
    })

    it('displays value as percentage', async () => {
      render(<ScoreBar label="Drive" value={75} color="disc-drive" />)

      act(() => {
        jest.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(screen.getByText('75%')).toBeInTheDocument()
      })
    })
  })

  describe('color variants', () => {
    it('renders disc-drive color', () => {
      const { container } = render(<ScoreBar label="Drive" value={50} color="disc-drive" />)
      const bar = container.querySelector('.bg-gradient-to-r')
      expect(bar).toHaveClass('from-red-500', 'to-red-600')
    })

    it('renders disc-inspire color', () => {
      const { container } = render(<ScoreBar label="Inspire" value={50} color="disc-inspire" />)
      const bar = container.querySelector('.bg-gradient-to-r')
      expect(bar).toHaveClass('from-amber-500', 'to-amber-600')
    })

    it('renders disc-steady color', () => {
      const { container } = render(<ScoreBar label="Steady" value={50} color="disc-steady" />)
      const bar = container.querySelector('.bg-gradient-to-r')
      expect(bar).toHaveClass('from-green-500', 'to-green-600')
    })

    it('renders disc-control color', () => {
      const { container } = render(<ScoreBar label="Control" value={50} color="disc-control" />)
      const bar = container.querySelector('.bg-gradient-to-r')
      expect(bar).toHaveClass('from-blue-500', 'to-blue-600')
    })
  })

  describe('delay behavior', () => {
    it('applies delay before showing value', async () => {
      render(<ScoreBar label="Drive" value={75} color="disc-drive" delay={500} />)

      // Initially should show 0%
      expect(screen.getByText('0%')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(screen.getByText('75%')).toBeInTheDocument()
      })
    })

    it('uses default delay of 0', async () => {
      render(<ScoreBar label="Drive" value={75} color="disc-drive" />)

      act(() => {
        jest.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(screen.getByText('75%')).toBeInTheDocument()
      })
    })
  })

  describe('value updates', () => {
    it('updates displayed value when value prop changes', async () => {
      const { rerender } = render(<ScoreBar label="Drive" value={50} color="disc-drive" />)

      act(() => {
        jest.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(screen.getByText('50%')).toBeInTheDocument()
      })

      rerender(<ScoreBar label="Drive" value={75} color="disc-drive" />)

      act(() => {
        jest.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(screen.getByText('75%')).toBeInTheDocument()
      })
    })
  })

  describe('edge cases', () => {
    it('handles value of 0', async () => {
      render(<ScoreBar label="Drive" value={0} color="disc-drive" />)

      act(() => {
        jest.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument()
      })
    })

    it('handles value of 100', async () => {
      render(<ScoreBar label="Drive" value={100} color="disc-drive" />)

      act(() => {
        jest.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument()
      })
    })
  })
})

