class AddPerformingSiteToEncounters < ActiveRecord::Migration
  def change
    add_reference :encounters, :performing_site, references: :sites, index: true
#    add_foreign_key :encounters, :sites, column: :performing_site_id
  end
end
