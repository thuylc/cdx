class Episode < ActiveRecord::Base
  include AutoUUID
  include Auditable

  belongs_to :patient

  validates_presence_of :diagnosis, :hiv_status, :drug_resistance, :initial_history
  validates :previous_history, presence: true, if: Proc.new { |a| a.initial_history == 'previous' }

  def self.anatomical_diagnosis_options
    diagnosis_options.select { |opt| opt.anatomical == true }
  end

  def self.initial_history_options
    history_options.select { |opt| opt.initial == true }
  end

  def self.diagnosis_options
    [
      OpenStruct.new(id: :presumptive_tb,
                     name: I18n.t('diagnosis.presumptive_tb'),
                     anatomical: false),
      OpenStruct.new(id: :bacteriologically_confirmed,
                     name: I18n.t('diagnosis.bacteriologically_confirmed'),
                     anatomical: false),
      OpenStruct.new(id: :clinically_diagnosed,
                     name: I18n.t('diagnosis.clinically_diagnosed'),
                     anatomical: false),
      OpenStruct.new(id: :pulmonary_tuberculosis,
                     name: I18n.t('diagnosis.pulmonary_tb'),
                     anatomical: true),
      OpenStruct.new(id: :extra_pulmonary_tuberculosis,
                     name: I18n.t('diagnosis.extra_pulmonary_tb'),
                     anatomical: true)
    ]
  end

  def self.drug_resistance_options
    [
      OpenStruct.new(id: :mono, name: I18n.t('select.episode.drug_resistance.mono')),
      OpenStruct.new(id: :poly, name: I18n.t('select.episode.drug_resistance.poly')),
      OpenStruct.new(id: :multi, name: I18n.t('select.episode.drug_resistance.multi')),
      OpenStruct.new(id: :extensive, name: I18n.t('select.episode.drug_resistance.extensive')),
      OpenStruct.new(id: :rif, name: I18n.t('select.episode.drug_resistance.rif')),
      OpenStruct.new(id: :unknown, name: I18n.t('select.episode.drug_resistance.unknown'))
    ]
  end

  def self.history_options
    [
      OpenStruct.new(id: :new, name: I18n.t('select.episode.history.new'), initial: true),
      OpenStruct.new(id: :previous, name: I18n.t('select.episode.history.previous'), initial: true),
      OpenStruct.new(id: :unknown, name: I18n.t('select.episode.history.unknown'), initial: true),
      OpenStruct.new(id: :relapsed, name: I18n.t('select.episode.history.relapsed')),
      OpenStruct.new(id: :loss, name: I18n.t('select.episode.history.loss')),
      OpenStruct.new(id: :other, name: I18n.t('select.episode.history.other'))
    ]
  end

  def self.hiv_status_options
    [
      OpenStruct.new(id: :positive_tb, name: I18n.t('select.episode.hiv_status.positive_tb')),
      OpenStruct.new(id: :negative_tb, name: I18n.t('select.episode.hiv_status.negative_tb')),
      OpenStruct.new(id: :unknown, name: I18n.t('select.episode.hiv_status.unknown'))
    ]
  end

  def self.previous_history_options
    history_options.select { |opt| opt.initial == nil }
  end

  def self.treatment_outcome_options
    [
      OpenStruct.new(id: :cured, name: I18n.t('select.episode.treatment_outcome.cured')),
      OpenStruct.new(id: :completed, name: I18n.t('select.episode.treatment_outcome.completed')),
      OpenStruct.new(id: :failed, name: I18n.t('select.episode.treatment_outcome.failed')),
      OpenStruct.new(id: :died, name: I18n.t('select.episode.treatment_outcome.died')),
      OpenStruct.new(id: :lost_to_follow_up, name: I18n.t('select.episode.treatment_outcome.lost_to_follow_up')),
      OpenStruct.new(id: :not_evaluated, name: I18n.t('select.episode.treatment_outcome.not_evaluated')),
      OpenStruct.new(id: :success, name: I18n.t('select.episode.treatment_outcome.success'))
    ]
  end
end
