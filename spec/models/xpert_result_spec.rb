require 'spec_helper'

describe XpertResult do
  context "validations" do
    it { should belong_to(:requested_test) }
    it { should validate_presence_of(:sample_collected_on) }
    it { should validate_presence_of(:tuberculosis) }
    it { should validate_presence_of(:rifampicin) }
    it { should validate_presence_of(:examined_by) }
    it { should validate_presence_of(:result_on) }
  end
end
