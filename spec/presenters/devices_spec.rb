require 'spec_helper'

describe Presenters::Devices do
  let(:institution)  { Institution.make }
  let(:site)         { Site.make institution: institution }
  let(:device_model) { DeviceModel.make institution: institution }

  describe 'patient_view' do
    before :each do
      7.times { Device.make  institution: institution, site: site, device_model: device_model  }
    end

    it 'should return an array of formated devices' do
      expect(described_class.index_table(site.devices).size).to eq(7)
    end

    it 'should return elements formated' do
      expect(described_class.index_table(site.devices).first).to eq({
        id:              site.devices.first.uuid,
        name:            site.devices.first.name,
        institutionName: site.devices.first.device_model.institution.name,
        modelName:       site.devices.first.device_model.full_name,
        siteName:        site.name,
        viewLink:        Rails.application.routes.url_helpers.device_path(site.devices.first.id)
      })
    end
  end
end
