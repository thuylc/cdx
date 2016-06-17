class RequestedTest < ActiveRecord::Base
  belongs_to :encounter

  acts_as_paranoid
  
  validates_presence_of :name
  enum status: [:open, :closed, :reopen]
end
