class AlertsController < ApplicationController
  respond_to :html, :json

  before_filter do
    head :forbidden unless has_access_to_test_results_index?
  end

  def index
    @alerts = current_user.alerts
    @total = @alerts.count
    respond_with @total
  end

end
