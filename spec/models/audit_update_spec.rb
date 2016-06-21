require 'spec_helper'

describe AuditUpdate do
  context "validations" do
    it { should belong_to(:audit_log) }

    it { should validate_presence_of(:field_name) }

    it { should validate_presence_of(:old_value) }

    it { should validate_presence_of(:new_value) }
  end
end
