class PatientResultsController < ApplicationController

  before_filter :find_requested_test, :check_permissions

  protected

  def find_requested_test
    @requested_test = RequestedTest.find(params[:requested_test_id])
  end

  def check_permissions
    redirect_to(encounter_path(@requested_test.encounter), error: "You can't add test results to this test order") unless has_access?(TestResult, Policy::Actions::QUERY_TEST)
  end
end
