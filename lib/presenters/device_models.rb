class Presenters::DeviceModels
  class << self
    def index_table(device_models, current_user)
      device_models.map do |device_model|
        {
          id:       device_model.id,
          name:     device_model.name,
          version:  device_model.current_manifest.try(:version),
          viewLink: edit_device_model_link_to(device_model, current_user)
        }
      end
    end

    protected

    def edit_device_model_link_to(device_model, current_user)
      if updateable_device_model_ids(current_user).include?(device_model.id) && (!device_model.published? || publishable_device_model_ids(current_user).include?(device_model.id))
        Rails.application.routes.url_helpers.edit_device_model_path(device_model)
      else
        Rails.application.routes.url_helpers.device_model_path(device_model)
      end
    end

    def updateable_device_model_ids(current_user)
      Policy.authorize(Policy::Actions::UPDATE_DEVICE_MODEL, DeviceModel, current_user).pluck(:id)
    end

    def publishable_device_model_ids(current_user)
      Policy.authorize(Policy::Actions::PUBLISH_DEVICE_MODEL, DeviceModel, current_user).pluck(:id)
    end
  end
end
