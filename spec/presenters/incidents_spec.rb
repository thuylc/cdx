require 'spec_helper'

include ActionView::Helpers::TextHelper

describe Presenters::Incidents do
  let(:user)         { User.make }
  let(:institution)  { user.institutions.make }
  let(:site)         { Site.make institution: institution }
  let(:device_model) { DeviceModel.make institution: institution }
  let(:device)       { Device.make  institution: institution, site: site, device_model: device_model }
  let(:alert)        {
    alert = Alert.make institution: institution, user: user
    alert.devices << device
    alert
  }

  describe 'patient_view' do
    before :each do
      7.times { AlertHistory.make  user: user, alert: alert  }
    end

    it 'should return an array of formated devices' do
      expect(described_class.index_table(user.alert_histories).size).to eq(7)
    end

    it 'should return elements formated' do
      expect(described_class.index_table(user.alert_histories).first).to eq({
        id:         user.alert_histories.first.id,
        alertName:  truncate(user.alert_histories.first.alert.name, length: 20),
        devices:    device.name,
        date:       Extras::Dates::Format.datetime_with_time_zone(user.alert_histories.first.created_at),
        testResult: { resultLink: Rails.application.routes.url_helpers.test_result_path(user.alert_histories.first.test_result.uuid) },
        viewLink:   Rails.application.routes.url_helpers.edit_alert_path(user.alert_histories.first.alert)
      })
    end
  end
end
