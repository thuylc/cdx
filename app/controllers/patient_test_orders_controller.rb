class PatientTestOrdersController < ApplicationController
  respond_to :json

  before_filter :find_patient

  def index
    render json: Presenters::PatientTestOrders.patient_view(@patient.encounters.order(set_order_from_params).limit(30).offset(params[:page] || 0))
  end

  protected

  def find_patient
    @patient = @navigation_context.institution.patients.find(params[:patient_id])
  end

  def set_order_from_params
    order = params[:order] == 'true' ? 'asc' : 'desc'
    field_name = case params[:field].to_s == 'name'
    when 'site'
      'sites.name'
    when 'orderId'
      'encounters.uuid'
    when 'requester'
      'users.first_name, users.last_name'
    when 'dueDate'
      'encounters.testdue_date'
    else 'encounters.start_time'
    end

    "#{field_name} #{order}"
  end
end
