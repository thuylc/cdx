require 'spec_helper'

RSpec.describe Episode, type: :model do
  describe 'associations' do
    it { should belong_to(:patient) }
  end

  describe 'validations' do
    it { should validate_presence_of(:diagnosis) }
    it { should validate_presence_of(:hiv_status) }
    it { should validate_presence_of(:drug_resistance) }

    describe 'history of previous treatment' do
      it { should validate_presence_of(:initial_history) }

      context 'when previously treated' do
        subject { Episode.make_unsaved(initial_history: :previous, previous_history: nil) }
        it 'requires presence of :previous_history' do
          expect(subject).to_not be_valid
        end
      end
    end
  end

  describe 'diagnosis options for drop-downs' do
    let(:diagnosis_options) { described_class.diagnosis_options }
    it 'has an array of diagnosis options' do
      expect(diagnosis_options).to be_a(Array)
    end

    it 'includes Clinically Diagnosed' do
      expected = diagnosis_options.select { |o| o.id == :clinically_diagnosed }
      expect(expected.first.name).to eq('Clinically Diagnosed')
    end
  end

  describe 'diagnosis options for anatomical sites' do
    let(:diagnosis_options) { described_class.anatomical_diagnosis_options }
    it 'has an array of diagnosis options' do
      expect(diagnosis_options).to be_a(Array)
    end

    it 'excludes Presumptive TB' do
      expected = diagnosis_options.select { |o| o.id == :presumptive_tb }
      expect(expected).to eq([])
    end
  end

  describe 'treament history options' do
    context 'initial treatment' do
      let(:initial_history_options) { described_class.initial_history_options } 
      it 'has an array of initial history options' do
        expect(initial_history_options).to be_a(Array)
      end

      it 'includes new, previous and unknown' do
        %w(new previous unknown).each do |opt|
          expected = initial_history_options.select { |o| o.id == opt.to_sym }
          expect(expected.map(&:id)).to include(opt.to_sym)
        end
      end

      it 'excudes relapsed, loss and other' do
        %w(relapsed loss other).each do |opt|
          expected = initial_history_options.map(&:id)
          expect(expected).to_not include(opt.to_sym)
        end
      end
    end

    context 'previous treatment' do
      let(:previous_history_options) { described_class.previous_history_options } 
      it 'has an array of initial history options' do
        expect(previous_history_options).to be_a(Array)
      end

      it 'excludes new, previous and unknown' do
        %w(new previous unknown).each do |opt|
          expected = previous_history_options.map(&:id)
          expect(expected).to_not include(opt.to_sym)
        end
      end

      it 'includes relapsed, loss and other' do
        %w(relapsed loss other).each do |opt|
          expected = previous_history_options.map(&:id)
          expect(expected).to include(opt.to_sym)
        end
      end
    end
  end

  describe 'HIV status options for drop-downs' do
    let(:hiv_status_options) { described_class.hiv_status_options }
    it 'has an array of hiv status options' do
      expect(hiv_status_options).to be_a(Array)
    end

    it 'includes positive, negative and unkown' do
      expect(hiv_status_options.size).to eq(3)
      %w(positive negative unknown).each do |status|
        id = "#{status}_tb".to_sym
        expected = hiv_status_options.select { |st| st.id == id }
        expect(expected.first.id).to eq(id)
      end
    end
  end

  describe 'drug resistance options for drop-downs' do
    let(:drug_resistance_options) { described_class.drug_resistance_options }
    it 'has an array of drug resistance options' do
      expect(drug_resistance_options).to be_a(Array)
    end

    it 'includes mono, poly, multi, extensive rif and unkown' do
      expect(drug_resistance_options.size).to eq(6)
      %w(mono poly multi extensive rif unknown).each do |status|
        id = status.to_sym
        expected = drug_resistance_options.select { |st| st.id == id }
        expect(expected.first.id).to eq(id)
      end
    end
  end

  describe 'treatment outcome options for drop-downs' do
    let(:treatment_outcome_options) { described_class.treatment_outcome_options }
    it 'has an array of treatment outcome options' do
      expect(treatment_outcome_options).to be_a(Array)
    end

    it 'includes cured, completed, failed, died, lost, not evaluated and success' do
      expect(treatment_outcome_options.size).to eq(7)
      %w(cured completed failed died lost_to_follow_up not_evaluated success).each do |status|
        id = status.to_sym
        expected = treatment_outcome_options.select { |st| st.id == id }
        expect(expected.first.id).to eq(id)
      end
    end
  end
end
