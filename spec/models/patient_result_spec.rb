require 'spec_helper'

describe PatientResult do
  context "validations" do
    it { should belong_to(:requested_test) }
  end
end
