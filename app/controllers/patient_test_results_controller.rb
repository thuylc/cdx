class PatientTestResultsController < ApplicationController
  respond_to :json

  before_filter :find_patient

  def index
    render json: Presenters::PatientTestResults.patient_view(@patient.test_results.order(created_at: :desc).limit(30).offset(params[:page] || 0))
  end

  protected

  def find_patient
    @patient = @navigation_context.institution.patients.find(params[:patient_id])
  end
end
