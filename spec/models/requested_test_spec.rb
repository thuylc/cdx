require 'spec_helper'

RSpec.describe RequestedTest, :type => :model do
  context "validates fields" do
    it "cannot create for missing fields" do
      requested_test = RequestedTest.create
      expect(requested_test).to_not be_valid
    end

    it "can create requested test" do
      requested_test =  RequestedTest.make
      expect(requested_test).to be_valid
    end

    it "cannot create for missing name field" do
      requested_test =  RequestedTest.make
      requested_test.name=nil
      expect(requested_test).to_not be_valid
    end
  end

  context "validate soft delete" do
    it "soft deletes a requested test" do
      requested_test =  RequestedTest.make
      requested_test.destroy
      deleted_requested_test_id = RequestedTest.where(id: requested_test.id).pluck(:id)
      expect(deleted_requested_test_id).to eq([])
    end

    it "soft deletes a requested test and verfiy requested test still exists" do
      requested_test =  RequestedTest.make
      requested_test.destroy
      deleted_requested_test_id = RequestedTest.with_deleted.where(id: requested_test.id).pluck(:id)
      expect(deleted_requested_test_id).to eq([requested_test.id])
    end
  end
  
end
