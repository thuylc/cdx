class AddCommentToRequestedTests < ActiveRecord::Migration
  def change
    add_column :requested_tests, :comment, :text
  end
end
