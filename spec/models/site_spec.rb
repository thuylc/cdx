require 'spec_helper'

describe Site do
  it "validates self institution match parent institution" do
    institution1 = Institution.make
    institution2 = Institution.make
    site1 = Site.make institution: institution1
    site2 = Site.make_unsaved institution: institution2, parent: site1
    expect(site2).to_not be_valid
  end

  it "computes prefix for self" do
    site = Site.make
    expect(site.prefix).to eq(site.uuid.to_s)
  end

  it "computes prefix for self with parent" do
    site1 = Site.make
    site2 = Site.make :child, parent: site1
    expect(site2.prefix).to eq("#{site1.uuid}.#{site2.uuid}")
  end

  it "computes prefix for self with parent and grandparent" do
    site1 = Site.make
    site2 = Site.make :child, parent: site1
    site3 = Site.make :child, parent: site2
    expect(site3.prefix).to eq("#{site1.uuid}.#{site2.uuid}.#{site3.uuid}")

    expect(site3.path).to eq([site1.uuid, site2.uuid, site3.uuid])
  end

  it "can't destroy a site with associated devices" do
    site1 = Site.make
    site1.devices.make

    expect(site1.devices).not_to be_empty
    expect {
      site1.destroy
    }.to raise_error(ActiveRecord::DeleteRestrictionError)
  end

  it "destroys sites logically" do
    site1 = Site.make
    expect(Site.count).to eq(1)

    expect {
      site1.destroy
    }.to change(Site, :count).by(-1)

    expect(Site.all).not_to include(site1)
    expect(Site.with_deleted).to include(site1)
    expect(site1).to be_deleted
  end
end
