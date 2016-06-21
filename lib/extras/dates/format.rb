class Extras::Dates::Format
  class << self
    def string_to_pattern(string, input_format_pattern=I18n.t('date.input_format.pattern'))
      begin
        Date.strptime(string, input_format_pattern)
      rescue
        Date.today
      end
    end
  end
end
