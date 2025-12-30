class AssessmentSession < ApplicationRecord
  has_many :assessment_responses, dependent: :destroy

  validates :gender, presence: true, inclusion: { in: %w[male female unspecified] }
  validates :public_token, presence: true, uniqueness: true

  before_validation :generate_public_token, on: :create

  enum :gender, {
    male: "male",
    female: "female",
    unspecified: "unspecified"
  }

  scope :completed, -> { where.not(completed_at: nil) }
  scope :in_progress, -> { where(completed_at: nil) }

  def completed?
    completed_at.present?
  end

  private

  def generate_public_token
    self.public_token ||= SecureRandom.urlsafe_base64(16)
  end
end
