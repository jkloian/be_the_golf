class PersonaResolver
  def self.resolve(scores, gender, locale = :en)
    sorted_scores = scores.sort_by { |_k, v| -v }
    primary_style, primary_score = sorted_scores[0]
    secondary_style, secondary_score = sorted_scores[1]
    min_score = sorted_scores.last[1]
    max_score = primary_score

    # Determine persona code
    persona_code = if (max_score - min_score) <= 10
                     "BALANCED"
    elsif primary_score >= 60 && (primary_score - secondary_score) >= 15
                     primary_style.to_s
    else
                     # Two-style combo - sort styles alphabetically for consistency
                     [ primary_style.to_s, secondary_style.to_s ].sort.join
    end

    # Load persona data from i18n
    persona_data = I18n.t("personas.#{persona_code}", locale: locale, raise: true)

    # Select display example pro based on gender
    display_example_pro = case gender
    when "male"
                           persona_data[:example_pro_male]
    when "female"
                           persona_data[:example_pro_female]
    else
                           persona_data[:example_pro_male] # Default to male for unspecified
    end

    {
      code: persona_code,
      name: persona_data[:name],
      style_summary: persona_data[:style_summary],
      style_tagline: persona_data[:style_tagline],
      style_truth: persona_data[:style_truth],
      style_watchout: persona_data[:style_watchout],
      style_reset: persona_data[:style_reset],
      example_pro_male: persona_data[:example_pro_male],
      example_pro_female: persona_data[:example_pro_female],
      display_example_pro: display_example_pro
    }
  rescue I18n::MissingTranslationData
    # Fallback if translation missing
    {
      code: persona_code,
      name: persona_code,
      style_summary: "",
      style_tagline: "",
      style_truth: "",
      style_watchout: "",
      style_reset: "",
      example_pro_male: "",
      example_pro_female: "",
      display_example_pro: ""
    }
  end
end
