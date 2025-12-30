require 'rails_helper'

RSpec.describe AssessmentResponse, type: :model do
  describe 'validations' do
    it { is_expected.to belong_to(:assessment_session) }
    it { is_expected.to validate_presence_of(:frame_index) }
    it { is_expected.to validate_inclusion_of(:frame_index).in_array((1..16).to_a) }
    it { is_expected.to validate_presence_of(:most_choice_key) }
    it { is_expected.to validate_inclusion_of(:most_choice_key).in_array(%w[A B C D]) }
    it { is_expected.to validate_presence_of(:least_choice_key) }
    it { is_expected.to validate_inclusion_of(:least_choice_key).in_array(%w[A B C D]) }
    it { is_expected.to validate_uniqueness_of(:frame_index).scoped_to(:assessment_session_id) }
  end

  describe 'custom validations' do
    it 'validates that most and least choice keys are different' do
      session = create(:assessment_session)
      response = build(:assessment_response, assessment_session: session, most_choice_key: 'A', least_choice_key: 'A')
      expect(response).not_to be_valid
      expect(response.errors[:least_choice_key]).to include('must be different from most choice')
    end
  end
end
