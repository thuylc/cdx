class CreatePage1Headers < ActiveRecord::Migration
  def change
    create_table :page1_headers do |t|
      t.references :institution, index: true
      t.references :site, index: true
      t.timestamps null: false
      t.string :site_prefix
    end
  end
end
