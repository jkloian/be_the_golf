require 'rails_helper'

RSpec.describe PersonaResolver do
  describe '.resolve' do
    context 'with balanced scores' do
      let(:scores) { { D: 50, I: 48, S: 52, C: 50 } }

      it 'returns BALANCED persona' do
        result = PersonaResolver.resolve(scores, 'male', :en)
        expect(result[:code]).to eq('BALANCED')
        expect(result[:name]).to eq('Complete Game Planner')
      end
    end

    context 'with strong single-style score' do
      let(:scores) { { D: 75, I: 45, S: 40, C: 35 } }

      it 'returns single-style persona' do
        result = PersonaResolver.resolve(scores, 'male', :en)
        expect(result[:code]).to eq('D')
        expect(result[:name]).to eq('Relentless Attacker')
        expect(result[:display_example_pro]).to eq('Tiger Woods')
      end
    end

    context 'with two-style combo' do
      let(:scores) { { D: 70, C: 65, I: 40, S: 35 } }

      it 'returns two-style combo persona' do
        result = PersonaResolver.resolve(scores, 'male', :en)
        expect(result[:code]).to eq('DC')
        expect(result[:name]).to eq('Attacking Analyst')
        expect(result[:display_example_pro]).to eq('Jon Rahm')
      end
    end

    context 'with female gender' do
      let(:scores) { { D: 70, C: 65, I: 40, S: 35 } }

      it 'returns female pro example' do
        result = PersonaResolver.resolve(scores, 'female', :en)
        expect(result[:display_example_pro]).to eq('Lorena Ochoa')
      end
    end

    context 'with unspecified gender' do
      let(:scores) { { D: 70, C: 65, I: 40, S: 35 } }

      it 'defaults to male pro example' do
        result = PersonaResolver.resolve(scores, 'unspecified', :en)
        expect(result[:display_example_pro]).to eq('Jon Rahm')
      end
    end
  end
end

