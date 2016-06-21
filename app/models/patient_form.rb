class PatientForm
  include ActiveModel::Model
  include Auditable

  def self.shared_attributes # shared editable attributes with patient model
    [:institution, :site, :name, :entity_id, :gender, :dob, :lat, :lng, :location_geoid, :address, :email, :phone, :city, :zip_code, :state]
  end

  def self.model_name
    Patient.model_name
  end

  def model_name
    self.class.model_name
  end

  def self.human_attribute_name(*args)
    # required to bind validations to active record i18n
    Patient.human_attribute_name(*args)
  end

  attr_accessor *shared_attributes
  delegate :id, :new_record?, :persisted?, to: :patient

  def patient
    @patient ||= Patient.new
  end

  def patient=(value)
    @patient = value
    self.class.assign_attributes(self, @patient)
    self.dob = Time.parse(@patient.dob) rescue nil # dob is stored as String, but in PatientForm it needs to be set as Time when editing
  end

  def self.edit(patient)
    new.tap do |form|
      form.patient = patient
    end
  end

  def update(attributes, audit=false, audit_params={})
    attributes.each do |attr, value|
      self.send("#{attr}=", value)
    end

    Audit::Auditor.new(patient, audit_params[:current_user].id).log_changes(audit_params[:title], audit_params[:comment])

    save
  end

  def update_and_audit(attributes, current_user, title, comment='')
    update(attributes, true, { current_user: current_user, title: title, comment: comment })
  end

  def save(audit_params={})
    self.class.assign_attributes(patient, self)
    patient.dob = @dob  # we need to set a Time in patient insead of self.dob :: String

    # validate forms. stop if invalid
    form_valid = self.valid?
    return false unless form_valid

    # validate/save patient. all done if succeeded
    if patient.save
      Audit::Auditor.new(self.patient, audit_params[:current_user].id).log_action(audit_params[:title], audit_params[:comment]) if audit_params.present?
      return true
    end

    # copy validations from patient to form (form is valid, but patient is not)
    patient.errors.each do |key, error|
      errors.add(key, error) if self.class.shared_attributes.include?(key)
    end

    return false
  end

  def save_and_audit(current_user, title, comment='')
    save(current_user: current_user, title: title, comment: comment)
  end

  def destroy_and_audit(current_user, title, comment='')
    Audit::Auditor.new(self.patient, current_user.id).log_action(title, comment)
    destroy
  end

  validates_presence_of :name, :entity_id
  GENDER_VALUES = Patient.entity_fields.detect { |f| f.name == 'gender' }.options
  validates_inclusion_of :gender, in: GENDER_VALUES, allow_blank: true, message: "is not within valid options (should be one of #{GENDER_VALUES.join(', ')})"

  # begin dob
  # @dob is Time | Nil | String.
  # PatientForm#dob will return always a string ready to be used by the user input with the user locale
  # PatientForm#dob= will accept either String or Time. The String will be converted if possible to a Time using the user locale
  validate :dob_is_a_date

  def date_format
    { pattern: I18n.t('date.input_format.pattern'), placeholder: I18n.t('date.input_format.placeholder') }
  end

  def dob
    value = @dob

    if value.is_a?(Time)
      return value.strftime(date_format[:pattern])
    end

    value
  end

  def dob=(value)
    value = nil if value.blank?

    @dob = if value.is_a?(String)
      Time.strptime(value, date_format[:pattern]) rescue value
    else
      value
    end
  end

  def dob_placeholder
    date_format[:placeholder]
  end

  def dob_is_a_date
    return if @dob.blank?
    errors.add(:dob, "should be a date in #{dob_placeholder}") unless @dob.is_a?(Time)
  end
  # end dob

  private

  def self.assign_attributes(target, source)
    shared_attributes.each do |attr|
      target.send("#{attr}=", source.send(attr))
    end
  end
end
