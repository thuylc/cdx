module Audit
  class Auditor
    def initialize(auditable_model, user_id)
      @auditable_model = auditable_model
      @user_id         = user_id
    end

    def log_action(title, comment='')
      create_log(title, comment)
    end

    def log_changes(title, comment='')
      audit_log = create_log(title, comment)

      update_log(audit_log)
    end

    protected

    def create_log(title, comment)
      AuditLog.create do |log|
        log.title      = title
        log.patient_id = patient_id
        log.user_id    = @user_id
        log.comment    = comment
      end
    end

    def update_log(audit_log)
      @auditable_model.changes.each { |key, value| create_log_update(audit_log, key, value) }
    end

    def create_log_update(audit_log, field, values)
      audit_log.audit_updates.create do |log_update|
        log_update.field_name = field
        log_update.old_value  = values[0]
        log_update.new_value  = values[1]
      end
    end

    def patient_id
      @auditable_model.class.to_s == 'Patient' ? @auditable_model.id : @auditable_model.patient_id
    end
  end
end
