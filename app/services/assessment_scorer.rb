class AssessmentScorer
  def self.score(responses)
    # Initialize counts
    counts = {
      most: { D: 0, I: 0, S: 0, C: 0 },
      least: { D: 0, I: 0, S: 0, C: 0 }
    }

    # Count Most and Least selections
    responses.each do |response|
      most_style = GolfAssessment.style_for_option(response[:most_choice_key])
      least_style = GolfAssessment.style_for_option(response[:least_choice_key])

      counts[:most][most_style] += 1 if most_style
      counts[:least][least_style] += 1 if least_style
    end

    # Calculate raw scores and transform to 0-100
    scores = {}
    raw_counts = {}

    %i[D I S C].each do |style|
      m_x = counts[:most][style]
      l_x = counts[:least][style]
      raw_x = m_x - l_x

      # Transform: Score_X = round((Raw_X + 16) / 32.0 * 100)
      score_x = ((raw_x + 16) / 32.0 * 100).round

      scores[style] = score_x
      raw_counts["most_#{style.downcase}".to_sym] = m_x
      raw_counts["least_#{style.downcase}".to_sym] = l_x
    end

    {
      scores: scores,
      raw_counts: raw_counts
    }
  end
end

