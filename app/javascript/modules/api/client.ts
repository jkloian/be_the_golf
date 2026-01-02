import type {
  StartAssessmentResponse,
  CompleteAssessmentResponse,
  PublicAssessmentResponse,
  AssessmentResponse,
} from '../../shared/types/assessment'

// Use process.env in test environment (Jest), import.meta.env in browser (Vite)
// We use a function to avoid Babel parsing import.meta at compile time
const getApiBaseUrl = (): string => {
  // Check process.env first (available in Jest/Node)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof process !== 'undefined' && (process as any).env?.VITE_API_URL) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
    return (process as any).env.VITE_API_URL
  }
  
  // Check import.meta.env (available in browser via Vite)
  // Use Function constructor to avoid Babel parsing this at compile time
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const getImportMeta = new Function('return typeof import !== "undefined" ? import.meta : undefined')
    const importMeta = getImportMeta()
     
    if (importMeta?.env?.VITE_API_URL) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return importMeta.env.VITE_API_URL
    }
  } catch {
    // import.meta not available (e.g., in Jest)
  }
  
  // Fallback to window.location.origin or default
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
}

const API_BASE_URL = getApiBaseUrl()

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

