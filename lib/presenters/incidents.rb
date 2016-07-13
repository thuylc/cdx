class Presenters::Incidents
  class << self
    include ActionView::Helpers::TextHelper

    def index_table(incidents)
      incidents.map do |incident|
        {
          id:         incident.id,
          alertName:  truncate(incident.alert.name, length: 20),
          devices:    display_devices(incident.alert),
          date:       Extras::Dates::Format.datetime_with_time_zone(incident.created_at),
          testResult: show_test_result(incident),
          viewLink:   Rails.application.routes.url_helpers.edit_alert_path(incident.alert)
        }
      end
    end

    protected

    def show_test_result(incident)
      incident.test_result ? { resultLink: Rails.application.routes.url_helpers.test_result_path(incident.test_result.uuid) } : { resultLink: false, caption: I18n.t('incidents.index.no_result') }
    end

    def display_devices(alert)
      device_names = []
      alert.devices.each do |device|
        device_names << device.name if device
      end
      device_names.join(',')
    end
  end
end
