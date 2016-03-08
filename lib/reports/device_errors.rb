module Reports
  class DeviceErrors < Base
    attr_reader :statuses

    def self.by_device(*args)
      new(*args).by_device
    end

    def self.total_devices
      Device.count
    end

    def by_device
      filter['group_by'] = 'device.model,day(test.start_time)'
      total_count = TestResult.query(filter, current_user).execute['total_count']
      no_device_models = total_count
      results = TestResult.query(filter, current_user).execute
      data = results['tests'].map do |test|
        no_device_models -= test['count']
        {
          label: test['device.model'],
          value: test['count']
        }
      end
      data << { label: 'Unknown', value: no_device_models } if no_device_models > 0
      data
    end


    def process
      filter['test.status'] = 'error'
      filter['group_by'] = 'month(test.start_time),device.model'
      super
    end

    def statuses
      results['tests'].index_by { |t| t['test.status'] }.keys
    end

    private

    def data_hash_day(dayname, day_results)
      {
        label: dayname,
        values: statuses.map do |u|
          status_result = date_results && date_results[u]
          status_result ? status_result['count'] : 0
        end
      }
    end

    def data_hash_month(date, date_results)
      {
        label: label_monthly(date),
        values: statuses.map do |u|
          status_result = date_results && date_results[u]
          status_result ? status_result['count'] : 0
        end
      }
    end

    def month_results(key)
      results_by_period[key].try { |r| r.index_by { |t| t['test.status'] } }
    end
  end
end
