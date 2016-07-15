require 'spec_helper'

include ActionView::Helpers::TextHelper
include ActionView::Helpers::DateHelper

describe Presenters::AlertGroups do
  let(:user)           { User.make }
  let(:institution)    { user.institutions.make }
  let(:site)           { Site.make institution: institution }
  let(:site2)          { Site.make institution: institution }

  describe 'patient_view' do
    before :each do
      7.times { Alert.make institution: institution, user: user }
      Alert.first.sites << site
      Alert.first.sites << site2
    end

    it 'should return an array of formated comments' do
      expect(described_class.index_table(user.alerts).size).to eq(7)
    end

    it 'should return elements formated' do
      expect(described_class.index_table(user.alerts).first).to eq({
        id:           user.alerts.first.id,
        name:         truncate(user.alerts.first.name, length: 20),
        description:  truncate(user.alerts.first.description, length: 20),
        enabled:      'Yes',
        sites:        "#{site}, #{site2}",
        roles:        [],
        lastIncident: described_class.display_latest_alert_date(user.alerts.first),
        viewLink:     Rails.application.routes.url_helpers.edit_alert_group_path(user.alerts.first)
      })
    end
  end

  context 'alert history' do
    let(:alert) { Alert.make }

    it 'should display an empty date' do
      expect(described_class.display_latest_alert_date(alert)).to eq('never')
    end

    it 'display_latest_alert_date' do
      Timecop.freeze(Time.utc(2013, 1, 15, 16, 32, 1))
      alert_history = alert.alert_histories.new.save
      Timecop.freeze(Time.utc(2016, 1, 16, 16, 32, 1))

      expect(described_class.display_latest_alert_date(alert)).to include('3 years')

      Timecop.return
    end
  end
end
