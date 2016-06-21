class AuditLog < ActiveRecord::Migration
  def change
    create_table :audit_logs do |t|
      t.text       :comment
      t.string     :title
      t.string     :uuid,    index: true
      t.references :patient, index: true
      t.references :user,    index: true

      t.timestamps
    end

    create_table :audit_updates do |t|
      t.string     :field_name
      t.string     :old_value
      t.string     :new_value
      t.string     :uuid,      index: true
      t.references :audit_log, index: true

      t.timestamps
    end
  end
end
