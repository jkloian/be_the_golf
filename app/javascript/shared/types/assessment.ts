export interface FrameOption {
  key: string
  text: string
}

export interface Frame {
  index: number
  options: FrameOption[]
}

export interface AssessmentSession {
  id: number
  public_token: string
  first_name?: string
  gender: 'male' | 'female' | 'unspecified'
  handicap?: number
  started_at: string
  completed_at?: string
  scores?: {
    D: number
    I: number
    S: number
    C: number
  }
  persona?: {
    code: string
    name: string
    style_summary?: string
    style_tagline?: string
    style_watchout?: string
    style_reset?: string
    example_pro_male: string
    example_pro_female: string
    display_example_pro: string
  }
}

export interface AssessmentResponse {
  frame_index: number
  most_choice_key: string
  least_choice_key: string
}

export interface StartAssessmentResponse {
  assessment_session: AssessmentSession
  frames: Frame[]
}

export interface CompleteAssessmentResponse {
  assessment_session: AssessmentSession
  tips: {
    practice: {
      dos: string[]
      donts: string[]
    }
    play: {
      dos: string[]
      donts: string[]
    }
  }
  share_url: string
}

export interface PublicAssessmentResponse {
  assessment: {
    first_name?: string
    gender: string
    handicap?: number
    scores: {
      D: number
      I: number
      S: number
      C: number
    }
    persona: {
      code: string
      name: string
      style_summary?: string
      style_tagline?: string
      style_truth?: string
      style_watchout?: string
      style_reset?: string
      display_example_pro: string
    }
    completed_at: string
  }
  tips: {
    practice: {
      dos: string[]
      donts: string[]
    }
    play: {
      dos: string[]
      donts: string[]
    }
  }
}

