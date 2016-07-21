class AlertsController < ApplicationController
  respond_to :html, :json

  before_filter do
    head :forbidden unless has_access?(Alert, READ_ALERT)
  end

  def index
    @can_create = has_access?(@navigation_context.institution, CREATE_ALERT)
    @alerts = current_user.alerts
    @alerts = @alerts.within(@navigation_context.entity, @navigation_context.exclude_subsites)
    @total = @alerts.count
    respond_with @total
  end

end
