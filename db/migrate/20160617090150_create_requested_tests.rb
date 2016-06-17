class CreateRequestedTests < ActiveRecord::Migration
  def change
    create_table :requested_tests do |t|
      t.references :encounter, index: true, foreign_key: true
      t.string :name
      t.integer :status, default:0
      t.datetime :deleted_at, :datetime, index: true
      t.timestamps
    end
  end
end

