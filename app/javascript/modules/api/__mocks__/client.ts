// Mock implementation for api client in tests
import type {
  StartAssessmentResponse,
  CompleteAssessmentResponse,
  PublicAssessmentResponse,
  AssessmentResponse,
} from '../../shared/types/assessment'

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = (await response.json().catch(() => ({ message: 'An error occurred' }))) as {
      message?: string
    }
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export const api = {
  async startAssessment(
    data: {
      first_name?: string
      gender: 'male' | 'female' | 'unspecified'
      handicap?: number
    },
    locale: string = 'en'
  ): Promise<StartAssessmentResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/assessments/start?locale=${locale}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assessment_session: data }),
    })
    return handleResponse<StartAssessmentResponse>(response)
  },

  async completeAssessment(
    sessionId: number,
    responses: AssessmentResponse[],
    locale: string = 'en'
  ): Promise<CompleteAssessmentResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/assessments/${sessionId}/complete?locale=${locale}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      }
    )
    return handleResponse<CompleteAssessmentResponse>(response)
  },

  async getPublicResult(
    publicToken: string,
    locale: string = 'en'
  ): Promise<PublicAssessmentResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/assessments/public/${publicToken}?locale=${locale}`
    )
    return handleResponse<PublicAssessmentResponse>(response)
  },

  async getDevPreview(
    scores: { D: number; I: number; S: number; C: number },
    personaCode?: string,
    gender: 'male' | 'female' = 'male',
    locale: string = 'en'
  ): Promise<PublicAssessmentResponse> {
    const params = new URLSearchParams({
      locale,
      gender,
      score_d: scores.D.toString(),
      score_i: scores.I.toString(),
      score_s: scores.S.toString(),
      score_c: scores.C.toString(),
    })
    if (personaCode) {
      params.append('persona_code', personaCode)
    }
    const response = await fetch(
      `${API_BASE_URL}/api/v1/assessments/dev_preview?${params.toString()}`
    )
    return handleResponse<PublicAssessmentResponse>(response)
  },
}

