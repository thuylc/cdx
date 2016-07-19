class AddSiteToAlerts < ActiveRecord::Migration
  def change
    add_column :alerts, :site_prefix, :string
    add_reference :alerts, :site, index: true, foreign_key: true
  end
end
