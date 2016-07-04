require 'spec_helper'

describe Comment do
  let(:user)    { User.make }
  let(:patient) { Patient.make }

  context "validations" do
    it { should have_attached_file(:image) }

    it { should belong_to(:patient) }

    it { should belong_to(:user) }

    it { should validate_presence_of(:description) }

    it { should validate_presence_of(:patient_id) }

    it { should validate_presence_of(:user_id) }
  end
end
