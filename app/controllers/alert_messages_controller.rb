class AlertMessagesController < ApplicationController
  respond_to :html, :json

  def index
    if has_access?(Alert, READ_ALERT)
      @alert_messages  = current_user.recipient_notification_history
      @total           = @alert_messages.count
      order_by, offset = perform_pagination('alerts.name')
      @alert_messages  = @alert_messages.joins(:alert, :user).order(order_by).limit(@page_size).offset(offset)
    else
      @alert_messages = []
    end
  end
end
