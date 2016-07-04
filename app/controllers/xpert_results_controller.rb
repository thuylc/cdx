class XpertResultsController < PatientResultsController

  def new
    @xpert_result                     = @requested_test.build_xpert_result
    @xpert_result.sample_collected_on = Date.today
    @xpert_result.result_on           = Date.today
  end

  def create
    @xpert_result           = @requested_test.build_xpert_result(xpert_result_params)

    if @requested_test.xpert_result.save_and_audit(current_user, I18n.t('xpert_results.create.audit'))
      redirect_to encounter_path(@requested_test.encounter), notice: I18n.t('xpert_results.create.notice')
    else
      render action: 'new'
    end
  end

  def show
    @xpert_result = @requested_test.xpert_result
  end

  protected

  def xpert_result_params
    params.require(:xpert_result).permit(:sample_collected_on, :tuberculosis, :rifampicin, :examined_by, :result_on)
  end
end
