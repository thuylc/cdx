class CultureResultsController < PatientResultsController

  def new
    @culture_result                     = @requested_test.build_culture_result
    @culture_result.sample_collected_on = Date.today
    @culture_result.result_on           = Date.today
    @culture_result.serial_number       = @requested_test.encounter.samples.map(&:entity_ids).join(', ')
  end

  def create
    @culture_result = @requested_test.build_culture_result(culture_result_params)

    if @requested_test.culture_result.save_and_audit(current_user, I18n.t('culture_results.create.audit'))
      redirect_to encounter_path(@requested_test.encounter), notice: I18n.t('culture_results.create.notice')
    else
      render action: 'new'
    end
  end

  def show
    @culture_result = @requested_test.culture_result
  end

  protected

  def culture_result_params
    params.require(:culture_result).permit(:sample_collected_on, :examined_by, :result_on, :media_used, :serial_number, :results_negative, :results_1to9, :results_1plus, :results_2plus, :results_3plus, :results_ntm, :results_contaminated)
  end
end
