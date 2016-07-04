class DstLpaResultsController < PatientResultsController

  def new
    @dst_lpa_result                     = @requested_test.build_dst_lpa_result
    @dst_lpa_result.sample_collected_on = Date.today
    @dst_lpa_result.result_on           = Date.today
    @dst_lpa_result.serial_number       = @requested_test.encounter.samples.map(&:entity_ids).join(', ')
  end

  def create
    @dst_lpa_result = @requested_test.build_dst_lpa_result(dst_lpa_result_params)

    if @requested_test.dst_lpa_result.save_and_audit(current_user, I18n.t('dst_lpa_results.create.audit'))
      redirect_to encounter_path(@requested_test.encounter), notice: I18n.t('dst_lpa_results.create.notice')
    else
      render action: 'new'
    end
  end

  def show
    @dst_lpa_result = @requested_test.dst_lpa_result
  end

  protected

  def dst_lpa_result_params
    params.require(:dst_lpa_result).permit(:sample_collected_on, :examined_by, :result_on, :media_used, :serial_number, :results_h, :results_r, :results_e, :results_s, :results_amk, :results_km, :results_cm, :results_fq, :results_other1, :results_other2, :results_other3, :results_other4)
  end
end
