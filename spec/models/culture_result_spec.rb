require 'spec_helper'

describe CultureResult do
  let(:media_options)  { ['solid', 'liquid'] }

  context "validations" do
    it { should belong_to(:requested_test) }
    it { should validate_presence_of(:sample_collected_on) }
    it { should validate_presence_of(:examined_by) }
    it { should validate_presence_of(:result_on) }
    it { should validate_presence_of(:media_used) }
    it { should validate_presence_of(:serial_number) }
    it { should validate_inclusion_of(:media_used).in_array(media_options) }
  end
end
