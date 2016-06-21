require 'spec_helper'

describe Presenters::Comments do
  let(:patient) { Patient.make }

  describe 'patient_view' do
    before :each do
      27.times { Comment.make patient: patient }
    end

    it 'should return an array of formated comments' do
      expect(Presenters::Comments.patient_view(patient.comments).size).to eq(27)
    end

    it 'should return elements formated' do
      expect(Presenters::Comments.patient_view(patient.comments).first).to eq({
        id:           patient.comments.first.uuid,
        comment_date: patient.comments.first.commented_on.strftime(I18n.t('date.input_format.pattern')),
        commenter:    patient.comments.first.user.full_name,
        title:        patient.comments.first.description,
        view_link:    Rails.application.routes.url_helpers.patient_comment_path(patient, patient.comments.first)
      })
    end
  end
end
