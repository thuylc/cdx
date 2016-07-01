class Reports::Dashboard
  def initialize(current_user, navigation_context, options)
    @current_user       = current_user
    @navigation_context = navigation_context
    @options            = options
  end

  def total_tests
    Reports::AllTests.new(@current_user, @navigation_context, @options).generate_chart
  end

  def failed_tests
    Reports::Failed.new(@current_user, @navigation_context, @options).generate_chart
  end

  def query_site_tests
    Reports::Site.new(@current_user, @navigation_context, @options).generate_chart
  end

  def outstanding_orders
    Reports::OutstandingOrders.process(@current_user, @navigation_context, @options).latest_encounter
  end

  def average_test_per_site
    Reports::AverageSiteTests.new(@current_user, @navigation_context, @options).generate_chart
  end

  def total_tests_by_device
    Reports::Grouped.new(@current_user, @navigation_context, @options).by_device
  end

  def average_tests_per_technician
    Reports::AverageTechnicianTests.new(@current_user, @navigation_context, @options).generate_chart
  end
end
