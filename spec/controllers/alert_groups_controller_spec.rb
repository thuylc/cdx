require 'spec_helper'
require 'policy_spec_helper'

RSpec.describe AlertGroupsController, type: :controller do
  let!(:institution) {Institution.make}
  let!(:user)        {institution.user}
  let!(:site) {institution.sites.make}
  let!(:alert_site) { Alert.make user: user, institution: institution, site: site}
  before(:each) {sign_in user}
  let(:default_params) { {context: institution.uuid} }

  let!(:other_user) { Institution.make.user }
  before(:each) {
    grant user, other_user, institution, READ_INSTITUTION
  }

  context "index" do
    it "should be accessible by institution owner" do
      get :index
      expect(response).to be_success
    end

    it "should list alerts if can read" do
     Alert.make user: user
      get :index
      expect(assigns(:alerts).count).to eq(1)
    end

    it "should not list alerts if can not read" do
      institution.alerts.make
      sign_in other_user
      get :index
      expect(assigns(:alerts).count).to eq(0)
    end

    it "can not create if not allowed" do
      sign_in other_user
      get :index
      expect(assigns(:can_create)).to be_falsy
    end
  end

end
