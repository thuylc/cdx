module Reports
  class Devices < Base
    attr_reader :device_models

    def self.by_device(*args)
      new(*args).by_device
    end

    def self.total_devices(time_created)
      DeviceModel.where("created_at >= ?", time_created).count
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
      filter['group_by'] = 'month(test.start_time),device.model'
      super
    end

    def device_models
      results['tests'].index_by { |t| t['device.model'] }.keys
    end

    private

    def data_hash_day(dayname, day_results)
      {
        label: dayname,
        values: device_models.map do |u|
          device_model_result = date_results && date_results[u]
          device_model_result ? device_model_result['count'] : 0
        end
      }
    end

    def data_hash_month(date, date_results)
      {
        label: label_monthly(date),
        values: device_models.map do |u|
          device_model_result = date_results && date_results[u]
          device_model_result ? device_model_result['count'] : 0
        end
      }
    end
  end
end
