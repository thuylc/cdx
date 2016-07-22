class CreatePageHeaders < ActiveRecord::Migration
  def change
    create_table :page_headers do |t|
      t.references :institution, index: true
      t.references :site, index: true
      t.timestamps null: false
    end
  end
end
