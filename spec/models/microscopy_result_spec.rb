require 'spec_helper'

describe MicroscopyResult do
  context "validations" do
    it { should belong_to(:requested_test) }
    it { should validate_presence_of(:sample_collected_on) }
    it { should validate_presence_of(:specimen_type) }
    it { should validate_presence_of(:serial_number) }
    it { should validate_presence_of(:appearance) }
    it { should validate_presence_of(:examined_by) }
    it { should validate_presence_of(:result_on) }
    it { should validate_inclusion_of(:results_negative).in_array([true, false]) }
    it { should validate_inclusion_of(:results_1to9).in_array([true, false]) }
    it { should validate_inclusion_of(:results_1plus).in_array([true, false]) }
    it { should validate_inclusion_of(:results_2plus).in_array([true, false]) }
    it { should validate_inclusion_of(:results_3plus).in_array([true, false]) }
  end
end
