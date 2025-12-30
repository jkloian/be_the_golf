require 'rails_helper'

RSpec.describe AssessmentScorer do
  describe '.score' do
    let(:responses) do
      # Create responses where D is chosen Most 8 times and Least 0 times
      # I is chosen Most 4 times and Least 4 times
      # S is chosen Most 2 times and Least 6 times
      # C is chosen Most 2 times and Least 6 times
      [
        { most_choice_key: 'A', least_choice_key: 'D' }, # D most, C least
        { most_choice_key: 'A', least_choice_key: 'D' },
        { most_choice_key: 'A', least_choice_key: 'D' },
        { most_choice_key: 'A', least_choice_key: 'D' },
        { most_choice_key: 'A', least_choice_key: 'D' },
        { most_choice_key: 'A', least_choice_key: 'D' },
        { most_choice_key: 'A', least_choice_key: 'D' },
        { most_choice_key: 'A', least_choice_key: 'D' },
        { most_choice_key: 'B', least_choice_key: 'C' }, # I most, S least
        { most_choice_key: 'B', least_choice_key: 'C' },
        { most_choice_key: 'B', least_choice_key: 'C' },
        { most_choice_key: 'B', least_choice_key: 'C' },
        { most_choice_key: 'C', least_choice_key: 'B' }, # S most, I least
        { most_choice_key: 'C', least_choice_key: 'B' },
        { most_choice_key: 'D', least_choice_key: 'A' }, # C most, D least
        { most_choice_key: 'D', least_choice_key: 'A' },
      ]
    end

    it 'calculates scores correctly' do
      result = AssessmentScorer.score(responses)

      # D: 8 most, 0 least = 8 raw, score = (8 + 16) / 32 * 100 = 75
      expect(result[:scores][:D]).to eq(75)
      # I: 4 most, 4 least = 0 raw, score = (0 + 16) / 32 * 100 = 50
      expect(result[:scores][:I]).to eq(50)
      # S: 2 most, 6 least = -4 raw, score = (-4 + 16) / 32 * 100 = 37
      expect(result[:scores][:S]).to eq(37)
      # C: 2 most, 6 least = -4 raw, score = (-4 + 16) / 32 * 100 = 37
      expect(result[:scores][:C]).to eq(37)
    end

    it 'returns raw counts' do
      result = AssessmentScorer.score(responses)

      expect(result[:raw_counts][:most_d]).to eq(8)
      expect(result[:raw_counts][:least_d]).to eq(0)
      expect(result[:raw_counts][:most_i]).to eq(4)
      expect(result[:raw_counts][:least_i]).to eq(4)
    end
  end
end

