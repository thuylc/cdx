require 'spec_helper'
require 'policy_spec_helper'

describe RequestedTestsController  do
  let!(:institution) {Institution.make}
  let!(:user)        {institution.user}
  let!(:site)  { institution.sites.make }

  before(:each) {sign_in user}
  let(:default_params) { {context: institution.uuid} }

  context "update" do
    let!(:encounter) { Encounter.make institution: institution, site: site }
    let(:requested_test1)  {RequestedTest.make encounter: encounter}

    it "should update requestedTests status" do
      jsondata = 
          {
            "requested_tests" => {
              "id" => requested_test1.id,
              "status" => "deleted",
              "comment" => "comment xyz"
            }
          }
   
      post :update,  id: encounter.id, requested_tests: jsondata
      test = RequestedTest.find(requested_test1.id)   
      expect(RequestedTest.statuses[test.status]).to eq RequestedTest.statuses["deleted"]
      expect(Encounter.statuses[encounter.status]).to eq Encounter.statuses["pending"]
      expect(test.comment).to eq 'comment xyz'
    end
    
    it "should update encounter status to completed ehen test status is complete" do
      jsondata = 
          {
            "requested_tests" => {
              "id" => requested_test1.id,
              "status" => "completed"
            }
          }
          
      post :update,  id: encounter.id, requested_tests: jsondata
      test = RequestedTest.find(requested_test1.id)   
      updated_encounter = Encounter.find(encounter.id) 
      expect(RequestedTest.statuses[test.status]).to eq RequestedTest.statuses["completed"]
      expect(Encounter.statuses[updated_encounter.status]).to eq Encounter.statuses["completed"]
    end
    
    it "should update encounter status to completed when test status is rejected" do
      jsondata = 
          {
            "requested_tests" => {
              "id" => requested_test1.id,
              "status" => "rejected"
            }
          }
          
      post :update,  id: encounter.id, requested_tests: jsondata
      test = RequestedTest.find(requested_test1.id)   
      updated_encounter = Encounter.find(encounter.id) 
      expect(RequestedTest.statuses[test.status]).to eq RequestedTest.statuses["rejected"]
      expect(Encounter.statuses[updated_encounter.status]).to eq Encounter.statuses["completed"]
    end
    
    it "should update encounter status to inprogress when test status is inprogress" do
      jsondata = 
          {
            "requested_tests" => {
              "id" => requested_test1.id,
              "status" => "inprogress"
            }
          }
          
      post :update,  id: encounter.id, requested_tests: jsondata
      test = RequestedTest.find(requested_test1.id)   
      updated_encounter = Encounter.find(encounter.id) 
      expect(RequestedTest.statuses[test.status]).to eq RequestedTest.statuses["inprogress"]
      expect(Encounter.statuses[updated_encounter.status]).to eq Encounter.statuses["inprogress"]
    end
    
  end
end
