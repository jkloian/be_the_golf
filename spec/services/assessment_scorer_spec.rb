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
        { most_choice_key: 'D', least_choice_key: 'A' }
      ]
    end

    it 'calculates scores correctly' do
      result = described_class.score(responses)

      # D: 8 most (A), 2 least (A from D most) = 6 raw, score = (6 + 16) / 32 * 100 = 69
      expect(result[:scores][:D]).to eq(69)
      # I: 4 most (B), 2 least (B from C most) = 2 raw, score = (2 + 16) / 32 * 100 = 56
      expect(result[:scores][:I]).to eq(56)
      # S: 2 most (C), 4 least (C from B most) = -2 raw, score = (-2 + 16) / 32 * 100 = 44
      expect(result[:scores][:S]).to eq(44)
      # C: 2 most (D), 8 least (D from A most) = -6 raw, score = (-6 + 16) / 32 * 100 = 31
      expect(result[:scores][:C]).to eq(31)
    end

    it 'returns raw counts' do
      result = described_class.score(responses)

      expect(result[:raw_counts][:most_d]).to eq(8)
      expect(result[:raw_counts][:least_d]).to eq(2)
      expect(result[:raw_counts][:most_i]).to eq(4)
      expect(result[:raw_counts][:least_i]).to eq(2)
    end
  end
end
