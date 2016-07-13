class TestOrdersController < TestsController

  def index
    @results = Cdx::Fields.test.core_fields.find { |field| field.name == 'result' }.options.map do |result|
      if result == "n/a"
        {value: 'n/a', label: I18n.t('test_orders.index.not_applicable')}
      else
        {value: result, label: result.capitalize}
      end
    end
    @test_types    = Cdx::Fields.test.core_fields.find { |field| field.name == 'type' }.options
    @test_statuses = ['success','error']
    @conditions    = Condition.all.map &:name
    @date_options  = Extras::Dates::Filters.date_options_for_filter


    @filter    = create_filter_for_test_order
    @query     = @filter.dup

    respond_to do |format|
      format.html do
        execute_encounter_query
      end

      format.csv do
        filename                       = "test-orders-#{DateTime.now.strftime('%Y-%m-%d-%H-%M-%S')}.csv"
        headers["Content-Type"]        = "text/csv"
        headers["Content-disposition"] = "attachment; filename=#{filename}"
        self.response_body = execute_csv_test_order_query(filename)
      end
    end
  end

  protected

  def execute_encounter_query
    result = Encounter.query(@query, current_user).execute
    build_table_data(result["encounters"])
  end

  def execute_csv_test_order_query(filename)
    query = Encounter.query(@query, current_user)
    EntityCsvBuilder.new("encounter", query, filename)
  end

  def build_table_data(results)
    @total           = Encounter.where(uuid: results.map{|r| r['encounter']['uuid'] if r['encounter'] }).count
    order_by, offset = perform_pagination('encounters.testdue_date')
    order_by         = order_by + ', users.last_name' if order_by.include?('users.first_name')
    @tests           = Encounter.includes(:institution, :patient, :site, :user).where(uuid: results.map{|r| r['encounter']['uuid'] if r['encounter'] }).order(order_by).limit(@page_size).offset(offset)
  end

  def create_filter_for_test_order
    filter = {}
    filter["institution.uuid"] = @navigation_context.institution.uuid if @navigation_context.institution
    if @navigation_context.exclude_subsites && @navigation_context.site
      filter["site.uuid"] = @navigation_context.site.uuid
    elsif !@navigation_context.exclude_subsites && @navigation_context.site
      # site.path is used in order to select entitites of descending sites also
      filter["site.path"] = @navigation_context.site.uuid
    elsif @navigation_context.exclude_subsites
      filter["site.uuid"] = "null"
    end
    filter["encounter.uuid"]                = params["encounter.id"] if params["encounter.id"].present?
    filter["encounter.diagnosis.condition"] = params["test.assays.condition"] if params["test.assays.condition"].present?
    filter["encounter.diagnosis.result"]    = params["test.assays.result"] if params["test.assays.result"].present?
    filter["since"]                         = params["since"] if params["since"].present?
    filter
  end
end
