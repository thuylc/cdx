class XpertResult < PatientResult
  validates_presence_of  :sample_collected_on, :examined_by, :tuberculosis, :rifampicin, :result_on
  validates_inclusion_of :tuberculosis, in: ['detected', 'not_detected', 'invalid']
  validates_inclusion_of :rifampicin,   in: ['detected', 'not_detected', 'indeterminate']

  class << self
    def tuberculosis_results
      [['detected', 'Detected'], ['not_detected', 'Not Detected'], ['invalid', 'Invalid / No result / Error']]
    end

    def rifampicin_results
      [['detected', 'Detected'], ['not_detected', 'Not Detected'], ['indeterminate', 'Indeterminate result']]
    end
  end
end
