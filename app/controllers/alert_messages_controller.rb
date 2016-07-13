class AlertMessagesController < ApplicationController
  respond_to :html, :json

  before_filter do
    head :forbidden unless has_access_to_test_results_index?
  end

  def index
    @alert_messages  = current_user.recipient_notification_history
    @total           = @alert_messages.count
    order_by, offset = perform_pagination('alerts.name')
    @alert_messages  = @alert_messages.joins(:alert, :user).order(order_by).limit(@page_size).offset(offset)
  end
end
