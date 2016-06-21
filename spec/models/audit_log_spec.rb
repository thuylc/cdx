require 'spec_helper'

describe AuditLog do
  context "validations" do
    it { should belong_to(:patient) }

    it { should belong_to(:user) }

    it { should have_many(:audit_updates) }

    it { should validate_presence_of(:title) }

    it { should validate_presence_of(:patient_id) }

    it { should validate_presence_of(:user_id) }
  end
end
