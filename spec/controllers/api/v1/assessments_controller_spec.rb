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
      invalid_params = valid_params.merge(assessment_session: { gender: 'invalid' })
      post :start, params: invalid_params
      expect(response).to have_http_status(:unprocessable_entity)
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
    end
  end
end

