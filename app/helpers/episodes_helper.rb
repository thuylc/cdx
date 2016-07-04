module EpisodesHelper
  def outcome_options
    opts = Episode.treatment_outcome_options.inject([]) do |arr, obj|
      arr << obj.marshal_dump
    end
    opts.unshift id: '', name: I18n.t('select.default')
  end

  def diagnosis_name(diagnosis)
    return unless diagnosis.present?
    Episode.diagnosis_options.select{ |option| option.id == diagnosis.to_sym }.first.name
  end

  def hiv_status_name(hiv_status)
    return unless hiv_status.present?
    Episode.hiv_status_options.select{ |option| option.id == hiv_status.to_sym }.first.name
  end

  def history_options_name(initial_history)
    return unless initial_history.present?
    Episode.initial_history_options.select{ |option| option.id == initial_history.to_sym }.first.name
  end

  def previous_history_options_name(previous_history)
    return unless previous_history.present?
    Episode.previous_history_options.select{ |option| option.id == previous_history.to_sym }.first.name
  end

  def drug_resistance_name(drug_resistance)
    return unless drug_resistance.present?
    Episode.drug_resistance_options.select{ |option| option.id == drug_resistance.to_sym }.first.name
  end

  def treatment_outcome_name(treatment_outcome)
    return unless treatment_outcome.present?
    Episode.treatment_outcome_options.select{ |option| option.id == treatment_outcome.to_sym }.first.name
  end
end