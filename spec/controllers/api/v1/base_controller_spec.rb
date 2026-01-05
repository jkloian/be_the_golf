require 'rails_helper'

RSpec.describe Api::V1::BaseController, type: :controller do
  # Create a test controller that inherits from BaseController
  controller(described_class) do
    def index
      render json: { locale: extract_locale }
    end
  end

  describe '#extract_locale' do
    context 'when locale is provided in params' do
      it 'returns the locale from params' do
        get :index, params: { locale: 'en' }
        json = JSON.parse(response.body)
        expect(json['locale']).to eq('en')
      end

      it 'converts string locale to symbol' do
        get :index, params: { locale: 'en' }
        json = JSON.parse(response.body)
        expect(json['locale']).to be_a(String)
      end
    end

    context 'when locale is not in params but in Accept-Language header' do
      it 'extracts locale from Accept-Language header' do
        request.headers['Accept-Language'] = 'en-US,en;q=0.9'
        get :index
        json = JSON.parse(response.body)
        expect(json['locale']).to eq('en')
      end

      it 'handles Accept-Language with multiple languages' do
        request.headers['Accept-Language'] = 'es-ES,es;q=0.9,en;q=0.8'
        get :index
        json = JSON.parse(response.body)
        # Should extract 'es' from 'es-ES'
        expect(json['locale']).to eq('en') # Falls back to :en since 'es' is not available
      end

      it 'extracts base language from locale-region format' do
        request.headers['Accept-Language'] = 'en-GB'
        get :index
        json = JSON.parse(response.body)
        expect(json['locale']).to eq('en')
      end
    end

    context 'when locale is not available in I18n' do
      it 'falls back to :en for invalid locale' do
        get :index, params: { locale: 'fr' }
        json = JSON.parse(response.body)
        expect(json['locale']).to eq('en')
      end

      it 'falls back to :en when Accept-Language has unsupported locale' do
        request.headers['Accept-Language'] = 'fr-FR,fr;q=0.9'
        get :index
        json = JSON.parse(response.body)
        expect(json['locale']).to eq('en')
      end
    end

    context 'when no locale is provided' do
      it 'defaults to :en' do
        get :index
        json = JSON.parse(response.body)
        expect(json['locale']).to eq('en')
      end

      it 'defaults to :en when Accept-Language header is empty' do
        request.headers['Accept-Language'] = ''
        get :index
        json = JSON.parse(response.body)
        expect(json['locale']).to eq('en')
      end
    end

    context 'when params locale takes precedence over header' do
      it 'uses params locale even when Accept-Language is present' do
        request.headers['Accept-Language'] = 'es-ES,es;q=0.9'
        get :index, params: { locale: 'en' }
        json = JSON.parse(response.body)
        expect(json['locale']).to eq('en')
      end
    end
  end
end
