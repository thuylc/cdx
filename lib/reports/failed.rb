module Reports
  class Failed < Base
    attr_reader :total_tests, :failed_tests

    def process
      @total_tests ||= sum_total
      @failed_tests ||= sum_failed
      sort_pie
      return self
    end

    def generate_chart
      @total_tests ||= sum_total
      @failed_tests ||= sum_failed
      sort_pie

      slice_colors = ["#b5e083", "#069ada", "#aaaaaa", "#00A8AB", "#B7D6B7", "#D8B49C", "#DE6023", "#47B04B", "#009788", "#A05D56", "#D0743C", "#FF8C00"]

      {
        columns: data.each_with_index.map { |slice, i| { y: slice[:_value], color: slice_colors[i], indexLabel: "#{slice[:_label]} #percent%", legendText: slice[:_label] } }
      }
    end

    private

    def local_process
      @results = TestResult.query(filter, current_user).execute
    end

    def sort_pie
      im1 = ActionController::Base.helpers.asset_url("chart-box-tick.png", type: :image)
      im2 = ActionController::Base.helpers.asset_url("chart-box-exclam.png", type: :image)
      data << { _label: 'Success', _value: total_tests - failed_tests, _img: im1}
      data << { _label: 'Failed', _value: failed_tests, _img: im2 }
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
