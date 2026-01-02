require 'rails_helper'

RSpec.describe ApiErrorHandler, type: :controller do
  # Create a test controller that includes the concern
  controller(ActionController::API) do
    include ApiErrorHandler

    def show_not_found
      AssessmentSession.find(999_999)
    end

    def create_validation_error
      AssessmentSession.create!(gender: nil)
    end

    def parameter_missing
      params.require(:missing_param)
    end
  end

  # Set up routes for the test controller
  before do
    routes.draw do
      get 'show_not_found', to: 'anonymous#show_not_found'
      post 'create_validation_error', to: 'anonymous#create_validation_error'
      get 'parameter_missing', to: 'anonymous#parameter_missing'
    end
  end

  describe '#handle_not_found' do
    it 'handles ActiveRecord::RecordNotFound' do
      get :show_not_found
      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Not Found')
      expect(json['message']).to be_present
    end

    it 'includes the exception message in response' do
      get :show_not_found
      json = JSON.parse(response.body)
      expect(json['message']).to include('AssessmentSession')
    end
  end

  describe '#handle_validation_error' do
    it 'handles ActiveRecord::RecordInvalid' do
      post :create_validation_error
      expect(response).to have_http_status(:unprocessable_content)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Validation Failed')
      expect(json['message']).to be_present
      expect(json['details']).to be_an(Array)
    end

    it 'includes error details from the record' do
      post :create_validation_error
      json = JSON.parse(response.body)
      expect(json['details']).not_to be_empty
      expect(json['details']).to all(be_a(String))
    end
  end

  describe '#handle_parameter_missing' do
    it 'handles ActionController::ParameterMissing' do
      get :parameter_missing
      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Parameter Missing')
      expect(json['message']).to be_present
    end

    it 'includes the parameter name in the message' do
      get :parameter_missing
      json = JSON.parse(response.body)
      expect(json['message']).to include('missing_param')
    end
  end
end

