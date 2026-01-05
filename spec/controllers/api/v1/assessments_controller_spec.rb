require 'rails_helper'

RSpec.describe Api::V1::AssessmentsController, type: :controller do
  describe 'POST #start' do
    let(:valid_params) do
      {
        assessment_session: {
          first_name: 'John',
          gender: 'male',
          handicap: 14
        }
      }
    end

    it 'creates a new assessment session' do
      expect {
        post :start, params: valid_params
      }.to change(AssessmentSession, :count).by(1)
    end

    it 'returns session and frames' do
      post :start, params: valid_params
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['assessment_session']).to be_present
      expect(json['frames']).to be_present
      expect(json['frames'].length).to eq(16)
    end

    it 'validates gender enum' do
      invalid_params = valid_params.deep_dup
      invalid_params[:assessment_session][:gender] = 'invalid'
      expect {
        post :start, params: invalid_params
      }.to raise_error(ArgumentError, "'invalid' is not a valid gender")
    end

    it 'handles missing required parameters' do
      invalid_params = { assessment_session: { first_name: 'John' } }
      post :start, params: invalid_params
      expect(response).to have_http_status(:unprocessable_content)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Validation Failed')
      expect(json['details']).to be_an(Array)
    end

    it 'handles missing gender parameter' do
      invalid_params = { assessment_session: { first_name: 'John', handicap: 14 } }
      post :start, params: invalid_params
      expect(response).to have_http_status(:unprocessable_content)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Validation Failed')
    end

    it 'respects locale parameter' do
      post :start, params: valid_params.merge(locale: 'en')
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['frames']).to be_present
    end

    it 'extracts locale from Accept-Language header' do
      request.headers['Accept-Language'] = 'en-US,en;q=0.9'
      post :start, params: valid_params
      expect(response).to have_http_status(:created)
    end

    it 'sets started_at timestamp' do
      freeze_time = Time.current
      allow(Time).to receive(:current).and_return(freeze_time)
      post :start, params: valid_params
      session = AssessmentSession.last
      expect(session.started_at).to be_within(1.second).of(freeze_time)
    end

    it 'returns error response with correct format on validation failure' do
      invalid_params = { assessment_session: { gender: nil } }
      post :start, params: invalid_params
      expect(response).to have_http_status(:unprocessable_content)
      json = JSON.parse(response.body)
      expect(json).to have_key('error')
      expect(json).to have_key('message')
      expect(json).to have_key('details')
    end
  end

  describe 'POST #complete' do
    let(:session) { create(:assessment_session) }
    let(:responses) do
      (1..16).map do |i|
        { frame_index: i, most_choice_key: 'A', least_choice_key: 'D' }
      end
    end

    it 'completes the assessment and returns results' do
      post :complete, params: { id: session.id, responses: responses }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment_session']['scores']).to be_present
      expect(json['tips']).to be_present
      expect(json['share_url']).to be_present
    end

    it 'validates that all 16 frames are present' do
      incomplete_responses = responses[0..14] # Only 15 responses
      post :complete, params: { id: session.id, responses: incomplete_responses }
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Validation Failed')
      expect(json['message']).to include('16 responses')
    end

    it 'validates missing responses parameter' do
      post :complete, params: { id: session.id }
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Validation Failed')
      expect(json['message']).to include('responses parameter is required')
    end

    it 'validates wrong number of responses' do
      incomplete_responses = responses[0..14] # Only 15 responses
      post :complete, params: { id: session.id, responses: incomplete_responses }
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json['message']).to include('Exactly 16 responses are required')
    end

    it 'validates missing frame indices' do
      incomplete_responses = (1..15).map do |i|
        { frame_index: i, most_choice_key: 'A', least_choice_key: 'D' }
      end
      post :complete, params: { id: session.id, responses: incomplete_responses }
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json['message']).to include('16 responses')
    end

    it 'validates invalid most_choice_key' do
      invalid_responses = responses.dup
      invalid_responses[0][:most_choice_key] = 'X'
      post :complete, params: { id: session.id, responses: invalid_responses }
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json['message']).to include('Invalid most_choice_key')
    end

    it 'validates invalid least_choice_key' do
      invalid_responses = responses.dup
      invalid_responses[0][:least_choice_key] = 'Z'
      post :complete, params: { id: session.id, responses: invalid_responses }
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json['message']).to include('Invalid least_choice_key')
    end

    it 'validates that most and least choice keys are different' do
      invalid_responses = responses.dup
      invalid_responses[0][:most_choice_key] = 'A'
      invalid_responses[0][:least_choice_key] = 'A'
      post :complete, params: { id: session.id, responses: invalid_responses }
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json['message']).to include('must be different')
    end

    it 'handles invalid session ID' do
      post :complete, params: { id: 999_999, responses: responses }
      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Not Found')
    end

    it 'completes assessment with different score combinations' do
      varied_responses = (1..16).map do |i|
        # Mix up choices to get different scores
        choices = [ %w[A D], %w[B C], %w[C B], %w[D A] ]
        most, least = choices[i % 4]
        { frame_index: i, most_choice_key: most, least_choice_key: least }
      end
      post :complete, params: { id: session.id, responses: varied_responses }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment_session']['scores']).to be_present
    end

    it 'generates share_url correctly' do
      post :complete, params: { id: session.id, responses: responses }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['share_url']).to be_present
      expect(json['share_url']).to include(session.reload.public_token)
    end

    it 'includes complete response structure' do
      post :complete, params: { id: session.id, responses: responses }
      json = JSON.parse(response.body)
      expect(response).to have_http_status(:ok)
      expect(json['assessment_session']).to be_present
      expect(json['assessment_session']['scores']).to be_present
      expect(json['assessment_session']['persona']).to be_present
      expect(json['tips']).to be_present
    end

    it 'includes tips with practice and play sections' do
      post :complete, params: { id: session.id, responses: responses }
      json = JSON.parse(response.body)
      expect(json['tips']['practice']).to be_present
      expect(json['tips']['play']).to be_present
    end

    it 'updates session with scores and persona' do
      post :complete, params: { id: session.id, responses: responses }
      session.reload
      aggregate_failures do
        expect(session.score_d).to be_present
        expect(session.score_i).to be_present
        expect(session.score_s).to be_present
        expect(session.score_c).to be_present
        expect(session.persona_code).to be_present
        expect(session.completed_at).to be_present
      end
    end

    it 'handles string keys in responses' do
      string_key_responses = (1..16).map do |i|
        { 'frame_index' => i, 'most_choice_key' => 'A', 'least_choice_key' => 'D' }
      end
      post :complete, params: { id: session.id, responses: string_key_responses }
      expect(response).to have_http_status(:ok)
    end

    it 'handles symbol keys in responses' do
      symbol_key_responses = (1..16).map do |i|
        { frame_index: i, most_choice_key: 'A', least_choice_key: 'D' }
      end
      post :complete, params: { id: session.id, responses: symbol_key_responses }
      expect(response).to have_http_status(:ok)
    end

    it 'handles validation error response format' do
      invalid_responses = responses.dup
      invalid_responses[0][:most_choice_key] = 'X'
      post :complete, params: { id: session.id, responses: invalid_responses }
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json).to have_key('error')
      expect(json).to have_key('message')
    end
  end

  describe 'GET #show_public' do
    let(:session) { create(:assessment_session, :completed) }

    it 'returns public assessment data' do
      get :show_public, params: { public_token: session.public_token }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment']).to be_present
      expect(json['tips']).to be_present
    end

    it 'returns error for non-existent token' do
      get :show_public, params: { public_token: 'invalid' }
      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Not Found')
    end

    it 'returns error for incomplete assessment' do
      incomplete_session = create(:assessment_session)
      get :show_public, params: { public_token: incomplete_session.public_token }
      expect(response).to have_http_status(:unprocessable_content)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Assessment Not Completed')
      expect(json['message']).to include('not been completed')
    end

    it 'includes all required assessment fields' do
      get :show_public, params: { public_token: session.public_token }
      json = JSON.parse(response.body)
      assessment = json['assessment']
      expect(response).to have_http_status(:ok)
      %w[first_name gender handicap scores persona completed_at].each do |field|
        expect(assessment[field]).to be_present
      end
    end

    it 'includes persona information' do
      get :show_public, params: { public_token: session.public_token }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      persona = json['assessment']['persona']
      expect(persona['code']).to be_present
      expect(persona['name']).to be_present
      expect(persona['display_example_pro']).to be_present
    end

    it 'includes tips in response' do
      get :show_public, params: { public_token: session.public_token }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['tips']).to be_present
      expect(json['tips']['practice']).to be_present
      expect(json['tips']['play']).to be_present
    end

    it 'respects locale parameter' do
      get :show_public, params: { public_token: session.public_token, locale: 'en' }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['tips']).to be_present
    end

    it 'extracts locale from Accept-Language header' do
      request.headers['Accept-Language'] = 'en-US,en;q=0.9'
      get :show_public, params: { public_token: session.public_token }
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET #dev_preview' do
    before do
      # Set up route for dev_preview in test environment
      routes.draw do
        namespace :api do
          namespace :v1 do
            get 'assessments/dev_preview', to: 'assessments#dev_preview'
          end
        end
      end
    end

    it 'is only available in development mode' do
      allow(Rails.env).to receive(:development?).and_return(false)
      get :dev_preview, params: {}
      expect(response).to have_http_status(:forbidden)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Not Available')
      expect(json['message']).to include('development mode')
    end

    it 'returns preview data with default scores' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: {}
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      aggregate_failures do
        expect(json['assessment']).to be_present
        expect(json['tips']).to be_present
        expect(json['assessment']['scores']).to be_present
      end
    end

    it 'accepts score_d parameter' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: { score_d: 75 }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment']['scores']['D']).to eq(75)
    end

    it 'accepts scores hash parameter' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: { scores: { D: 70, I: 65, S: 50, C: 45 } }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment']['scores']['D']).to eq(70)
      expect(json['assessment']['scores']['I']).to eq(65)
    end

    it 'resolves persona when not provided' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: { score_d: 75, score_i: 45, score_s: 40, score_c: 35 }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment']['persona']).to be_present
      expect(json['assessment']['persona']['code']).to be_present
    end

    it 'uses provided persona_code' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: { persona_code: 'DC', gender: 'male' }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment']['persona']['code']).to eq('DC')
    end

    it 'handles gender parameter' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: { gender: 'female' }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment']['gender']).to eq('female')
    end

    it 'defaults to male gender' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: {}
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment']['gender']).to eq('male')
    end

    it 'handles invalid gender by defaulting to male' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: { gender: 'invalid' }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment']['gender']).to eq('male')
    end

    it 'returns error for invalid persona_code' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: { persona_code: 'INVALID' }
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Invalid Persona')
      expect(json['message']).to include('not found')
    end

    it 'respects locale parameter' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: { locale: 'en' }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['tips']).to be_present
    end

    it 'includes all required fields in response' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: {}
      json = JSON.parse(response.body)
      expect(response).to have_http_status(:ok)
      expect(json['assessment']['first_name']).to eq('Dev')
      %w[gender scores persona completed_at].each do |field|
        expect(json['assessment'][field]).to be_present
      end
      expect(json['tips']).to be_present
    end

    it 'selects correct example pro based on gender' do
      allow(Rails.env).to receive(:development?).and_return(true)
      get :dev_preview, params: { persona_code: 'DC', gender: 'female' }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['assessment']['persona']['display_example_pro']).to be_present
    end
  end
end
