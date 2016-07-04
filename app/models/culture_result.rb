class CultureResult < PatientResult
  validates_presence_of  :sample_collected_on, :examined_by, :result_on, :media_used, :serial_number
  validates_inclusion_of :results_negative, :results_1to9, :results_1plus, :results_2plus, :results_3plus, :results_ntm, :results_contaminated, in: [true, false]
  validates_inclusion_of :media_used, in: ['solid', 'liquid']

  class << self
    def media_options
      [['solid', I18n.t('select.culture.media_options.solid')], ['liquid', I18n.t('select.culture.media_options.liquid')]]
    end
  end
end
