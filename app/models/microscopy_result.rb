class MicroscopyResult < PatientResult
  validates_presence_of  :sample_collected_on, :examined_by, :result_on, :specimen_type, :serial_number, :appearance
  validates_inclusion_of :results_negative, :results_1to9, :results_1plus, :results_2plus, :results_3plus, in: [true, false]

  class << self
    def visual_appearance_results
      [['blood', 'Blood-stained'], ['mucopurulent', 'Mucopurulent'], ['saliva', 'Saliva']]
    end
  end
end
