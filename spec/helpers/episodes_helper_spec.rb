require 'spec_helper'

RSpec.describe EpisodesHelper, type: :helper do
  describe 'outcome_options' do
    it 'returns a JSON object of episode outcomes' do
      expect(helper.outcome_options).to be_a(Array)
    end

    it 'includes a Please Select option' do
      expect(helper.outcome_options.first).to be_a(Hash)
      expect(helper.outcome_options.first[:id]).to eq('')
      expect(helper.outcome_options.first[:name]).to eq('Please Select')
    end
  end
end
