require 'spec_helper'

describe DstLpaResult do
  let(:dst_lpa_options) { ['resistant', 'susceptible', 'contaminated', 'not_done'] }
  let(:method_options)  { ['solid', 'liquid', 'direct', 'indirect'] }
  context "validations" do
    it { should belong_to(:requested_test) }
    it { should validate_presence_of(:sample_collected_on) }
    it { should validate_presence_of(:examined_by) }
    it { should validate_presence_of(:result_on) }
    it { should validate_presence_of(:media_used) }
    it { should validate_presence_of(:serial_number) }
    it { should validate_presence_of(:results_h) }
    it { should validate_presence_of(:results_r) }
    it { should validate_presence_of(:results_e) }
    it { should validate_presence_of(:results_s) }
    it { should validate_presence_of(:results_amk) }
    it { should validate_presence_of(:results_km) }
    it { should validate_presence_of(:results_cm) }
    it { should validate_presence_of(:results_fq) }
    it { should validate_inclusion_of(:results_h).in_array(dst_lpa_options) }
    it { should validate_inclusion_of(:results_r).in_array(dst_lpa_options) }
    it { should validate_inclusion_of(:results_e).in_array(dst_lpa_options) }
    it { should validate_inclusion_of(:results_s).in_array(dst_lpa_options) }
    it { should validate_inclusion_of(:results_amk).in_array(dst_lpa_options) }
    it { should validate_inclusion_of(:results_km).in_array(dst_lpa_options) }
    it { should validate_inclusion_of(:results_cm).in_array(dst_lpa_options) }
    it { should validate_inclusion_of(:results_fq).in_array(dst_lpa_options) }
    it { should validate_inclusion_of(:media_used).in_array(method_options) }
  end
end
