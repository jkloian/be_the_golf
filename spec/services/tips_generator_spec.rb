require 'rails_helper'

RSpec.describe TipsGenerator do
  describe '.generate' do
    context 'with single-style persona (D)' do
      let(:scores) { { D: 75, I: 45, S: 40, C: 35 } }

      it 'returns tips with correct top-level structure' do
        result = described_class.generate(scores, 'D', :en)

        expect(result).to have_key(:practice)
        expect(result).to have_key(:play)
      end

      it 'returns tips with correct practice structure' do
        result = described_class.generate(scores, 'D', :en)

        expect(result[:practice]).to have_key(:dos)
        expect(result[:practice]).to have_key(:donts)
      end

      it 'returns tips with correct play structure' do
        result = described_class.generate(scores, 'D', :en)

        expect(result[:play]).to have_key(:dos)
        expect(result[:play]).to have_key(:donts)
      end

      it 'returns correct number of tips' do
        result = described_class.generate(scores, 'D', :en)

        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
        expect(result[:play][:dos].length).to eq(2)
        expect(result[:play][:donts].length).to eq(2)
      end

      it 'returns tips as strings' do
        result = described_class.generate(scores, 'D', :en)

        expect(result[:practice][:dos].all? { |t| t.is_a?(String) }).to be true
        expect(result[:practice][:donts].all? { |t| t.is_a?(String) }).to be true
      end
    end

    context 'with moderate intensity (40-59)' do
      let(:scores) { { D: 55, I: 45, S: 40, C: 35 } }

      it 'selects tips from moderate band' do
        result = described_class.generate(scores, 'D', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
        expect(result[:play][:dos].length).to eq(2)
        expect(result[:play][:donts].length).to eq(2)
      end
    end

    context 'with high intensity (60-79)' do
      let(:scores) { { D: 70, I: 45, S: 40, C: 35 } }

      it 'selects tips from high band' do
        result = described_class.generate(scores, 'D', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
        expect(result[:play][:dos].length).to eq(2)
        expect(result[:play][:donts].length).to eq(2)
      end
    end

    context 'with extreme intensity (80-100)' do
      let(:scores) { { D: 85, I: 45, S: 40, C: 35 } }

      it 'selects tips from extreme band' do
        result = described_class.generate(scores, 'D', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
        expect(result[:play][:dos].length).to eq(2)
        expect(result[:play][:donts].length).to eq(2)
      end
    end

    context 'with combination persona (DI)' do
      let(:scores) { { D: 70, I: 65, S: 40, C: 35 } }

      it 'returns tips mixing both styles' do
        result = described_class.generate(scores, 'DI', :en)

        expect(result).to have_key(:practice)
        expect(result).to have_key(:play)
      end

      it 'returns correct number of tips for combination' do
        result = described_class.generate(scores, 'DI', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
        expect(result[:play][:dos].length).to eq(2)
        expect(result[:play][:donts].length).to eq(2)
      end
    end

    context 'with different intensity bands for combination' do
      let(:scores) { { D: 75, I: 55, S: 40, C: 35 } }

      it 'uses appropriate bands for each style' do
        result = described_class.generate(scores, 'DI', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
        expect(result[:play][:dos].length).to eq(2)
        expect(result[:play][:donts].length).to eq(2)
      end
    end

    context 'with balanced persona' do
      let(:scores) { { D: 63, C: 58, I: 47, S: 45 } }

      it 'returns tips from top two styles' do
        result = described_class.generate(scores, 'BALANCED', :en)

        expect(result).to have_key(:practice)
        expect(result).to have_key(:play)
      end

      it 'returns correct number of tips for balanced' do
        result = described_class.generate(scores, 'BALANCED', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
        expect(result[:play][:dos].length).to eq(2)
        expect(result[:play][:donts].length).to eq(2)
      end
    end

    context 'with very close scores for balanced' do
      let(:scores) { { D: 62, I: 60, S: 59, C: 58 } }

      it 'uses top two styles' do
        result = described_class.generate(scores, 'BALANCED', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
        expect(result[:play][:dos].length).to eq(2)
        expect(result[:play][:donts].length).to eq(2)
      end
    end

    context 'with edge case scores' do
      it 'handles score at moderate/high boundary (59)' do
        scores = { D: 59, I: 40, S: 35, C: 30 }
        result = described_class.generate(scores, 'D', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
      end

      it 'handles score at high/extreme boundary (79)' do
        scores = { D: 79, I: 40, S: 35, C: 30 }
        result = described_class.generate(scores, 'D', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
      end

      it 'handles score at extreme maximum (100)' do
        scores = { D: 100, I: 40, S: 35, C: 30 }
        result = described_class.generate(scores, 'D', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
      end

      it 'handles score below moderate range (fallback to moderate)' do
        scores = { D: 35, I: 40, S: 35, C: 30 }
        result = described_class.generate(scores, 'D', :en)
        expect(result[:practice][:dos].length).to eq(2)
        expect(result[:practice][:donts].length).to eq(2)
      end
    end

    context 'with all single-style personas' do
      %w[D I S C].each do |style|
        it "generates tips for #{style} persona" do
          scores = { D: 0, I: 0, S: 0, C: 0 }
          scores[style.to_sym] = 70

          result = described_class.generate(scores, style, :en)
          expect(result[:practice][:dos].length).to eq(2)
          expect(result[:practice][:donts].length).to eq(2)
          expect(result[:play][:dos].length).to eq(2)
          expect(result[:play][:donts].length).to eq(2)
        end
      end
    end

    context 'with all combination personas' do
      %w[DI DS CD DC IS IC SC].each do |combo|
        it "generates tips for #{combo} persona" do
          scores = { D: 0, I: 0, S: 0, C: 0 }
          scores[combo[0].to_sym] = 70
          scores[combo[1].to_sym] = 65

          result = described_class.generate(scores, combo, :en)
          expect(result[:practice][:dos].length).to eq(2)
          expect(result[:practice][:donts].length).to eq(2)
          expect(result[:play][:dos].length).to eq(2)
          expect(result[:play][:donts].length).to eq(2)
        end
      end
    end

    context 'when handling errors' do
      it 'returns empty arrays on missing translation' do
        scores = { D: 70, I: 40, S: 35, C: 30 }
        result = described_class.generate(scores, 'D', :nonexistent_locale)
        expect(result[:practice][:dos]).to eq([])
        expect(result[:practice][:donts]).to eq([])
        expect(result[:play][:dos]).to eq([])
        expect(result[:play][:donts]).to eq([])
      end

      it 'handles nil scores gracefully' do
        scores = { D: nil, I: 40, S: 35, C: 30 }
        expect { described_class.generate(scores, 'D', :en) }.not_to raise_error
      end
    end
  end

  describe '.intensity_band' do
    it 'returns :moderate for scores 40-59' do
      expect(described_class.send(:intensity_band, 40)).to eq(:moderate)
      expect(described_class.send(:intensity_band, 50)).to eq(:moderate)
      expect(described_class.send(:intensity_band, 59)).to eq(:moderate)
    end

    it 'returns :high for scores 60-79' do
      expect(described_class.send(:intensity_band, 60)).to eq(:high)
      expect(described_class.send(:intensity_band, 70)).to eq(:high)
      expect(described_class.send(:intensity_band, 79)).to eq(:high)
    end

    it 'returns :extreme for scores 80-100' do
      expect(described_class.send(:intensity_band, 80)).to eq(:extreme)
      expect(described_class.send(:intensity_band, 90)).to eq(:extreme)
      expect(described_class.send(:intensity_band, 100)).to eq(:extreme)
    end

    it 'returns :moderate as fallback for scores outside range' do
      expect(described_class.send(:intensity_band, 39)).to eq(:moderate)
      expect(described_class.send(:intensity_band, 101)).to eq(:moderate)
    end
  end
end
