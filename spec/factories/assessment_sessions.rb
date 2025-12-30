FactoryBot.define do
  factory :assessment_session do
    first_name { 'John' }
    gender { 'male' }
    handicap { 14 }
    started_at { Time.current }
    public_token { SecureRandom.urlsafe_base64(16) }

    trait :completed do
      completed_at { Time.current }
      score_d { 72 }
      score_i { 55 }
      score_s { 40 }
      score_c { 65 }
      persona_code { 'DC' }
      persona_name { 'Attacking Analyst' }
      example_pro_male { 'Jon Rahm' }
      example_pro_female { 'Lorena Ochoa' }
      display_example_pro { 'Jon Rahm' }
    end

    trait :female do
      gender { 'female' }
    end

    trait :unspecified_gender do
      gender { 'unspecified' }
    end

    trait :no_handicap do
      handicap { nil }
    end
  end
end
