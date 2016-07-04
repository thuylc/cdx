class MicroscopyResultsController < PatientResultsController

  def new
    @microscopy_result                     = @requested_test.build_microscopy_result
    @microscopy_result.sample_collected_on = Date.today
    @microscopy_result.result_on           = Date.today
    @microscopy_result.serial_number       = @requested_test.encounter.samples.map(&:entity_ids).join(', ')
  end

  def create
    @microscopy_result = @requested_test.build_microscopy_result(microscopy_result_params)

    if @requested_test.microscopy_result.save_and_audit(current_user, I18n.t('microscopy_results.create.audit'))
      redirect_to encounter_path(@requested_test.encounter), notice: I18n.t('microscopy_results.create.notice')
    else
      render action: 'new'
    end
  end

  def show
    @microscopy_result = @requested_test.microscopy_result
  end

  protected

  def microscopy_result_params
    params.require(:microscopy_result).permit(:sample_collected_on, :examined_by, :result_on, :specimen_type, :serial_number, :appearance, :results_negative, :results_1to9, :results_1plus, :results_2plus, :results_3plus)
  end
end
