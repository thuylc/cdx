class CreateResultsSti < ActiveRecord::Migration
  def up
    add_column   :test_results, :type, :string, index: true
    rename_table :test_results, :patient_results
    PatientResult.update_all(type: 'TestResult')
    rename_table :device_messages_test_results, :device_messages_patient_results
  end

  def down
    remove_column :patient_results, :type
    rename_table  :patient_results, :test_results
    rename_table :device_messages_patient_results, :device_messages_test_results
  end
end
