class PatientLogsController < ApplicationController
  respond_to :json

  before_filter :find_patient

  before_filter :find_patient_log, only: [:show]

  def index
    render json: Presenters::PatientLogs.patient_view(@patient.audit_logs.joins(:user).order(set_order_from_params).limit(30).offset(params[:page] || 0))
  end

  def show
  end

  protected

  def find_patient
    @patient = @navigation_context.institution.patients.find(params[:patient_id])
  end

  def find_patient_log
    @patient_log = @patient.audit_logs.find(params[:id])
  end

  def set_order_from_params
    order = params[:order] == 'true' ? 'asc' : 'desc'
    params[:field] == 'name' ? "users.first_name #{order}, users.last_name" : "audit_logs.created_at #{order}"
  end
end
