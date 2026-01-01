class TipsGenerator
  def self.generate(scores, persona_code, locale = :en)
    persona_code = persona_code.to_s.upcase

    case persona_code
    when "D", "I", "S", "C"
      generate_single_style(scores, persona_code.to_sym, locale)
    when "BALANCED"
      generate_balanced(scores, locale)
    else
      # Combination personas (DI, DS, CD, DC, IS, IC, SC)
      generate_combination(scores, persona_code, locale)
    end
  rescue I18n::MissingTranslationData, StandardError => e
    Rails.logger.error("TipsGenerator error: #{e.message}")
    {
      practice: { dos: [], donts: [] },
      play: { dos: [], donts: [] }
    }
  end

  private

  def self.intensity_band(score)
    return :moderate if score >= 40 && score <= 59
    return :high if score >= 60 && score <= 79
    return :extreme if score >= 80 && score <= 100
    :moderate # fallback for scores outside expected range
  end

  def self.select_tips_for_style(style, band, context, polarity, count, locale)
    tips_path = "tips.styles.#{style}.#{context}.#{polarity}.#{band}"
    tips = I18n.t(tips_path, locale: locale, default: [])

    # Return requested count, or all available if fewer
    tips.first(count)
  end

  def self.generate_single_style(scores, style, locale)
    score = scores[style]
    band = intensity_band(score)

    practice_dos = select_tips_for_style(style, band, :training, :dos, 2, locale)
    practice_donts = select_tips_for_style(style, band, :training, :donts, 2, locale)
    play_dos = select_tips_for_style(style, band, :playing, :dos, 2, locale)
    play_donts = select_tips_for_style(style, band, :playing, :donts, 2, locale)

    {
      practice: {
        dos: practice_dos,
        donts: practice_donts
      },
      play: {
        dos: play_dos,
        donts: play_donts
      }
    }
  end

  def self.generate_combination(scores, persona_code, locale)
    # Extract primary and secondary styles from persona code
    styles = persona_code.chars.map(&:to_sym)
    primary_style = styles[0]
    secondary_style = styles[1]

    primary_score = scores[primary_style] || 0
    secondary_score = scores[secondary_style] || 0

    primary_band = intensity_band(primary_score)
    secondary_band = intensity_band(secondary_score)

    # For combination personas, mix tips from both styles
    # Get 1 do and 1 don't from each style for each category
    practice_dos_primary = select_tips_for_style(primary_style, primary_band, :training, :dos, 1, locale)
    practice_dos_secondary = select_tips_for_style(secondary_style, secondary_band, :training, :dos, 1, locale)
    practice_donts_primary = select_tips_for_style(primary_style, primary_band, :training, :donts, 1, locale)
    practice_donts_secondary = select_tips_for_style(secondary_style, secondary_band, :training, :donts, 1, locale)

    play_dos_primary = select_tips_for_style(primary_style, primary_band, :playing, :dos, 1, locale)
    play_dos_secondary = select_tips_for_style(secondary_style, secondary_band, :playing, :dos, 1, locale)
    play_donts_primary = select_tips_for_style(primary_style, primary_band, :playing, :donts, 1, locale)
    play_donts_secondary = select_tips_for_style(secondary_style, secondary_band, :playing, :donts, 1, locale)

    # Combine tips, ensuring we have exactly 2 dos and 2 donts for each category
    # If secondary style doesn't provide enough, fill from primary
    practice_dos = (practice_dos_primary + practice_dos_secondary).first(2)
    if practice_dos.length < 2
      practice_dos += select_tips_for_style(primary_style, primary_band, :training, :dos, 2 - practice_dos.length, locale)
    end

    practice_donts = (practice_donts_primary + practice_donts_secondary).first(2)
    if practice_donts.length < 2
      practice_donts += select_tips_for_style(primary_style, primary_band, :training, :donts, 2 - practice_donts.length, locale)
    end

    play_dos = (play_dos_primary + play_dos_secondary).first(2)
    if play_dos.length < 2
      play_dos += select_tips_for_style(primary_style, primary_band, :playing, :dos, 2 - play_dos.length, locale)
    end

    play_donts = (play_donts_primary + play_donts_secondary).first(2)
    if play_donts.length < 2
      play_donts += select_tips_for_style(primary_style, primary_band, :playing, :donts, 2 - play_donts.length, locale)
    end

    {
      practice: {
        dos: practice_dos.first(2),
        donts: practice_donts.first(2)
      },
      play: {
        dos: play_dos.first(2),
        donts: play_donts.first(2)
      }
    }
  end

  def self.generate_balanced(scores, locale)
    # Find top two styles by score
    sorted_scores = scores.sort_by { |_k, v| -v }
    primary_style, primary_score = sorted_scores[0]
    secondary_style, secondary_score = sorted_scores[1]

    primary_band = intensity_band(primary_score)
    secondary_band = intensity_band(secondary_score)

    # Balanced: 1 do + 1 don't from each style for training, same for playing
    practice_dos_primary = select_tips_for_style(primary_style, primary_band, :training, :dos, 1, locale)
    practice_donts_primary = select_tips_for_style(primary_style, primary_band, :training, :donts, 1, locale)
    practice_dos_secondary = select_tips_for_style(secondary_style, secondary_band, :training, :dos, 1, locale)
    practice_donts_secondary = select_tips_for_style(secondary_style, secondary_band, :training, :donts, 1, locale)

    play_dos_primary = select_tips_for_style(primary_style, primary_band, :playing, :dos, 1, locale)
    play_donts_primary = select_tips_for_style(primary_style, primary_band, :playing, :donts, 1, locale)
    play_dos_secondary = select_tips_for_style(secondary_style, secondary_band, :playing, :dos, 1, locale)
    play_donts_secondary = select_tips_for_style(secondary_style, secondary_band, :playing, :donts, 1, locale)

    {
      practice: {
        dos: practice_dos_primary + practice_dos_secondary,
        donts: practice_donts_primary + practice_donts_secondary
      },
      play: {
        dos: play_dos_primary + play_dos_secondary,
        donts: play_donts_primary + play_donts_secondary
      }
    }
  end
end
