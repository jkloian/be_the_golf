class TipsGenerator
  def self.generate(styles, locale = :en)
    primary_style = styles[:primary]&.to_s&.upcase
    secondary_style = styles[:secondary]&.to_s&.upcase

    practice_tips = []
    play_tips = []

    # Get tips for primary style
    if primary_style
      primary_tips = I18n.t("tips.styles.#{primary_style}", locale: locale, default: {})
      practice_tips.concat(primary_tips[:practice] || [])
      play_tips.concat(primary_tips[:play] || [])
    end

    # Add tips for secondary style if different
    if secondary_style && secondary_style != primary_style
      secondary_tips = I18n.t("tips.styles.#{secondary_style}", locale: locale, default: {})
      # Add unique tips (avoid duplicates)
      (secondary_tips[:practice] || []).each do |tip|
        practice_tips << tip unless practice_tips.include?(tip)
      end
      (secondary_tips[:play] || []).each do |tip|
        play_tips << tip unless play_tips.include?(tip)
      end
    end

    {
      practice: practice_tips.uniq,
      play: play_tips.uniq
    }
  rescue I18n::MissingTranslationData
    {
      practice: [],
      play: []
    }
  end
end

