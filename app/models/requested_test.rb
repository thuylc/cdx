class RequestedTest < ActiveRecord::Base
  belongs_to :encounter

  acts_as_paranoid
  
  validates_presence_of :name
  enum status: [:pending, :inprogress, :rejected, :deleted]
end
