class MicroscopyResultsController < PatientResultsController

  def new
    @microscopy_result                     = @requested_test.build_microscopy_result
    @microscopy_result.sample_collected_on = Date.today
    @microscopy_result.result_on           = Date.today
  end

  def create
    @microscopy_result = @requested_test.build_microscopy_result(microscopy_result_params)

    if @requested_test.microscopy_result.save
      redirect_to encounter_path(@requested_test.encounter), notice: 'Microscopy result was successfully created.'
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
