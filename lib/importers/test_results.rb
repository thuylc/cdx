module Importers
  class TestResults
    def self.import_all(filename, device_id)
      new(filename, device_id).import_all
    end

    attr_reader :device, :rows

    def initialize(filename, device_id)
      @rows = fetch_rows(filename)
      @device = Device.includes(:manifest, :institution, :site).find(device_id)
    end

    def import_all
      rows.each do |row|
        import(row)
      end
    end

    def import(row)
      message = build_message(row)
      device_message = DeviceMessage.new(device: device, plain_text_data: message)
      puts message
      device_message.save
      device_message.process
    end

    private

    def build_message(row)
      event_end_time = row['Date Run (end Time)']
      result = row['Mtb']
      event = {}
      event['result'] = lookup(result)
      event['assay_name'] = row['Assay Name']
      event['sample_ID'] = row['Sample Id']
      event['system_user'] = row['User']
      event['device_serial_number'] = device.serial_number
      event['start_time'] = format_date(row['Date Run (end Time)'])
      event['end_time'] = format_date(row['Date Run (end Time)'])
      event['test_type'] = 0
      event['error_code'] = error_code(row) if result == 'Error'
      message = {}
      message['event'] = event
      message.to_json
    end

    def error_code(row)
      row['Error Code'].present? ? row['Error Code'] : '9999'
    end

    def fetch_rows(filename)
      CSV.read(filename, headers: true, encoding: 'windows-1251:utf-8')
    end

    def format_date(date_time)
      DateTime.strptime(date_time, formatter(date_time)).iso8601
    end

    def formatter(date_time)
      return '%m/%d/%Y %I:%M:%S %p' if /(AM|PM)$/ =~ date_time
      '%d/%m/%y %H:%M'
    end

    def lookup(result)
      case result
      when 'Negative'
        'MTB NOT DETECTED'
      when 'Positive'
        'MTB DETECTED'
      when 'Invalid'
        'INVALID'
      when 'Error'
        'error'
      else
        'NO RESULT'
      end
    end
  end
end
