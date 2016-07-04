require 'spec_helper'

describe Presenters::PatientLogs do
  let(:user)           { User.make }
  let!(:institution)   { user.institutions.make }
  let(:patient)        { Patient.make institution: institution }

  describe 'patient_view' do
    before :each do
      7.times { AuditLog.make patient: patient, user: user  }
    end

    it 'should return an array of formated comments' do
      expect(Presenters::PatientLogs.patient_view(patient.audit_logs).size).to eq(7)
    end

    it 'should return elements formated' do
      expect(Presenters::PatientLogs.patient_view(patient.audit_logs).first).to eq({
        id:       patient.audit_logs.first.uuid,
        date:     I18n.l(patient.audit_logs.first.created_at, format: :short),
        user:     patient.audit_logs.first.user.full_name,
        title:    patient.audit_logs.first.title,
        viewLink: Rails.application.routes.url_helpers.patient_patient_log_path(patient.audit_logs.first.patient, patient.audit_logs.first)
      })
    end
  end
end
