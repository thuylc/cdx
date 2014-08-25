class Cdx::Api::Elasticsearch::Initializer

  def initialize(api)
    @api = api
  end

  def initialize_default_template(template_name)
    @api.client.indices.put_template name: template_name, body: template
  end

  def template
    {
      template: @api.config.index_name_pattern,
      mappings: {
        event: {
          properties: build_properties_mapping
        }
      }
    }
  end

  def build_properties_mapping
    map_fields @api.searchable_fields
  end

  def map_fields fields
    fields.inject({}) do |properties, field|
      map_field properties, field
    end
  end

  def map_field properties, field
    case field[:type]
    when "nested"
      properties[field[:name]] = {type: :nested, properties: map_fields(field[:sub_fields])}
    when "location"
      properties["parent_#{field[:name].pluralize}"] = { type: :integer }

      properties[field[:name]] = { 
        type: :nested,
        properties: Hash[ (0..3).map { |i|
          ["admin_level_#{i}", { type: :integer, index: :not_analyzed } ]
        }]
      }
    else
      field_body =
        case field[:type]
        when "multi_field"
          {
            fields: {
              analyzed: {type: :string, index: :analyzed},
              field[:name] => {type: :string, index: :not_analyzed}
            }
          }
        else
          {index: :not_analyzed}
        end
      properties[field[:name]] = {type: field[:type]}.merge(field_body)
    end
    properties
  end

end