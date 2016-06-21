class PatientsController < ApplicationController
  def search
    @patients = check_access(Patient.where(is_phantom: false).where(institution: @navigation_context.institution), READ_PATIENT).order(:name)
    @patients = @patients.where("name LIKE concat('%', ?, '%') OR entity_id LIKE concat('%', ?, '%')", params[:q], params[:q])
    @patients = @patients.page(1).per(10)

    builder = Jbuilder.new do |json|
      json.array! @patients do |patient|
        patient.as_json_card(json)
      end
    end

    render json: builder.attributes!
  end

  def index
    @can_create = has_access?(@navigation_context.institution, CREATE_INSTITUTION_PATIENT)
    @patients = check_access(Patient.where(is_phantom: false).where(institution: @navigation_context.institution), READ_PATIENT).order(:name)

    @patients = @patients.within(@navigation_context.entity, @navigation_context.exclude_subsites)

    @patients = @patients.where("name LIKE concat('%', ?, '%')", params[:name]) unless params[:name].blank?
    @patients = @patients.where("entity_id LIKE concat('%', ?, '%')", params[:entity_id]) unless params[:entity_id].blank?
    # location_geoid is hierarchical so a prefix search works
    @patients = @patients.where("location_geoid LIKE concat(?, '%')", params[:location]) unless params[:location].blank?
    @patients = @patients.where(id: Encounter.select(:patient_id).where("encounters.start_time > ?", params["last_encounter"])) if params["last_encounter"].present?

    @date_options = date_options_for_filter
    @patients = perform_pagination(@patients)
    @patients.preload_locations!
    @patients = @patients.preload_last_encounter!
  end

  def show
    @patient = Patient.find(params[:id])
    @patient_json = Jbuilder.new { |json| @patient.as_json_card(json) }.attributes!
    return unless authorize_resource(@patient, READ_PATIENT)
    @encounters = @patient.encounters.order(start_time: :desc)
  end

  def new
    @patient = PatientForm.new
    prepare_for_institution_and_authorize(@patient, CREATE_INSTITUTION_PATIENT)
  end

  def create
    @institution = @navigation_context.institution
    return unless authorize_resource(@institution, CREATE_INSTITUTION_PATIENT)

    @patient = PatientForm.new(patient_params)
    @patient.institution = @institution
    @patient.site = @navigation_context.site

    if @patient.save_and_audit(current_user, 'New patient added')
      next_url = if params[:next_url].blank?
        patient_path(@patient)
      else
        "#{params[:next_url]}#{params[:next_url].include?('?') ? '&' : '?'}patient_id=#{@patient.id}"
      end

      redirect_to next_url, notice: 'Patient was successfully created.'
    else
      render action: 'new'
    end
  end

  def edit
    patient = Patient.find(params[:id])
    @patient = PatientForm.edit(patient)
    return unless authorize_resource(patient, UPDATE_PATIENT)

    @can_delete = has_access?(patient, DELETE_PATIENT)
  end

  def update
    patient = Patient.find(params[:id])
    @patient = PatientForm.edit(patient)
    return unless authorize_resource(patient, UPDATE_PATIENT)

    if @patient.update_and_audit(patient_params, current_user, 'Patient details have been updated')
      redirect_to patient_path(@patient), notice: 'Patient was successfully updated.'
    else
      render action: 'edit'
    end
  end

  def destroy
    @patient = Patient.find(params[:id])
    return unless authorize_resource(@patient, DELETE_PATIENT)

    @patient.destroy

    redirect_to patients_path, notice: 'Patient was successfully deleted.'
  end

  private

  def patient_params
    params.require(:patient).permit(:name, :entity_id, :gender, :dob, :lat, :lng, :location_geoid, :address, :email, :phone, :city, :state, :zip_code)
  end
end
