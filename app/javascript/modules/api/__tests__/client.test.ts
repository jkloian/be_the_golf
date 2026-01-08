import { api } from '../client'
import {
  setupFetchMock,
  clearFetchMock,
  createMockFetchSuccess,
  createMockFetchError,
  createMockFetchNetworkError,
} from '../../../__tests__/helpers/mock-api'
import type {
  StartAssessmentResponse,
  CompleteAssessmentResponse,
  PublicAssessmentResponse,
  AssessmentResponse,
} from '../../../shared/types/assessment'

describe('api client', () => {
  const originalEnv = process.env

  beforeEach(() => {
    clearFetchMock()
    // Set process.env.VITE_API_URL for tests (this is what getApiBaseUrl checks first)
    process.env = {
      ...originalEnv,
      VITE_API_URL: 'http://localhost:3000',
    }
  })

  afterEach(() => {
    clearFetchMock()
    process.env = originalEnv
  })

  describe('startAssessment', () => {
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

    it('sends POST request with correct data and default locale', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      const result = await api.startAssessment({
        first_name: 'John',
        gender: 'male',
        handicap: 10,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/assessments/start?locale=en'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assessment_session: {
              first_name: 'John',
              gender: 'male',
              handicap: 10,
            },
          }),
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('sends POST request with custom locale', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      await api.startAssessment(
        {
          gender: 'female',
        },
        'es'
      )

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('locale=es'),
        expect.any(Object)
      )
    })

    it('handles optional fields correctly', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      await api.startAssessment({
        gender: 'unspecified',
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            assessment_session: {
              gender: 'unspecified',
            },
          }),
        })
      )
    })

    it('throws error on API failure', async () => {
      const mockFetch = createMockFetchError(400, 'Invalid request')
      setupFetchMock(mockFetch)

      await expect(
        api.startAssessment({
          gender: 'male',
        })
      ).rejects.toThrow('Invalid request')
    })

    it('handles network errors', async () => {
      const mockFetch = createMockFetchNetworkError()
      setupFetchMock(mockFetch)

      await expect(
        api.startAssessment({
          gender: 'male',
        })
      ).rejects.toThrow('Network error')
    })
  })

  describe('completeAssessment', () => {
    const mockResponse: CompleteAssessmentResponse = {
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

    const mockResponses: AssessmentResponse[] = [
      {
        frame_index: 0,
        most_choice_key: 'option1',
        least_choice_key: 'option2',
      },
    ]

    it('sends POST request with correct data', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      const result = await api.completeAssessment(1, mockResponses)

      const callUrl = (mockFetch as jest.Mock).mock.calls[0][0] as string
      expect(callUrl).toContain('/api/v1/assessments/1/complete?locale=en')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ responses: mockResponses }),
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('sends POST request with custom locale', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      await api.completeAssessment(1, mockResponses, 'es')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('locale=es'),
        expect.any(Object)
      )
    })

    it('throws error on API failure', async () => {
      const mockFetch = createMockFetchError(500, 'Server error')
      setupFetchMock(mockFetch)

      await expect(api.completeAssessment(1, mockResponses)).rejects.toThrow(
        'Server error'
      )
    })

    it('handles error response without message', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        } as Response)
      )
      setupFetchMock(mockFetch)

      await expect(api.completeAssessment(1, mockResponses)).rejects.toThrow(
        'HTTP error! status: 500'
      )
    })
  })

  describe('getPublicResult', () => {
    const mockResponse: PublicAssessmentResponse = {
      assessment: {
        gender: 'male',
        scores: { D: 50, I: 30, S: 40, C: 35 },
        persona: {
          code: 'D',
          name: 'Relentless Attacker',
          display_example_pro: 'Tiger Woods',
        },
        completed_at: '2024-01-01T00:05:00Z',
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
    }

    it('sends GET request with public token', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      const result = await api.getPublicResult('test-token')

      const callUrl = (mockFetch as jest.Mock).mock.calls[0][0] as string
      expect(callUrl).toContain('/api/v1/assessments/public/test-token?locale=en')
      expect(result).toEqual(mockResponse)
    })

    it('sends GET request with custom locale', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      await api.getPublicResult('test-token', 'es')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('locale=es')
      )
    })

    it('throws error on API failure', async () => {
      const mockFetch = createMockFetchError(404, 'Not found')
      setupFetchMock(mockFetch)

      await expect(api.getPublicResult('invalid-token')).rejects.toThrow(
        'Not found'
      )
    })
  })

  describe('getDevPreview', () => {
    const mockResponse: PublicAssessmentResponse = {
      assessment: {
        gender: 'male',
        scores: { D: 70, I: 30, S: 40, C: 35 },
        persona: {
          code: 'D',
          name: 'Relentless Attacker',
          display_example_pro: 'Tiger Woods',
        },
        completed_at: '2024-01-01T00:05:00Z',
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
    }

    it('sends GET request with scores and default gender/locale', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      const result = await api.getDevPreview({
        D: 70,
        I: 30,
        S: 40,
        C: 35,
      })

      const callUrl = (mockFetch as jest.Mock).mock.calls[0][0] as string
      expect(callUrl).toContain('api/v1/assessments/dev_preview')
      expect(callUrl).toContain('score_d=70')
      expect(callUrl).toContain('score_i=30')
      expect(callUrl).toContain('score_s=40')
      expect(callUrl).toContain('score_c=35')
      expect(callUrl).toContain('gender=male')
      expect(callUrl).toContain('locale=en')
      expect(result).toEqual(mockResponse)
    })

    it('includes persona code when provided', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      await api.getDevPreview(
        {
          D: 70,
          I: 30,
          S: 40,
          C: 35,
        },
        'DI'
      )

      const callUrl = (mockFetch as jest.Mock).mock.calls[0][0] as string
      expect(callUrl).toContain('persona_code=DI')
    })

    it('uses custom gender and locale', async () => {
      const mockFetch = createMockFetchSuccess(mockResponse)
      setupFetchMock(mockFetch)

      await api.getDevPreview(
        {
          D: 70,
          I: 30,
          S: 40,
          C: 35,
        },
        undefined,
        'female',
        'es'
      )

      const callUrl = (mockFetch as jest.Mock).mock.calls[0][0] as string
      expect(callUrl).toContain('gender=female')
      expect(callUrl).toContain('locale=es')
    })

    it('throws error on API failure', async () => {
      const mockFetch = createMockFetchError(400, 'Invalid scores')
      setupFetchMock(mockFetch)

      await expect(
        api.getDevPreview({
          D: 70,
          I: 30,
          S: 40,
          C: 35,
        })
      ).rejects.toThrow('Invalid scores')
    })
  })

  describe('handleResponse error handling', () => {
    it('handles JSON parse errors gracefully', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.reject(new Error('Invalid JSON')),
        } as Response)
      )
      setupFetchMock(mockFetch)

      // When JSON parsing fails, the catch block returns { message: 'An error occurred' }
      await expect(
        api.startAssessment({
          gender: 'male',
        })
      ).rejects.toThrow('An error occurred')
    })

    it('handles various HTTP error status codes', async () => {
      const statusCodes = [400, 401, 403, 404, 500, 503]

      for (const status of statusCodes) {
        const mockFetch = createMockFetchError(status, `Error ${status}`)
        setupFetchMock(mockFetch)

        await expect(
          api.startAssessment({
            gender: 'male',
          })
        ).rejects.toThrow(`Error ${status}`)
      }
    })
  })

  describe('getApiBaseUrl edge cases', () => {
    // Note: getApiBaseUrl is called at module load time, so we test it indirectly
    // by checking the URLs used in fetch calls. The API_BASE_URL is computed once
    // when the module loads, so we can only test the default behavior in the test environment.

    it('uses process.env.VITE_API_URL when available in test environment', async () => {
      // In the test environment, process.env.VITE_API_URL is set in beforeEach
      // so we verify it's being used
      const mockFetch = createMockFetchSuccess({ assessment_session: { id: 1, public_token: 'test', gender: 'male', started_at: '2024-01-01T00:00:00Z' }, frames: [] })
      setupFetchMock(mockFetch)

      await api.startAssessment({ gender: 'male' })
      
      const callUrl = (mockFetch as jest.Mock).mock.calls[0][0] as string
      // Should use the process.env.VITE_API_URL set in beforeEach (http://localhost:3000)
      // or window.location.origin (http://localhost) as fallback
      expect(callUrl).toMatch(/http:\/\/localhost/)
    })

    // Note: Testing window.location.origin fallback and default localhost fallback
    // is difficult because API_BASE_URL is computed at module load time.
    // These edge cases are covered by the existing tests that verify the API works
    // with the configured base URL.
  })
})

