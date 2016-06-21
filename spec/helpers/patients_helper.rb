require 'spec_helper'

RSpec.describe PatientsHelper, type: :helper do
  describe "patient_birth_date" do
    before :each do
      Timecop.freeze(Time.local(2016, 6, 17, 12, 0, 0))
    end

    context 'if person is more than 1 year old' do
      it 'should return the date and the number of years' do
        expect(helper.patient_birth_date('1972-03-26T00:00:00.000+01:00')).to eq('03/26/1972 - 44y/o.')
      end
    end

    context 'if person is less than 1 year old' do
      it 'should return the date and the number of months' do
        expect(helper.patient_birth_date('2015-11-26T00:00:00.000+01:00')).to eq('11/26/2015 - 7m/o.')
      end
    end

    after :each do
      Timecop.return
    end
  end
end
