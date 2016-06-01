class AlertsController < ApplicationController
  respond_to :html, :json

  before_filter do
    head :forbidden unless has_access_to_test_results_index?
  end

end
