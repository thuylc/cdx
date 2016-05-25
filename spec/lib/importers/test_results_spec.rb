require 'spec_helper'

RSpec.describe Importers::TestResults do
  let(:current_user) { User.make }
  let(:site_user) { "#{current_user.first_name} #{current_user.last_name}" }
  let(:institution) { Institution.make(user_id: current_user.id) }
  let(:site) { Site.make(institution: institution) }
  let!(:user_device) { Device.make institution_id: institution.id, site: site }
  let(:header) do
    header = []
    header << 'FOO'
    return header.join(',')
  end

  let(:row) do
    row = []
    row << 123_456
    row.join(',')
  end

  let(:options) do
    { universal_newline: false, headers: true, encoding: 'windows-1251:utf-8' }
  end

  let(:data) { "#{header}\r#{row}\r#{row}\r" }

  describe 'Importing data from CSV file' do
    it 'reads CSV file and adds records to DB' do
      allow(File).to receive(:open)
        .with('filename', options)
        .and_return(StringIO.new(data))
      expected = expect do
        described_class.import('filename')
      end
      expected.to change(::TestResult, :count).by(1)
    end
  end
end
