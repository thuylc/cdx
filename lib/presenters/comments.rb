class Presenters::Comments
  class << self
    def patient_view(comments)
      comments.map do |comment|
        {
          id:          comment.uuid,
          commentDate: I18n.l(comment.created_at, format: :short),
          commenter:   comment.user.full_name,
          title:       comment.description,
          viewLink:    Rails.application.routes.url_helpers.patient_comment_path(comment.patient, comment)
        }
      end
    end
  end
end
