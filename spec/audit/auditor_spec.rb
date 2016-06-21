require 'spec_helper'

describe Audit::Auditor do
  let(:user)    { User.make }
  let(:patient) { Patient.make name: 'Ruben Barichello'}

  describe 'create' do
    before :each do
      described_class.new(patient, user.id).log_action('New patient added')
    end

    it 'should add a new audit log' do
      expect{ described_class.new(patient, user.id).log_action('New patient added') }.to change{ AuditLog.count }.by(1)
    end

    it 'should add a title' do
      expect(AuditLog.first.title).to eq('New patient added')
    end

    it 'should add a patient' do
      expect(AuditLog.first.patient).to eq(patient)
    end

    it 'should add an user' do
      expect(AuditLog.first.user).to eq(user)
    end
  end

  describe 'update' do
    before :each do
      patient.name = 'Graham Hill'
      described_class.new(patient, user.id).log_changes('Patient details have been updated')
    end

    it 'should add a new audit log' do
      expect{ described_class.new(patient, user.id).log_changes('Patient details have been updated') }.to change{ AuditLog.count }.by(1)
    end

    it 'should add a title' do
      expect(AuditLog.first.title).to eq('Patient details have been updated')
    end

    it 'should add a patient' do
      expect(AuditLog.first.patient).to eq(patient)
    end

    it 'should add an user' do
      expect(AuditLog.first.user).to eq(user)
    end

    context 'with updated values' do
      subject { AuditLog.first.audit_updates.where(field_name: 'name').first }

      it 'should log the name change' do
        expect(subject).to be
      end

      it 'should log the name old value' do
        expect(subject.old_value).to eq('Ruben Barichello')
      end

      it 'should log the name new value' do
        expect(subject.new_value).to eq('Graham Hill')
      end
    end
  end
end
