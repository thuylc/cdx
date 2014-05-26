class Policy < ActiveRecord::Base
  belongs_to :user

  validates_presence_of :name

  serialize :definition, JSON

  def self.superadmin
    predefined_policy "superadmin"
  end

  def self.predefined_policy(name)
    JSON.load File.read("#{Rails.root}/app/policies/#{name}.json")
  end
end
