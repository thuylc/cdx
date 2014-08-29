class Manifest < ActiveRecord::Base
  has_and_belongs_to_many :device_models

  validate :manifest_validation
  before_save :update_models
  before_save :update_version
  before_save :update_api_version
  after_save :update_mappings

  COLLECTION_SPLIT_TOKEN = "[*]."
  PATH_SPLIT_TOKEN = "."

  NULL_STRING = "null"

  def self.default
    new definition: default_definition
  end

  def update_models
    self.device_models = Array(metadata["device_models"] || []).map { |model| DeviceModel.find_or_create_by(name: model)}
  end

  def update_version
    self.version = metadata["version"]
  end

  def update_api_version
    self.api_version = metadata["api_version"]
  end

  def metadata
    Oj.load(self.definition)["metadata"] rescue {}
  end

  def apply_to(data)
    decoded = Oj.load(definition)
    decoded["field_mapping"].inject(indexed: Hash.new, pii: Hash.new, custom: Hash.new) do |event, mapping|
      apply_single_mapping(mapping, data, event)
    end
  end

  def field_mapping
    Oj.load(self.definition).with_indifferent_access["field_mapping"]
  end

  def apply_single_mapping(mapping, data, event)
    target_field = mapping["target_field"]
    selector = mapping["selector"]
    value = apply_selector(selector, data)
    valid_values = valid_values_for mapping
    check_valid_value(value, mapping, target_field, valid_values)
    value = apply_value_mappings(value, target_field, mapping["value_mappings"])
    key = hash_key(target_field, mapping["core"], mapping["indexed"], mapping["pii"])

    if (targets = target_field.split(Manifest::COLLECTION_SPLIT_TOKEN)).size > 1
      # find the array or create it. Only one level for now
      target_array = event[key][targets.first] ||= Array.new
      # merge the new values
      if value.present?
        Array(value).each_with_index do |value, index|
          (target_array[index] ||= Hash.new)[targets[-1]] = value
        end
      end
    else
      event[key][target_field] = value
    end

    event
  end

  def apply_selector(selector, data)
    if (targets = selector.split(Manifest::COLLECTION_SPLIT_TOKEN)).size > 1

      paths = targets.first.split Manifest::PATH_SPLIT_TOKEN

      elements_array = paths.inject data do |current, path|
        current[path] || []
      end
      elements_array.map do |element|
        paths = targets.last.split "."
        paths.inject element do |current, path|
          current[path]
        end
      end
    else
      paths = selector.split "."
      paths.inject data do |current, path|
        current[path] if current.is_a? Hash
      end
    end
  end

  def hash_key(target_field, core, indexed, pii)
    if core
      return :pii if Event.pii?(target_field)
      :indexed
    else
      return :pii if pii
      return :indexed if indexed
      :custom
    end
  end

  def check_valid_value(value, mapping, target_field, valid_values)
    return unless value.present?

    if mapping['type'] == 'integer' and !value.is_a? Integer
      if value.to_i.to_s != value
        raise ManifestParsingError.invalid_value_for_integer value, target_field
      end
    end

    verify_value_is_not_null_string value, mapping

    return value if valid_values ==  nil

    if value.is_a? Array
      value.each do |v|
        check_valid_value v, mapping, target_field, valid_values
      end
    else
      if options = valid_values["options"]
        check_value_in_options(value, target_field, options)
      end

      if range = valid_values["range"]
        check_value_in_range(value, target_field, range)
      end

      if date = valid_values["date"]
        check_value_is_date(value, target_field, date)
      end
    end

  end

  def verify_value_is_not_null_string value, mapping
    if value == NULL_STRING
      raise ManifestParsingError.new "String 'null' is not permitted as value, in field '#{invalid_field(mapping)}'"
    end
  end

  def check_value_in_options(value, target_field, options)
    unless options.include? value
      raise ManifestParsingError.new "'#{value}' is not a valid value for '#{target_field}' (valid options are: #{options.join ", "})"
    end
  end

  def check_value_in_range(value, target_field, range)
    min = range["min"]
    max = range["max"]

    unless min <= value and value <= max
      raise ManifestParsingError.new "'#{value}' is not a valid value for '#{target_field}' (valid values must be between #{min} and #{max})"
    end
  end

  def check_value_is_date(value, target_field, date_format)
    case date_format
    when "iso"
      Time.parse(value) rescue raise ManifestParsingError.new "'#{value}' is not a valid value for '#{target_field}' (valid value must be an iso date)"
    else
      raise ManifestParsingError.new "Date format not implemented"
    end
  end

  def apply_value_mappings(value, target_field, mappings)
    return value unless mappings

    matched_mapping = mappings.keys.detect do |mapping|
      value.match mapping.gsub("*", ".*")
    end

    if matched_mapping
      mappings[matched_mapping]
    else
      raise ManifestParsingError.new "'#{value}' is not a valid value for '#{target_field}' (valid value must be in one of these forms: #{mappings.keys.join ", "})"
    end
  end

  def self.default_definition
    field_mapping = Event.sensitive_fields.map do |sensitive_field|
      {
        target_field: sensitive_field,
        selector: sensitive_field,
        core: true,
        type: 'string',
        pii: true,
        indexed: false
      }
    end

    field_mapping.concat(map(Cdx::Api.searchable_fields).flatten)
    Oj.dump field_mapping: field_mapping
  end

  private

  def self.map fields, selector_prefix=""
    fields.map do |field_definition|
      field = selector_prefix + field_definition[:name]
      if field_definition[:type] == "nested"
        map field_definition[:sub_fields], "#{selector_prefix}#{field_definition[:name]}[*]."
      else
        {
          target_field: field,
          selector: field,
          type: field_definition[:type],
          core: true,
          pii: false,
          indexed: true,
          valid_values: field_definition[:valid_values]
        }
      end
    end
  end

  def valid_values_for mapping
    if mapping["core"]
      valid_values_for_core mapping["target_field"]
    else
      mapping["valid_values"]
    end
  end

  def valid_values_for_core target_field
    field = Oj.load(Manifest.default_definition)["field_mapping"].detect { |f| f["target_field"] == target_field }
    valid_values = field["valid_values"]
    valid_values
  end

  def manifest_validation
    if self.metadata.blank?
      self.errors.add(:metadata, "can't be blank")
    else
      fields =  ["version","api_version","device_models"]
      check_fields_in_metadata(fields)
    end

    check_field_mapping

  rescue Oj::ParseError => ex
    self.errors.add(:parse_error, ex.message)
  end

  def check_fields_in_metadata(fields)
    m = self.metadata
    fields.each do |f|
      if m[f].blank?
        self.errors.add(:metadata, "must include "+ f +" field")
      end
    end
  end

  def check_field_mapping
    definition = Oj.load self.definition
    if definition["field_mapping"].is_a? Array
      definition["field_mapping"].each do |fm|
        check_presence_of_target_field_and_selector fm
        check_presence_of_core_field fm
        if (fm["valid_values"] && fm["valid_values"]["options"])
          verify_absence_of_null_string fm
        end
        if (fm["core"] == true)
          check_valid_values fm
          check_value_mappings fm
        else
          check_valid_type fm
        end
      end
    else
      self.errors.add(:field_mapping, "must be an array")
    end
  end

  def verify_absence_of_null_string field_mapping
    if field_mapping["valid_values"]["options"].include? NULL_STRING
      self.errors.add(:string_null, ": cannot appear as valid value. (In '#{invalid_field(field_mapping)}') ")
    end
  end

  def invalid_field field_mapping
    invalid_field = field_mapping["target_field"]
    invalid_field ||= field_mapping["selector"]
    invalid_field
  end

  def check_presence_of_core_field field_mapping
    if (field_mapping["core"].nil?)
      self.errors.add(:invalid_field_mapping, ": target '#{invalid_field(field_mapping)}'. Mapping must include a core field")
    end
  end

  def check_presence_of_target_field_and_selector field_mapping
    if (field_mapping["target_field"].blank? || field_mapping["selector"].blank?)
      self.errors.add(:invalid_field_mapping, ": target '#{invalid_field(field_mapping)}'. Mapping must include target_field and selector")
    end
  end

  def check_valid_values(field_mapping)
    if (field_mapping["valid_values"].present?)
      self.errors.add(:invalid_field_mapping, ": target '#{field_mapping["target_field"]}'. Valid values are not permitted for core fields")
    end
  end

  def check_value_mappings(field_mapping)
    searchable_fields = Cdx::Api.searchable_fields
    if(field_mapping["value_mappings"].present?)
      target = searchable_fields.select { |f| f.name == field_mapping["target_field"] }.first
      field_mapping["value_mappings"].values.each do |vm|
        #Assuming there is an options key for valid_values field
        if !target["valid_values"]["options"].include? vm
          self.errors.add(:invalid_field_mapping, ": target '#{field_mapping["target_field"]}'. '#{vm}' is not a valid value")
        end
      end
    end
  end

  def update_mappings
    mapping_template = ElasticsearchMappingTemplate.new

    mapping_template.load
    mapping_template.update_existing_indices_with self
  end

  def check_valid_type(field_mapping)
    valid_types = ["integer", "date", "string"]
    if(field_mapping["type"].blank? || ! valid_types.include?(field_mapping["type"]))
      self.errors.add(:invalid_type, ": custom fields must include a type, with value 'integer', 'date' or 'string'")
    end
  end

end
