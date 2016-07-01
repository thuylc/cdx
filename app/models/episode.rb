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
                     anatomical: true),
      OpenStruct.new(id: :clinically_diagnosed,
                     name: I18n.t('diagnosis.clinically_diagnosed'),
                     anatomical: true)
    ]
  end

  def self.drug_resistance_options
    [
      OpenStruct.new(id: :mono, name: 'Monoresistance'),
      OpenStruct.new(id: :poly, name: 'Polydrug resistance'),
      OpenStruct.new(id: :multi, name: 'Multidrug resistance'),
      OpenStruct.new(id: :extensive, name: 'Extensive drug resistance'),
      OpenStruct.new(id: :rif, name: 'Rifampicin resistance'),
      OpenStruct.new(id: :unknown, name: 'Unknown')
    ]
  end

  def self.history_options
    [
      OpenStruct.new(id: :new, name: 'New Patients', initial: true),
      OpenStruct.new(id: :previous, name: 'Previously Treated', initial: true),
      OpenStruct.new(id: :unknown, name: 'Unknown Previously', initial: true),
      OpenStruct.new(id: :relapsed, name: 'Relapsed Treatment Aft..'),
      OpenStruct.new(id: :loss, name: 'Loss to follow-up'),
      OpenStruct.new(id: :other, name: 'Other previous treatments')
    ]
  end

  def self.hiv_status_options
    [
      OpenStruct.new(id: :positive_tb, name: 'HIV-positive TB patient'),
      OpenStruct.new(id: :negative_tb, name: 'HIV-negative TB patient'),
      OpenStruct.new(id: :unknown_tb, name: 'HIV Status Unkown TB patient')
    ]
  end

  def self.previous_history_options
    history_options.select { |opt| opt.initial == nil }
  end

  def self.treatment_outcome_options
    [
      OpenStruct.new(id: :cured, name: 'Cured'),
      OpenStruct.new(id: :completed, name: 'Treatment completed'),
      OpenStruct.new(id: :failed, name: 'Treatment failed'),
      OpenStruct.new(id: :died, name: 'Died'),
      OpenStruct.new(id: :lost_to_follow_up, name: 'Lost to follow-up'),
      OpenStruct.new(id: :not_evaluated, name: 'Not evaluated'),
      OpenStruct.new(id: :success, name: 'Treatment success')
    ]
  end
end
