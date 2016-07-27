require 'machinist/active_record'
require 'sham'
require 'faker'

class Sham
  # Emulates Machinist 2 serial number
  def self.sn
    @sn ||= 0
    @sn += 1
  end
end

SampleSshKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC4'+
          'hzyCbJQ5RgrZPFz+rTscTuJ5NPuBIKiinXwkA38CE9+N37L8q9kMqxsbDumVFbamYVlS9fsmF1TqRRhobfJfZGpt'+
          'kcthQde83FWHQGaEQn8T4SG055N5SWNRjQTfMaK0uTTQ28BN44dhLluF/zp4UDHOKRVBrJY4SZq1M5ytkMc6mlZW'+
          'bCAzqtIUUJOMKz4lHn5Os/d8temlYskaKQ1n+FuX5qJXNr1SW8euH72fjQndu78DCwVNwnnrG+nEe3a9m2QwL5xn'+
          'X8f1ohAZ9IG41hwIOvB5UcrFenqYIpMPBCCOnizUcyIFJhegJDWh2oWlBo041emGOX3VCRjtGug3 fbulgarelli@Manass-MacBook-2.local'

Sham.define do
  name { Faker::Name.name }
  email { Faker::Internet.email }
  password { Faker::Name.name }
  url { Faker::Internet.url }
end

User.blueprint do
  email
  password
  first_name { Faker::Name.first_name }
  last_name { Faker::Name.last_name }
  password_confirmation { password }
  confirmed_at { Time.now - 1.day }
end

Alert.blueprint do
  name { Faker::Name.first_name }
  description { Faker::Name.last_name }
  message { 'test message' }
  category_type {"anomalies"}
  sms_limit {10000}
  institution { object.site.try(:institution) || Institution.make }
  site { Site.make(institution: (object.institution || Institution.make)) }
  user { institution.user }
end

AlertRecipient.blueprint do
  user
  alert
  recipient_type {AlertRecipient.recipient_types["external_user"]}
  email {"aaa@aaa.com"}
  telephone {123}
  first_name {"bob"}
  last_name {'smith'}
end

AlertHistory.blueprint do
  user
  alert
  test_result
end

RecipientNotificationHistory.blueprint do
  user
  alert
  message_sent Faker::Lorem.sentence
end

Comment.blueprint do
  patient       { Patient.make }
  commented_on  { Faker::Date.between(60.days.ago, Date.today) }
  user          { User.make }
  description   { Faker::Lorem.sentence }
  comment       { Faker::Lorem.paragraph }
end

AuditLog.blueprint do
  patient       { Patient.make }
  user          { User.make }
  title         { Faker::Lorem.sentence }
  comment       { Faker::Lorem.paragraph }
end

AuditUpdate.blueprint do
  field_name    { Faker::Lorem.word }
  old_value     { Faker::Lorem.word }
  new_value     { Faker::Lorem.word }
  audit_log     { AuditLog.make }
end

User.blueprint(:invited_pending) do
  confirmed_at nil
  invitation_token { SecureRandom.urlsafe_base64 }
  invitation_created_at 1.day.ago
  invitation_sent_at 1.day.ago
  invitation_accepted_at nil
end

Institution.blueprint do
  user
  name
end

Institution.blueprint(:manufacturer) do
  kind { "manufacturer" }
end

Device.blueprint do
  site { Site.make(institution: (object.institution || Institution.make)) }
  institution { object.site.try(:institution) || Institution.make }
  name
  serial_number { SecureRandom.urlsafe_base64 }
  device_model { Manifest.make.device_model }
  time_zone { "UTC" }
end

DeviceLog.blueprint do
  device
end

DeviceCommand.blueprint do
  device
end

DeviceModel.blueprint do
  name
  published_at { 1.day.ago }
end

DeviceModel.blueprint(:unpublished) do
  name
  published_at { nil }
end

Manifest.blueprint do
  device_model
  definition { DefaultManifest.definition }
end

PageHeader.blueprint do
  institution { Institution.make }
end

SettingsPage.blueprint do
  institution { Institution.make }
end

Encounter.blueprint do
  patient { Patient.make }
  institution { object.patient.try(:institution) || Institution.make }
  user { institution.user }
  site { object.institution.sites.first || object.institution.sites.make }
  performing_site { object.institution.sites.first || object.institution.sites.make }
  core_fields {
    { "id" => "encounter-#{Sham.sn}" }.tap do |h|
      h["start_time"] = object.start_time if object.start_time
    end
  }
end

Episode.blueprint do
  diagnosis :presumptive_tb
  hiv_status :unknown
  drug_resistance :mono
  initial_history :previous
  previous_history :relapsed
  outcome :cured
