class DashboardsController < ApplicationController
  def index; 
  	@institution_name = @navigation_context.name if @navigation_context.try(:entity)
  end

  def nndd
    return unless authorize_resource(TestResult, MEDICAL_DASHBOARD)
  end
end
