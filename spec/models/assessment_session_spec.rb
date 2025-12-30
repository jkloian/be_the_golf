require 'rails_helper'

RSpec.describe AssessmentSession, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:gender) }
    it { should validate_inclusion_of(:gender).in_array(%w[male female unspecified]) }
    it { should validate_uniqueness_of(:public_token) }
  end

  describe 'associations' do
    it { should have_many(:assessment_responses).dependent(:destroy) }
  end

  describe 'callbacks' do
    it 'generates a public_token before validation on create' do
      session = build(:assessment_session, public_token: nil)
      session.valid?
      expect(session.public_token).to be_present
    end
  end

  describe 'scopes' do
    let!(:completed_session) { create(:assessment_session, :completed) }
    let!(:in_progress_session) { create(:assessment_session) }

    it 'returns completed sessions' do
      expect(AssessmentSession.completed).to include(completed_session)
      expect(AssessmentSession.completed).not_to include(in_progress_session)
    end

    it 'returns in-progress sessions' do
      expect(AssessmentSession.in_progress).to include(in_progress_session)
      expect(AssessmentSession.in_progress).not_to include(completed_session)
    end
  end

  describe '#completed?' do
    it 'returns true when completed_at is present' do
      session = create(:assessment_session, :completed)
      expect(session.completed?).to be true
    end

    it 'returns false when completed_at is nil' do
      session = create(:assessment_session)
      expect(session.completed?).to be false
    end
  end
end

