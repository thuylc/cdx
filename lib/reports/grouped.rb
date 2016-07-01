module Reports
  class Grouped < Base

    def method_missing(sym, *args, &block)
      return grouped_by($1.to_sym) if /^by_(.*)/.match(sym.to_s) && groupings[$1.to_sym]
      super
    end

    def grouped_by(symbol)
      filter['group_by'] = groupings[symbol][0]
      filter['test.status'] = groupings[symbol][1] if groupings[symbol][1]
      results = TestResult.query(filter, current_user).execute
      total_count = results['total_count']
      no_error_code = total_count
      data = results['tests'].map do |test|
        no_error_code -= test['count']
        {
          _label: label(test[groupings[symbol][0]], symbol),
          _value: test['count']
        }
      end
      data << { _label: 'Unknown', _value: no_error_code } if no_error_code > 0
      slice_colors = ["#b5e083", "#069ada", "#aaaaaa", "#00A8AB", "#B7D6B7", "#D8B49C", "#DE6023", "#47B04B", "#009788", "#A05D56", "#D0743C", "#FF8C00"]

      {
        columns: data.each_with_index.map { |slice, i| { y: slice[:_value], color: slice_colors[i], indexLabel: "#{slice[:_label]} #percent%", legendText: slice[:_label] } }
      }
    end

    private

    def groupings
      {
        device: ['device.uuid'],
        error_code: ['test.error_code','invalid,error,no_result,in_progress'],
        failed: ['test.status','invalid,error,no_result'],
        model: ['device.model','error'],
        status: ['test.status'],
        successful: ['test.name','success'],
        unsuccessful: ['test.status','invalid,error,no_result,in_progress']
      }
    end

    def label(uuid, symbol)
      return lookup_device(uuid) if symbol == :device
      uuid
    end
  end
end
