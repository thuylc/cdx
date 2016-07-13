require 'spec_helper'

include ActionView::Helpers::TextHelper
include ActionView::Helpers::DateHelper

describe Presenters::AlertMessages do
  let(:user)           { User.make }
  let(:institution)    { user.institutions.make }
  let(:site)           { Site.make institution: institution }
  let(:site2)          { Site.make institution: institution }
  let(:alert)          { Alert.make institution: institution }

  describe 'patient_view' do
    before :each do
      7.times { RecipientNotificationHistory.make user: user, alert: alert }
    end

    it 'should return an array of formated comments' do
      expect(described_class.index_table(user.recipient_notification_history).size).to eq(7)
    end

    it 'should return elements formated' do
      expect(described_class.index_table(user.recipient_notification_history).first).to eq({
        id:         user.recipient_notification_history.first.id,
        alertGroup: truncate(user.recipient_notification_history.first.alert.name, length: 20),
        date:       Extras::Dates::Format.datetime_with_time_zone(user.recipient_notification_history.first.created_at),
        channel:    Alert.channel_types.keys[Alert.channel_types["email"]],
        message:    truncate(user.recipient_notification_history.first.message_sent, length: 60),
        viewLink:   Rails.application.routes.url_helpers.edit_alert_path(user.recipient_notification_history.first.alert)
      })
    end
  end
end
