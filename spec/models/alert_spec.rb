require 'spec_helper'

RSpec.describe Alert, :type => :model, elasticsearch: true do
  let!(:user) { User.make }
  let(:model){DeviceModel.make}
  let(:device){Device.make device_model: model}
  let(:device_message){DeviceMessage.make(device: device)}
  let(:institution){device.institution}
  let(:site){device.site}

  context "validates fields" do
    it "cannot create for missing fields" do
      alert = Alert.create
      expect(alert).to_not be_valid
    end

    it "can create alert" do
      alert = Alert.make
      expect(alert).to be_valid
    end

    it "cannot create for missing fields with utilisation category" do
      alert = Alert.make
      alert.category_type = "utilization_efficiency"
      expect(alert).to_not be_valid
    end

    it "cannot create for invalid error_code with device_errors category" do
      alert = Alert.make
      alert.category_type = "device_errors"
      alert.error_code="aa"
      expect(alert).to_not be_valid
    end
    
    it "cannot create for aggregation threshold greater than 100%" do
      alert = Alert.make
      alert.category_type = "device_errors"
      alert.error_code="11"
      alert.use_aggregation_percentage = true
      alert.aggregation_threshold = 101
      expect(alert).to_not be_valid
    end    
      
  end

  context "validate soft delete" do
    it "soft deletes an alert" do
      alert = Alert.make
      alert.destroy
      deleted_alert_id = Alert.where(id: alert.id).pluck(:id)
      expect(deleted_alert_id).to eq([])
    end

    it "soft deletes an alert and alert still exists" do
      alert = Alert.make
      alert.destroy
      deleted_alert_id = Alert.with_deleted.where(id: alert.id).pluck(:id)
      expect(deleted_alert_id).to eq([alert.id])
    end
  end

  context "validate perculator" do
    it "creates a perculator" do
      alert = Alert.make
      alert.query = {"test.error_code"=>"155"}
      alert.user = institution.user
      result = Cdx::Api.client.search index: Cdx::Api.index_name_pattern, type: '.percolator'
      alert.create_percolator

      percolator = Cdx::Api.client.get index: Cdx::Api.index_name_pattern, type: '.percolator', id: 'alert_'+alert.id.to_s
      expect(percolator["_id"]).to eq('alert_'+alert.id.to_s)

      #     Note: I had these lines below but for soem reason the test woudl only pass when i had a binding.pry inserted here
      #      result = Cdx::Api.client.search index: Cdx::Api.index_name_pattern, type: '.percolator'
      #      expect(result["hits"]["total"]).to eq(before_count+1)
    end
  end


  it "updates percolator when the alert query changes" do
    alert = Alert.make
    alert.query = {"test.error_code"=>"155"}
    alert.user = institution.user

    alert.update_attributes! query: {"test.assays.condition" => "mtb"}
    percolator = Cdx::Api.client.get index: Cdx::Api.index_name_pattern, type: '.percolator', id: "alert_"+alert.id.to_s
    expect(percolator["_source"]).to eq({query: TestResult.query(alert.query, alert.user).elasticsearch_query, type: 'test'}.with_indifferent_access)
  end


  it "deletes percolator when the alert is deleted" do
    alert = Alert.make
    alert.query = {"test.error_code"=>"155"}
    alert.user = institution.user

    alert.create_percolator
    result = Cdx::Api.client.search index: Cdx::Api.index_name_pattern, type: '.percolator'

    alert.destroy
    refresh_index
    result = Cdx::Api.client.search index: Cdx::Api.index_name_pattern, type: '.percolator'
    expect(result["hits"]["total"]).to eq(0)
  end


  it "deletes percolator when the alert is disabled" do
    alert = Alert.make
    alert.query = {"test.error_code"=>"155"}
    alert.user = institution.user

    alert.create_percolator
    result = Cdx::Api.client.search index: Cdx::Api.index_name_pattern, type: '.percolator'

    alert.enabled=false
    alert.delete_percolator

    alert.save
    refresh_index
    result = Cdx::Api.client.search index: Cdx::Api.index_name_pattern, type: '.percolator'
    expect(result["hits"]["total"]).to eq(0)
  end
  
  
  it "does not create a percolator for invalid_test_date anomalie" do 
    alert = Alert.make(:category_type =>"anomalies", :anomalie_type => "invalid_test_date")
    alert.query = {"test.error_code"=>"155"}
    alert.user = institution.user
    alert.save!

    begin
      percolator = Cdx::Api.client.get index: Cdx::Api.index_name_pattern, type: '.percolator', id: "alert_"+alert.id.to_s
    rescue
    end
    expect(percolator).to eq nil
  end
  
  it "does not give an error when you delete a percolator for invalid_test_date anomalie" do
    alert = Alert.make(:category_type =>"anomalies", :anomalie_type => "invalid_test_date")
    alert.query = {"test.error_code"=>"155"}
    alert.user = institution.user

    alert.save!

    alert.enabled=false
    alert.delete_percolator

    alert.save
    refresh_index
    result = Cdx::Api.client.search index: Cdx::Api.index_name_pattern, type: '.percolator'
    expect(result["hits"]["total"]).to eq(0)
  end
  
  context "security" do
    let!(:institution) {Institution.make}
    let!(:user) {institution.user}
    let!(:site) {institution.sites.make}
    let!(:other_institution) {Institution.make}
    let!(:other_user) {other_institution.user}
    let!(:other_site) {other_institution.sites.make}
    let!(:sub_site) { Site.make :child, parent: site }

    let!(:alert_site) { Alert.make user: user, institution: institution, site: site}
    let!(:alert_other_institution_other_user_other_site) { Alert.make user: other_user, institution: other_institution, site: other_site}
    let!(:alert_same_institution_no_site) { Alert.make site: nil, institution: site.institution }
    let!(:alert_sub_site) { Alert.make user: user, institution: institution, site: sub_site}
    let!(:alert_other_institution_same_user_other_site) { Alert.make user: user, institution: other_institution, site: other_site}

    it "institution, no exclusion, should show alerts from site, subsites and no site" do
      expect(Alert.within(site.institution).to_a).to eq([alert_site, alert_same_institution_no_site, alert_sub_site])
    end

    it "institution, with exclusion, should show alerts with no site" do
      expect(Alert.within(site.institution,true).to_a).to eq([alert_same_institution_no_site])
    end

    it "site, no exclusion, should show alerts from site and subsite" do
      expect(Alert.within(site).to_a).to eq([alert_site, alert_sub_site])
    end

    it "site, with exclusion, should show alerts from site only" do
      expect(Alert.within(site,true).to_a).to eq([alert_site])
    end

    it "institution should not show alerts from other institutions" do
      expect(Alert.within(other_site.institution).to_a).to eq([alert_other_institution_other_user_other_site,alert_other_institution_same_user_other_site])
    end
  end

end
