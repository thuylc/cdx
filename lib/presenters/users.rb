class Presenters::Users
  class << self
    def index_table(users, navigation_context)
      users.map do |user|
        {
          id:           user.id,
          name:         user.full_name,
          roles:        show_user_roles(user, navigation_context),
          isActive:     show_user_active(user),
          lastActivity: show_last_activity(user),
          viewLink:     Rails.application.routes.url_helpers.edit_user_path(user)
        }
      end
    end

    protected

    def show_user_roles(user, navigation_context)
      (user.roles & context_roles(navigation_context)).map(&:name).join(", ")
    end

    def show_user_active(user)
      user.is_active? ? '' : I18n.t('users.presenters.blocked')
    end

    def show_last_activity(user)
      return I18n.t('users.presenters.sent_at', sent_at: Extras::Dates::Format.datetime_with_time_zone(user.invitation_created_at)) if user.invited_pending?

      return I18n.t('users.presenters.never_logged_in') unless user.last_sign_in_at
      Extras::Dates::Format.datetime_with_time_zone(user.last_sign_in_at)
    end

    def context_roles(navigation_context)
      Role.within(navigation_context.entity, navigation_context.exclude_subsites)
    end
  end
end
