require 'cdx/api/elasticsearch/local_timezone_conversion'

class Cdx::Api::Elasticsearch::Query
  attr_accessor :indices

  class << self
    include Cdx::Api::LocalTimeZoneConversion
  end

  DEFAULT_PAGE_SIZE = 50
  MAX_PAGE_SIZE = 10000

  def initialize(params, fields, api = Cdx::Api)
    @params = params
    @fields = fields
    @result_name = fields.result_name
    @api = api
    @indices = api.index_name_pattern
  end

  def before_execute(&block)
    @before_execute ||= []
    @before_execute << block
  end

  def after_execute(&block)
    @after_execute ||= []
    @after_execute << block
  end

  def execute
    if @before_execute
      @before_execute.each do |block|
        block.call self
      end
    end

    results = query
    @current_count = results[@result_name].size
    @total_count = results['total_count']

    if @after_execute
      @after_execute.inject results do |results, block|
        block.call results
      end
    else
      results
    end
  end

  def next_page
    return true unless @current_count && @total_count

    return false if @current_count == 0

    current_offset = @params['offset'] || 0
    return false if current_offset + @current_count >= @total_count

    @params['offset'] = current_offset + @current_count
    @current_count = @total_count = nil
    true
  end

  def grouped_by
    (@params['group_by'] || '').split(',')
  end

  def elasticsearch_query
    self.class.and_conditions(process_conditions(@params))
  end

  protected

  def query
    query = elasticsearch_query

    if @params['group_by']
      entities = query_with_group_by(query, @params['group_by'])
      if @params['order_by']
        all_orders = self.class.extract_multi_values(@params['order_by'])
        all_orders.map do |order|
          entities = entities.sort_by { |entity| entity[order.delete('-')] }
          entities = entities.reverse if order[0] == '-'
        end
      end
      total_count = entities.inject(0) { |sum, result| sum + result['count'].to_i }
    else
      entities, total_count = query_without_group_by(query)
    end

    entities = @fields.translate_entities entities

    { @result_name => entities, 'total_count' => total_count }
  end

  def query_without_group_by(query)
    sort = process_order
    page_size = [[@params['page_size'].try(:to_i) || DEFAULT_PAGE_SIZE, 1].max, MAX_PAGE_SIZE].min
    offset = @params['offset']

    es_query = { body: { query: query, sort: sort } }
    es_query[:size] = page_size
    es_query[:from] = offset if offset.present?

    results = @api.search_elastic es_query.merge(index: indices, type: search_type)
    hits = results['hits']
    total = hits['total']
    results = hits['hits'].map { |hit| hit['_source'] }
    [results, total]
  end

  def process_conditions(params, conditions = [])
    conditions = process_fields(@fields.searchable_fields, params, conditions)
    if conditions.empty?
      [{ match_all: [] }]
    else
      conditions
    end
  end

  def self.and_conditions(conditions)
    return conditions.first if conditions.size == 1
    { bool: { must: conditions } }
  end

  def self.or_conditions(conditions)
    return conditions.first if conditions.size == 1
    { bool: { should: conditions } }
  end

  def process_fields(fields, params, conditions = [])
    fields.inject conditions do |conditions, field_definition|
      if field_definition.nested?
        nested_conditions = process_fields(field_definition.sub_fields, params)
        if nested_conditions.empty?
          conditions
        else
          conditions + [{
            nested: {
              path: field_definition.name,
              query: self.class.and_conditions(nested_conditions)
            }
          }]
        end
      else
        (field_definition.filter_definitions || []).inject conditions do |conditions, filter_definition|
          self.class.process_field(field_definition, filter_definition, params, conditions)
        end
      end
    end
  end

  def self.process_field(field_definition, filter_definition, params, conditions)
    field_value = params[filter_definition['name']]
    if field_value
      case filter_definition['type']
      when 'match'
        conditions.push process_match_field(field_definition.name, field_value)
      when 'range-integer'
        conditions.push range: { field_definition.name => ({ filter_definition['boundary'] => field_value }) }
      when 'range'
        field_value = convert_timezone_if_date(field_value)
        conditions.push range: { field_definition.name => ({ filter_definition['boundary'] => field_value }.merge filter_definition['options']) }
      when 'duration'
        conditions.push process_duration_field(field_definition.name, field_value)
      when 'wildcard'
        conditions.push process_wildcard_field(field_definition, field_value)
      end
    end
    conditions
  end

  def self.process_match_field(field_name, field_value)
    process_multi_field(field_value) do |value|
      process_null(field_name, value) do
        process_single_match_field(field_name, value)
      end
    end
  end

  def self.process_single_match_field(field_name, field_value)
    { match: { field_name => field_value } }
  end

  def self.process_duration_field(field_name, field_value)
    process_multi_field(field_value) do |value|
      process_null(field_name, value) do
        process_single_duration_field(field_name, value)
      end
    end
  end

  def self.process_single_duration_field(field_name, field_value)
    { range: { "#{field_name}.in_millis" => Cdx::Field::DurationField.parse_range(field_value) } }
  end

  def self.process_wildcard_field(field_definition, field_value)
    process_multi_field(field_value) do |value|
      process_null(field_definition.name, value) do
        process_single_wildcard_field(field_definition, value)
      end
    end
  end

  def self.process_single_wildcard_field(field_definition, field_value)
    if /.*\*.*/ =~ field_value
      { wildcard: { field_definition.name => field_value } }
    else
      { match: { field_matcher(field_definition.name, field_definition.type) => field_value } }
    end
  end

  def self.process_multi_field_with_nulls(field_name, field_value, &block)
    process_multi_field(field_value) do |value|
      process_null(field_name, value, &block)
    end
  end

  def self.process_multi_field(field_value, &block)
    values = extract_multi_values(field_value)
    values = values.map(&block)
    or_conditions values
  end

  def self.extract_multi_values(field_value)
    if field_value.is_a?(Array)
      field_value
    else
      field_value.to_s.split(',').map(&:strip)
    end
  end

  def self.process_null(field_name, value)
    if value == 'null'
      { filtered: { filter: { missing: { field: field_name } } } }
    elsif value == 'not(null)'
      { filtered: { filter: { exists: { field: field_name } } } }
    else
      yield(value)
    end
  end

  def self.field_matcher(field_name, field_type)
    if field_type == :multi_field
      "#{field_name}.analyzed"
    else
      field_name
    end
  end

  def process_order
    order = @params['order_by'] || @fields.default_sort
    all_orders = self.class.extract_multi_values(order)
    all_orders.map do |order|
      if order[0] == '-'
        order = order[1..-1]
        sorting = 'desc'
      else
        sorting = 'asc'
      end

      duration_field = @fields.searchable_fields.detect { |field| field.scoped_name == order && field.type == 'duration' }

      order = "#{order}.in_millis" if duration_field

      { order => { order: sorting, ignore_unmapped: true } }
    end
  end

  def query_with_group_by(query, group_by)
    group_by =
      case group_by
      when String
        group_by.to_s.split ','
      when Hash
        [group_by]
      else
        Array(group_by)
      end

    group_by = group_by.map do |field|
      name, value = extract_group_by_criteria field
      Cdx::Api::Elasticsearch::IndexedField.grouping_detail_for name, value, @fields
    end

    fail 'Unsupported group' if group_by.include? nil

    aggregations = Cdx::Api::Elasticsearch::Aggregations.new group_by, @params

    result = @api.search_elastic body: aggregations.to_hash.merge(query: query, size: 0), index: indices, type: search_type
    if result['aggregations']
      process_group_by_buckets(result['aggregations'], aggregations.in_order, [], {}, 0)
    else
      []
    end
  end

  def extract_group_by_criteria(field)
    field = field.first if field.is_a?(Array) && field.size == 1

    if field.is_a? Hash
      name = field.keys.first
      value = field[name]
    else
      name = field
      value = nil
    end

    [name, value]
  end

  def process_group_by_buckets(aggregations, group_by, entities, entity, doc_count)
    GroupingDetail.process_buckets(aggregations, group_by, entities, entity, doc_count)
  end

  def search_type
    @fields.entity_name
  end
end
