class EncounterFormPage < CdxPageBase
  class EncounterDiagnosis < SitePrism::Section
    class AssayEditor < SitePrism::Section
      section :result, CdxSelect, ".Select"
      element :quant, ".quantitative"
    end

    sections :assays, AssayEditor, ".row:first-child"
  end

  section :diagnosis, EncounterDiagnosis, ".assays-editor"
  element :append_sample, :link, "Append sample"
  element :add_tests, :link, "Add tests"

  def open_append_sample
    append_sample.click
    modal = ItemSearchPage.new
    yield modal if block_given?
    modal
  end

  def open_add_tests
    add_tests.click
    modal = ItemSearchPage.new
    yield modal if block_given?
    modal
  end
end

class NewFreshEncounterPage < CdxPageBase
  set_url "/encounters/new?mode=fresh_tests"
  set_url_matcher /\/encounters\/new?.*mode=fresh_tests/

  section :site, CdxSelect, "label", text: "SITE"
  section :requested_site, CdxSelect, "label", text: /Requested/i   
  section :performing_site, CdxSelect, "label", text: "PERFORMING SITE"
  section :patient, CdxSelect, "label", text: /Patient/i
  element :new_patient, "a[title='Create new patient']" 
  element :testing_for,     "select[id='testing_for']"

  element :add_sample, :link, "Add sample"
  element :add_existing_sample, :link, "Append sample"
end

class NewEncounterPage < EncounterFormPage
  set_url "/encounters/new?mode=existing_tests"

  section :site, CdxSelect, "label", text: "SITE"
  section :performing_site, CdxSelect, "label", text: "PERFORMING SITE"
end

class EditEncounterPage < EncounterFormPage
  set_url "/encounters/{id}/edit"
end
