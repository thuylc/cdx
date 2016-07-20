class IncidentsController < ApplicationController
  respond_to :html, :json

  before_filter do
    head :forbidden unless has_access_to_test_results_index?
  end

  def index
    @date_options = Extras::Dates::Filters.date_options_for_filter

    if has_access?(@navigation_context.institution, READ_ALERT)
      @devices = check_access(Device.within(@navigation_context.entity), READ_DEVICE)
      @alerts = Alert.where({user_id: current_user.id})
      @incidents =  current_user.alert_histories.where({for_aggregation_calculation: false}).joins(:alert)

      if ( !params["alert.id"].blank? )
        @incidents = @incidents.where("alerts.id=?",params["alert.id"].to_i)
      end

      if ( !params["device.uuid"].blank? )
        @incidents = @incidents.where("alerts.device.uuid=?",params["device.uuid"])
      end

      if ( !params["since"].blank? )
        @incidents = @incidents.where("alert_histories.created_at > ?", params["since"] )
      end

      if ( !params["sample.id"].blank? )
        @incidents = @incidents.where("alerts.sample_id = ?", params["sample.id"] )
      end

      @total           = @incidents.count
      order_by, offset = perform_pagination('alerts.name')
      @incidents       = @incidents.joins(:alert, :user).order(order_by).limit(@page_size).offset(offset)
    else
      @incidents = []
      @alerts = []
    end
  end
end


