class AuditUpdate < ActiveRecord::Base
  include AutoUUID

  belongs_to :audit_log

  validates_presence_of :field_name, :old_value, :new_value
end
