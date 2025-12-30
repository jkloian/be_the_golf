module GolfAssessment
  FrameOption = Struct.new(:key, :text, :style)

  # Map of option keys to DISC styles
  # Pattern: A=D, B=I, C=S, D=C for all frames
  OPTION_STYLE_MAP = {
    'A' => :D,
    'B' => :I,
    'C' => :S,
    'D' => :C
  }.freeze

  def self.frames(locale = :en)
    I18n.with_locale(locale) do
      (1..16).map do |frame_num|
        frame_key = "frame_#{frame_num}"
        {
          index: frame_num,
          options: %w[A B C D].map do |key|
            text = I18n.t("assessments.frames.#{frame_key}.option_#{key.downcase}", locale: locale)
            FrameOption.new(key, text, OPTION_STYLE_MAP[key])
          end
        }
      end
    end
  end

  def self.style_for_option(option_key)
    OPTION_STYLE_MAP[option_key.upcase]
  end
end

