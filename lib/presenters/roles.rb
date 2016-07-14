class Presenters::Roles
  class << self
    def index_table(roles, current_user, navigation_context)
      roles.map do |role|
        {
          id:       role.id,
          name:     role.name,
          site:     show_site_name(role),
          count:    show_user_count(role, current_user, navigation_context),
          viewLink: Rails.application.routes.url_helpers.edit_role_path(Role.first)
        }
      end
    end

    protected

    def show_site_name(role)
      role.site ? role.site.name : role.institution.name
    end

    def show_user_count(role, current_user, navigation_context)
      Policy.authorize(Policy::Actions::READ_ROLE, Role, current_user).within(navigation_context.entity, navigation_context.exclude_subsites).joins("LEFT JOIN roles_users ON roles.id = roles_users.role_id").where('roles_users.role_id = ?', role.id).count(:user_id)
    end
  end
end
