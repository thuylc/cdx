class RequestedTest < ActiveRecord::Base
  belongs_to :encounter

  acts_as_paranoid

  has_one :xpert_result
  has_one :microscopy_result
  has_one :dst_lpa_result
  has_one :culture_result

  validates_presence_of :name
  enum status: [:pending, :inprogress, :completed, :rejected, :deleted]
end
