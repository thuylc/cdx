require 'spec_helper'
require 'policy_spec_helper'

describe Presenters::Users do
  let(:user)               { User.make }
  let(:institution)        { user.institutions.make }
  let(:site)               { Site.make institution: institution }
  let(:role)               { Role.make institution: institution, policy: policy }
  let(:policy)             { grant nil, nil, institution, [Policy::Actions::READ_INSTITUTION_USERS] }
  let(:navigation_context) { NavigationContext.new(user, institution.uuid) }

  describe 'index_table' do
    before :each do
      role.users << User.first
      7.times {
        User.make
        role.users << user
      }
    end

    it 'should return an array of formated devices' do
      expect(described_class.index_table(User.all, navigation_context).size).to eq(8)
    end

    it 'should return elements formated' do
      expect(described_class.index_table(User.all, navigation_context).first).to eq({
        id:           User.first.id,
        name:         User.first.full_name,
        roles:        role.name,
        isActive:     '',
        lastActivity: 'Never logged in',
        viewLink:     Rails.application.routes.url_helpers.edit_user_path(User.first)
      })
    end
  end

  describe '.last_activity' do
    describe 'last login time' do
      let(:last_login) { 4.hours.ago }
      let(:date_formatted) { last_login.to_formatted_s(:long) }
      let(:user) { User.make(last_sign_in_at: last_login) }
      it 'returns formatted date' do
        expect(described_class.index_table(User.all, navigation_context).first[:lastActivity]).to eq(date_formatted)
      end
    end
    context 'when the user has an outstanding invitation' do
      let(:date) { 1.month.ago }
      let(:date_formatted) { date.to_formatted_s(:long) }
      let(:user) { User.make(:invited_pending, invitation_created_at: date) }
      it 'returns Invitation sent with a formatted date string' do
        expect(described_class.index_table(User.all, navigation_context).first[:lastActivity]).to eq("Invitation sent #{date_formatted}")
      end
    end

    context 'when the user has never logged in' do
      let(:user) { User.make(last_sign_in_at: nil) }
      it 'returns Never logged in' do
        expect(described_class.index_table(User.all, navigation_context).first[:lastActivity]).to eq('Never logged in')
      end
    end
  end
end
