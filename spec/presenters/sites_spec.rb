require 'spec_helper'

describe Presenters::Sites do
  let(:institution)  { Institution.make }

  describe 'patient_view' do
    before :each do
      7.times { Site.make institution: institution  }
    end

    it 'should return an array of formated devices' do
      expect(described_class.index_table(institution.sites).size).to eq(7)
    end

    it 'should return elements formated' do
      expect(described_class.index_table(institution.sites).first).to eq({
        id:       institution.sites.first.id,
        name:     institution.sites.first.name,
        city:     institution.sites.first.city,
        comment:  institution.sites.first.comment,
        viewLink: Rails.application.routes.url_helpers.edit_site_path(institution.sites.first.id)
      })
    end
  end
end
