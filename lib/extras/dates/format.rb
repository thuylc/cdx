class Extras::Dates::Format
  class << self
    def string_to_pattern(string, input_format_pattern=I18n.t('date.input_format.pattern'))
      begin
        Date.strptime(string, input_format_pattern)
      rescue
        Date.today
      end
    end

    def datetime_with_time_zone(timeValue, formatValue=:long, tz=nil)
      return nil unless timeValue.present?

      timeValue = if timeValue.is_a?(String)
        Time.parse(timeValue)
      elsif timeValue.is_a?(Time)
        tz ? timeValue.in_time_zone(tz) : timeValue
      else
        timeValue
      end

      I18n.l(timeValue, format: formatValue)
    end
  end
end
