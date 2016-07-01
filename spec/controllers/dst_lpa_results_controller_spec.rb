require 'spec_helper'
require 'policy_spec_helper'

describe DstLpaResultsController do
  render_views
  let(:user)           { User.make }
  let!(:institution)   { user.institutions.make }
  let(:patient)        { Patient.make institution: institution }
  let(:encounter)      { Encounter.make institution: institution , user: user, patient: patient }
  let(:requested_test) { RequestedTest.make encounter: encounter }
  let(:default_params) { { context: institution.uuid } }
  let(:valid_params)   { {
    sample_collected_on: 4.days.ago,
    media_used:          'solid',
    serial_number:       'LO-3434-P',
    results_h:           'resistant',
    results_r:           'susceptible',
    results_e:           'contaminated',
    results_s:           'not_done',
    results_amk:         'not_done',
    results_km:          'susceptible',
    results_cm:          'resistant',
    results_fq:          'contaminated',
    results_other1:      'other 1',
    results_other2:      'other 2',
    results_other3:      'other 3',
    results_other4:      'other 4',
    examined_by:         'Michael Kiske',
    result_on:           1.day.ago
  } }

  context 'user with test orders permission' do
    before(:each) do
      sign_in user
    end

    describe 'new' do
      it 'should render the new template' do
        get 'new', requested_test_id: requested_test.id

        expect(request).to render_template('new')
      end
    end

    describe 'create' do
      context 'with valid params' do
        before :each do
          post :create, requested_test_id: requested_test.id, dst_lpa_result: valid_params
          requested_test.reload
        end

        it 'should save the comment' do
          patient_result = requested_test.dst_lpa_result

          expect(patient_result.media_used).to eq('solid')
          expect(patient_result.uuid).not_to be_empty
          expect(patient_result.serial_number).to eq('LO-3434-P')
          expect(patient_result.results_h).to eq('resistant')
          expect(patient_result.results_r).to eq('susceptible')
          expect(patient_result.results_e).to eq('contaminated')
          expect(patient_result.results_s).to eq('not_done')
          expect(patient_result.results_amk).to eq('not_done')
          expect(patient_result.results_km).to eq('susceptible')
          expect(patient_result.results_cm).to eq('resistant')
          expect(patient_result.results_fq).to eq('contaminated')
          expect(patient_result.results_other1).to eq('other 1')
          expect(patient_result.results_other2).to eq('other 2')
          expect(patient_result.results_other3).to eq('other 3')
          expect(patient_result.results_other4).to eq('other 4')
          expect(patient_result.sample_collected_on.strftime("%m/%d/%YYYY")).to eq(4.days.ago.strftime("%m/%d/%YYYY"))
          expect(patient_result.result_on.strftime("%m/%d/%YYYY")).to eq(1.day.ago.strftime("%m/%d/%YYYY"))
        end

        it 'should redirect to the test order page' do
          expect(response).to redirect_to encounter_path(encounter)
        end

        it 'should update the test status to complete' do
          expect(requested_test.status).to eq('completed')
        end
      end

      context 'with invalid params' do
        it 'should render the new form' do
          invalid_params = valid_params.merge!(examined_by: nil)
          post :create, requested_test_id: requested_test.id, dst_lpa_result: invalid_params

          expect(request).to render_template('new')
        end
      end
     end

    describe 'show' do
      it 'should render the new template' do
        get 'show', requested_test_id: requested_test.id

        expect(request).to render_template('show')
      end
    end
  end
end
