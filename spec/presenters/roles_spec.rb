require 'spec_helper'
require 'policy_spec_helper'

describe Presenters::Roles do
  let(:user)               { User.make }
  let(:institution)        { user.institutions.make }
  let(:site)               { Site.make institution: institution }
  let(:navigation_context) { NavigationContext.new(user, institution.uuid) }

  describe 'index_table' do
    before :each do
      policy = grant nil, nil, institution, [Policy::Actions::CREATE_INSTITUTION]
      7.times {
        role = Role.make institution: institution, policy: policy
        role.users << user
      }
    end

    it 'should return an array of formated devices' do
      expect(described_class.index_table(Role.all, user, navigation_context).size).to eq(37)
    end

    it 'should return elements formated' do
      expect(described_class.index_table(Role.all, user, navigation_context).first).to eq({
        id:       Role.first.id,
        name:     Role.first.name,
        site:     institution.name,
        count:    0,
        viewLink: Rails.application.routes.url_helpers.edit_role_path(Role.first)
      })
    end
  end
end
