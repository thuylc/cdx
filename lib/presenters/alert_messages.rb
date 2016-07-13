class Presenters::AlertMessages
  class << self
    include ActionView::Helpers::TextHelper

    def index_table(alert_messages)
      alert_messages.map do |alert_message|
        {
          id:         alert_message.id,
          alertGroup: truncate(alert_message.alert.name, length: 20),
          date:       Extras::Dates::Format.datetime_with_time_zone(alert_message.created_at),
          channel:    Alert.channel_types.keys[Alert.channel_types["email"]],
          message:    truncate(alert_message.message_sent, length: 60),
          viewLink:   Rails.application.routes.url_helpers.edit_alert_path(alert_message.alert)
        }
      end
    end
  end
end
