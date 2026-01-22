require 'rails_helper'

RSpec.describe PersonaResolver do
  describe '.resolve' do
    context 'with balanced scores' do
      let(:scores) { { D: 50, I: 48, S: 52, C: 50 } }

      it 'returns BALANCED persona' do
        result = described_class.resolve(scores, 'male', :en)
        expect(result[:code]).to eq('BALANCED')
        expect(result[:name]).to eq('Dynamic Course Commander')
      end
    end

    context 'with strong single-style score' do
      let(:scores) { { D: 75, I: 45, S: 40, C: 35 } }

      it 'returns single-style persona' do
        result = described_class.resolve(scores, 'male', :en)
        expect(result[:code]).to eq('D')
        expect(result[:name]).to eq('Relentless Attacker')
        expect(result[:display_example_pro]).to eq('Tiger Woods')
      end
    end

    context 'with two-style combo' do
      let(:scores) { { D: 70, C: 65, I: 40, S: 35 } }

      it 'returns two-style combo persona' do
        result = described_class.resolve(scores, 'male', :en)
        expect(result[:code]).to eq('CD') # Styles are sorted alphabetically
        expect(result[:name]).to eq('Attacking Analyst')
        expect(result[:display_example_pro]).to eq('Jon Rahm')
      end
    end

    context 'with female gender' do
      let(:scores) { { D: 70, C: 65, I: 40, S: 35 } }

      it 'returns female pro example' do
        result = described_class.resolve(scores, 'female', :en)
        expect(result[:display_example_pro]).to eq('Lorena Ochoa')
      end
    end

    context 'with unspecified gender' do
      let(:scores) { { D: 70, C: 65, I: 40, S: 35 } }

      it 'defaults to male pro example' do
        result = described_class.resolve(scores, 'unspecified', :en)
        expect(result[:display_example_pro]).to eq('Jon Rahm')
      end
    end

    context 'when CS is generated (C primary, S secondary)' do
      let(:scores) { { C: 70, S: 65, D: 40, I: 35 } }

      it 'normalizes CS to SC' do
        result = described_class.resolve(scores, 'male', :en)
        expect(result[:code]).to eq('SC')
        expect(result[:name]).to eq('Steady Technician')
        expect(result[:display_example_pro]).to eq('Jim Furyk')
      end
    end

    context 'when CI is generated (C primary, I secondary)' do
      let(:scores) { { C: 70, I: 65, D: 40, S: 35 } }

      it 'normalizes CI to IC' do
        result = described_class.resolve(scores, 'male', :en)
        expect(result[:code]).to eq('IC')
        expect(result[:name]).to eq('Imaginative Planner')
        expect(result[:display_example_pro]).to eq('Phil Mickelson')
      end
    end

    context 'when DC is generated (D primary, C secondary)' do
      let(:scores) { { D: 70, C: 65, I: 40, S: 35 } }

      it 'normalizes DC to CD' do
        result = described_class.resolve(scores, 'male', :en)
        expect(result[:code]).to eq('CD')
        expect(result[:name]).to eq('Attacking Analyst')
        expect(result[:display_example_pro]).to eq('Jon Rahm')
      end
    end
  end

  describe '.normalize_persona_code' do
      it 'normalizes CS to SC' do
        expect(described_class.normalize_persona_code('CS')).to eq('SC')
      end

      it 'normalizes CI to IC' do
        expect(described_class.normalize_persona_code('CI')).to eq('IC')
      end

      it 'normalizes DC to CD' do
        expect(described_class.normalize_persona_code('DC')).to eq('CD')
      end

      it 'returns unchanged for canonical forms' do
        expect(described_class.normalize_persona_code('SC')).to eq('SC')
        expect(described_class.normalize_persona_code('IC')).to eq('IC')
        expect(described_class.normalize_persona_code('CD')).to eq('CD')
      end

      it 'returns unchanged for other codes' do
        expect(described_class.normalize_persona_code('D')).to eq('D')
        expect(described_class.normalize_persona_code('DI')).to eq('DI')
        expect(described_class.normalize_persona_code('BALANCED')).to eq('BALANCED')
      end
  end
end
