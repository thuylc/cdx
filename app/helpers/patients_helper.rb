module PatientsHelper
  def patient_address_component(patient)
    react_component 'Address',
      latName: 'patient[lat]', lngName: 'patient[lng]', addressName: 'patient[address]', locationName: 'patient[location_geoid]',
      defaultLocation: patient.location_geoid,
      defaultAddress: patient.address,
      defaultLatLng: { lat: patient.lat, lng: patient.lng }
  end

  def patient_birth_date(dob)
    return unless dob

    birth_date = Time.parse(dob)
    return unless birth_date

    "#{I18n.l(birth_date, format: :date_only)} - #{birth_date_to_words(birth_date)}"
  end

  def birth_date_to_words(birth_date)
    years = Date.today.year - birth_date.year

    if years > 1
      "#{years}y/o."
    else
      months = (Date.today.year * 12 + Date.today.month) - (birth_date.year * 12 + birth_date.month)
      "#{months}m/o."
    end
  end

  def patient_diagnostic(encounter)
    encounter.diagnostic.blank? ? "Pending" : encounter.human_diagnose
  end

  def patient_observations(encounter)
    encounter.observations.blank? ? "No comments" : encounter.observations
  end

  def patient_display_name(patient_name)
    patient_name.present? ? patient_name : '(Unknown name)'
  end
end
