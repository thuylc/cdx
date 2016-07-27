class CreateSettingsPages < ActiveRecord::Migration
  def change
    create_table :settings_pages do |t|
      t.references :institution, index: true
      t.references :site, index: true
      t.string :site_prefix
      t.timestamps null: false
    end
  end
end
