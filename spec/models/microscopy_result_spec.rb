require 'spec_helper'

describe MicroscopyResult do
  let(:visual_appearance_options)  { ['blood', 'mucopurulent', 'saliva'] }

  context "validations" do
    it { should belong_to(:requested_test) }
    it { should validate_presence_of(:sample_collected_on) }
    it { should validate_presence_of(:specimen_type) }
    it { should validate_presence_of(:serial_number) }
    it { should validate_presence_of(:appearance) }
    it { should validate_presence_of(:examined_by) }
    it { should validate_presence_of(:result_on) }
    it { should validate_inclusion_of(:specimen_type).in_array(visual_appearance_options) }
  end
end
