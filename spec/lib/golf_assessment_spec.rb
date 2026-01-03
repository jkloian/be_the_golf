require 'rails_helper'

RSpec.describe GolfAssessment do
  describe '.frames' do
    it 'returns 16 frames' do
      frames = described_class.frames
      expect(frames.length).to eq(16)
    end

    it 'each frame has an index' do
      frames = described_class.frames
      frames.each_with_index do |frame, index|
        expect(frame[:index]).to eq(index + 1)
      end
    end

    it 'each frame has 4 options' do
      frames = described_class.frames
      frames.each do |frame|
        expect(frame[:options].length).to eq(4)
      end
    end

    it 'each option has a key, text, and style' do
      frames = described_class.frames
      frames.each do |frame|
        expect(frame[:options]).to all(respond_to(:key))
        expect(frame[:options]).to all(respond_to(:text))
        expect(frame[:options]).to all(respond_to(:style))
      end
    end

    it 'options have correct keys (A, B, C, D)' do
      frames = described_class.frames
      frames.each do |frame|
        keys = frame[:options].map(&:key)
        expect(keys).to match_array(%w[A B C D])
      end
    end

    it 'options map to correct styles (A=D, B=I, C=S, D=C)' do
      frames = described_class.frames
      style_mapping = { 'A' => :D, 'B' => :I, 'C' => :S, 'D' => :C }
      frames.each do |frame|
        frame[:options].each do |option|
          expect(option.style).to eq(style_mapping[option.key])
        end
      end
    end

    it 'options have non-empty text from translations' do
      frames = described_class.frames
      frames.each do |frame|
        frame[:options].each do |option|
          expect(option.text).to be_a(String)
          expect(option.text).not_to be_empty
        end
      end
    end

    it 'respects locale parameter' do
      # Test with default locale
      frames_en = described_class.frames(:en)
      expect(frames_en).to be_present

      # The locale is used in I18n.t calls
      # Since we only have :en configured, other locales would fall back
      # but the method should still work
      frames_default = described_class.frames
      expect(frames_default.length).to eq(16)
    end

    it 'uses I18n translations correctly' do
      frames = described_class.frames(:en)
      first_frame = frames.first
      first_option = first_frame[:options].first

      # Verify the text comes from I18n
      expect(first_option.text).to be_present
      # The text should match what's in the locale file
      expect(first_option.text).to include('range') # Based on frame_1 option_a
    end

    it 'returns frames in order from 1 to 16' do
      frames = described_class.frames
      indices = frames.map { |f| f[:index] }
      expect(indices).to eq((1..16).to_a)
    end
  end

  describe '.style_for_option' do
    it 'maps option key A to style D' do
      expect(described_class.style_for_option('A')).to eq(:D)
    end

    it 'maps option key B to style I' do
      expect(described_class.style_for_option('B')).to eq(:I)
    end

    it 'maps option key C to style S' do
      expect(described_class.style_for_option('C')).to eq(:S)
    end

    it 'maps option key D to style C' do
      expect(described_class.style_for_option('D')).to eq(:C)
    end

    it 'handles uppercase keys' do
      expect(described_class.style_for_option('A')).to eq(:D)
      expect(described_class.style_for_option('B')).to eq(:I)
      expect(described_class.style_for_option('C')).to eq(:S)
      expect(described_class.style_for_option('D')).to eq(:C)
    end

    it 'handles lowercase keys by converting to uppercase' do
      expect(described_class.style_for_option('a')).to eq(:D)
      expect(described_class.style_for_option('b')).to eq(:I)
      expect(described_class.style_for_option('c')).to eq(:S)
      expect(described_class.style_for_option('d')).to eq(:C)
    end

    it 'handles mixed case keys' do
      expect(described_class.style_for_option('a')).to eq(:D)
      expect(described_class.style_for_option('A')).to eq(:D)
    end

    it 'returns nil for invalid keys' do
      expect(described_class.style_for_option('X')).to be_nil
      expect(described_class.style_for_option('Z')).to be_nil
      expect(described_class.style_for_option('1')).to be_nil
      expect(described_class.style_for_option('')).to be_nil
    end
  end
end
