class AuditLog < ActiveRecord::Base
  include AutoUUID

  belongs_to :patient
  belongs_to :user

  has_many   :audit_updates, dependent: :destroy

  validates_presence_of :title, :patient_id, :user_id
end
