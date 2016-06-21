class FtpSettingsController < ApplicationController
  respond_to :html

  expose(:institution)

  before_action :check_permissions

  def edit
  end

  def update
    if institution.update(institution_params)
      redirect_to settings_path, notice: 'FTP settings were successfully updated.'
    else
      render action: 'edit'
    end
  end

  protected

  def institution_params
    params.require(:institution).permit(:ftp_directory, :ftp_hostname, :ftp_username, :ftp_port, :ftp_password, :ftp_passive)
  end

  def check_permissions
    redirect_to(settings_path, error: "You don't have permission to change the FTP settings.") unless has_access?(institution, UPDATE_INSTITUTION)
  end
end
