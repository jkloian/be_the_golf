class AssessmentResponse < ApplicationRecord
  belongs_to :assessment_session

  validates :frame_index, presence: true, inclusion: { in: 1..16 }
  validates :most_choice_key, presence: true, inclusion: { in: %w[A B C D] }
  validates :least_choice_key, presence: true, inclusion: { in: %w[A B C D] }
  validates :frame_index, uniqueness: { scope: :assessment_session_id }

  validate :most_and_least_different

  private

  def most_and_least_different
    return unless most_choice_key.present? && least_choice_key.present?

    errors.add(:least_choice_key, "must be different from most choice") if most_choice_key == least_choice_key
  end
end
