module Reports
  class Failed < Base
    attr_reader :total_tests, :failed_tests

    def process
      @total_tests ||= sum_total
      @failed_tests ||= sum_failed
      sort_pie
      return self
    end

    private

    def local_process
      @results = TestResult.query(filter, current_user).execute
    end

    def sort_pie
      data << { _label: 'Success', _value: total_tests - failed_tests, _img: "chart-box-tick"}
      data << { _label: 'Failed', _value: failed_tests, _img:"chart-box-exclam" }
    end

    def sum_total
      local_process
      results['total_count']
    end

    def sum_failed
      filter['test.status'] = 'invalid,error,no_result'
      local_process
      results['total_count']
    end
  end
end
