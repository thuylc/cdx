require 'spec_helper'
require 'policy_spec_helper'

describe FtpSettingsController do
  render_views
  let(:institution)    { Institution.make }
  let(:user)           { institution.user }
  let(:default_params) { { context: institution.uuid } }
  let(:valid_params)   { {
    ftp_directory: '/tmp',
    ftp_hostname:  'ftp.company.com',
    ftp_username:  'device',
    ftp_port:      2332,
    ftp_password:  '123456',
    ftp_passive:   1
  } }

  context 'user with permission to edit the settings' do
    before :each do
      sign_in user
    end

    describe 'edit' do
      it 'should render the edit view' do
        get :edit, id: institution.id

        expect(response).to render_template('edit')
      end
    end

    describe 'update' do
      before :each do
        put :update, id: institution.id, institution: valid_params
        institution.reload
      end

      it 'should redirect to settings page' do
        expect(response).to redirect_to(settings_path)
      end

      it 'should update the ftp_directory' do
        expect(institution.ftp_directory).to eq('/tmp')
      end

      it 'should update the ftp_hostname' do
        expect(institution.ftp_hostname).to eq('ftp.company.com')
      end

      it 'should update the ftp directory' do
        expect(institution.ftp_username).to eq('device')
      end

      it 'should update the ftp directory' do
        expect(institution.ftp_port).to eq(2332)
      end

      it 'should update the ftp directory' do
        expect(institution.ftp_password).to eq('123456')
      end

      it 'should update the ftp directory' do
        expect(institution.ftp_passive).to be true
      end
    end
  end

  context 'user with no edit patient permission' do
    let(:invalid_user) { Institution.make.user }

    before(:each) do
      grant user, invalid_user, institution, READ_INSTITUTION

      sign_in invalid_user
    end

    describe 'new' do
      it 'should deny access' do
        get :edit, id: institution.id

        expect(response).to redirect_to(settings_path)
      end
    end

    describe 'update' do
      it 'should deny access' do
        put :update, id: institution.id, institution: valid_params

        expect(response).to redirect_to(settings_path)
      end
    end
  end
end
