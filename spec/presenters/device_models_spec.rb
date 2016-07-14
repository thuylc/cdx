require 'spec_helper'

describe Presenters::DeviceModels do
  let(:user)        { User.make }
  let(:institution) { user.institutions.make }
  let(:site)        { Site.make institution: institution }

  describe 'index_table' do
    before :each do
      7.times { DeviceModel.make institution: institution  }
    end

    it 'should return an array of formated device models' do
      expect(described_class.index_table(institution.device_models, user).size).to eq(7)
    end

    it 'should return elements formated' do
      expect(described_class.index_table(institution.device_models, user).first).to eq({
        id:       institution.device_models.first.id,
        name:     institution.device_models.first.name,
        version:  institution.device_models.first.current_manifest.try(:version),
        viewLink: Rails.application.routes.url_helpers.edit_device_model_path(institution.device_models.first)
      })
    end
  end
end
