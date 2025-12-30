FactoryBot.define do
  factory :assessment_response do
    association :assessment_session
    frame_index { 1 }
    most_choice_key { 'A' }
    least_choice_key { 'D' }
  end
end

