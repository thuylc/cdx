module Reports
  class AverageTechnicianTests < Base

    def generate_chart
      average_tests
      {
        title:   '',
        titleY:  'Peak Tests',
        titleY2: 'Average Tests',
        columns: generate_columns
      }
    end

    protected

    def average_tests
      process
      filter['group_by'] = "test.site_user,#{day_or_month}(test.start_time)"
      test_users_list=[]
      results = TestResult.query(@filter, current_user).execute
      results['tests'].each do |result|
        test_user = result['test.site_user']
        matched_test_user= test_users_list.find { |x| x[:site_user] == test_user }

        if matched_test_user
          matched_test_user[:total] += result['count']
          matched_test_user[:number_results] += 1
          matched_test_user[:peak] = result['count'] if matched_test_user[:peak] < result['count']
        else
          test_users_list << {
            site_user: test_user,
            total: result['count'],
            peak: result['count'],
            average: 0,
            number_results: 1
          }
        end
      end

      calculate_average(test_users_list)
      data = format_data(test_users_list)
    end

    def calculate_average(test_result_data)
      test_result_data.map do |test_user_data|
        if (test_user_data[:total] > 0) && (test_user_data[:number_results] > 0)
          test_user_data[:average] = test_user_data[:total] / test_user_data[:number_results]
        end
      end
    end

    def format_data(test_result_data)
      test_result_data.map do |test_user_data|
        data << {
          _label: test_user_data[:site_user].truncate(12),
          'Peak Tests': test_user_data[:peak],
          'Average Tests': test_user_data[:average]
        }
      end
      data
    end

    def generate_columns
      [
        {
          type: "column",
          color: "#9dce65",
          name: "Peak tests",
          legendText: "Peak",
          showInLegend: true,
          dataPoints: data.map { |result| { label: result[:_label], y: result['Peak Tests'] } }
        },
        {
          type: "column",
          color: "#069ada",
          name: "Average tests",
          legendText: "Average",
          axisYType: "secondary",
          showInLegend: true,
          dataPoints: data.map { |result| { label: result[:_label], y: result['Average Tests'] } }
        }
      ]
    end
  end
end