end

RequestedTest.blueprint do
  encounter
  name { "CD4" }
  status { RequestedTest.statuses["pending"] }
  comment {"this is a  comment for the requested test ......"}
end


def first_or_make_site_unless_manufacturer(institution)
  unless institution.kind_manufacturer?
    institution.sites.first || institution.sites.make
  end
end

SampleIdentifier.blueprint do
  sample { Sample.make_unsaved({}.tap do |h|
    h[:institution] = object.site.institution if object.site
  end)}
  site { first_or_make_site_unless_manufacturer(object.sample.institution) }
end

Sample.blueprint do
  institution { object.encounter.try(:institution) || object.patient.try(:institution) || Institution.make }
  patient { object.encounter.try(:patient) }
end

Patient.blueprint do
  name Faker::Name.name
  institution
  is_phantom { false }
  plain_sensitive_data {
    {}.tap do |h|
      h["id"]   = object.entity_id || "patient-#{Sham.sn}"
      h["name"] = object.name if object.name
    end
  }
end

Address.blueprint do
  address  { Faker::Address.street_address }
  city     { Faker::Address.city }
  state    { Faker::Address.state }
  zip_code { Faker::Address.zip_code }
end

Patient.blueprint :phantom do
  institution
  is_phantom { true }
  plain_sensitive_data {
    {}.tap do |h|
      h["id"]   = nil
      h["name"] = object.name if object.name
    end
  }
end

TestResult.blueprint do
  test_id { "test-#{Sham.sn}" }

  device_messages { [ DeviceMessage.make(device: object.device || Device.make) ] }
  device { object.device_messages.first.try(:device) || Device.make }
  institution { object.device.try(:institution) || Institution.make }
  sample_identifier { SampleIdentifier.make(site: object.device.try(:site), sample: Sample.make(institution: object.institution, patient: object.patient, encounter: object.encounter)) }

  encounter { object.sample.try(:encounter) }
  patient { object.sample.try(:patient) || object.encounter.try(:patient) }
end

CultureResult.blueprint do
  requested_test { RequestedTest.make }
  sample_collected_on { 23.days.ago}
  serial_number { 'some random serial numbers' }
  media_used { 'solid' }
  test_result { 'contaminated' }
  examined_by { Faker::Name.name }
  result_on { 7.days.from_now }
end

DstLpaResult.blueprint do
  requested_test { RequestedTest.make }
  sample_collected_on { 23.days.ago}
  serial_number { 'some random serial numbers' }
  media_used { 'solid' }
  results_h { 'resistant' }
  results_r  { 'resistant' }
  results_e { 'susceptible' }
  results_s { 'contaminated'}
  results_amk { 'not_done' }
  results_km { 'contaminated' }
  results_cm {'not_done' }
  results_fq { 'susceptible' }
  results_other1 'Some other things'
  examined_by { Faker::Name.name }
  result_on { 7.days.from_now }
end

MicroscopyResult.blueprint do
  requested_test { RequestedTest.make }
  sample_collected_on { 23.days.ago}
  serial_number { 'some random serial numbers' }
  appearance { 'blood' }
  specimen_type { 'some type' }
  test_result { '1to9' }
  examined_by { Faker::Name.name }
  result_on { 7.days.from_now }
end

XpertResult.blueprint do
  requested_test { RequestedTest.make }
  sample_collected_on { 23.days.ago}
  tuberculosis { 'invalid' }
  rifampicin { 'detected' }
  examined_by { Faker::Name.name }
  result_on { 7.days.from_now }
end

DeviceMessage.blueprint do
  device
end

Policy.blueprint do
  name
  granter { Institution.make.user }
  definition { policy_definition(object.granter.institutions.first, Policy::Actions::CREATE_INSTITUTION, true) }
  user
end

Role.blueprint do
  name
  policy
  institution
  site { Site.make institution: object.institution }
end

Subscriber.blueprint do
  user
  name
  url
  last_run_at { Time.now }
end

Filter.blueprint do
  user
  name
end

Site.blueprint do
  institution
  name
  location_geoid { object.location.try(:id) || LocationService.repository.make.id }
  address { Faker::Address.street_address }
  city { Faker::Address.city }
  state { Faker::Address.state }
  zip_code { Faker::Address.zip_code }
  country { Faker::Address.country }
  region { Faker::Address.state }
  lat { rand(-180..180) }
  lng { rand(-90..90) }
end

Site.blueprint :child do
  parent { nil }
  institution { parent.institution }
end

Location; class Location
  def self.make(params={})
    LocationService.repository.make(params)
  end
end
