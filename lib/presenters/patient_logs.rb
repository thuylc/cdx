class Presenters::PatientLogs
  class << self
    def patient_view(patient_logs)
      patient_logs.map do |log|
        {
          id:       log.uuid,
          date:     I18n.l(log.created_at, format: :short),
          user:     log.user.full_name,
          title:    log.title,
          viewLink: Rails.application.routes.url_helpers.patient_patient_log_path(log.patient, log)
        }
      end
    end
  end
end
