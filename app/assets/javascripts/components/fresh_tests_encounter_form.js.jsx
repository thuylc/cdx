var FreshTestsEncounterForm = React.createClass(_.merge({
  componentDidMount: function() {
    $('#sample_other').hide();
    $('.test_for_ebola').attr('checked', false).parent().hide();
    $('.test_for_tb').attr('checked', false).parent().hide();
    $('.test_for_hiv').attr('checked', false).parent().hide();
    $('.cformatIndented').hide();
  },

  reasonClicked: function(clk) {
    var reason = '';

    if (clk === 0) { reason = 'diag'; }

    if (clk === 1) { reason = 'follow'; }

    this.setState(React.addons.update(this.state, {
      encounter: {
        exam_reason: {
          $set: reason
        }
      }
    }));
  },

  validateAndSetManualEntry: function (event) {
    var sampleId    = React.findDOMNode(this.refs.manualSampleEntry).value;
    var labSampleId = React.findDOMNode(this.refs.manualLabSampleEntry).value;
    if (this.state.encounter.new_samples.filter(function(el){ return el.entity_id == sampleId }).length > 0) {
      // Error handling as done in the ajax responses
      alert(I18n.t("components.fresh_tests_encounter_form.alert_new_sample"));
    } else {
      this._ajax_put('/encounters/add/manual_sample_entry', function() {
        this.refs.addNewSamplesModal.hide();
      }, {entity_id: sampleId, lab_sample_id: labSampleId});
    }
    event.preventDefault();
  },

  validateThenSave: function(event)
  {
    event.preventDefault();
    if( this.state.encounter.testing_for == undefined )  {   alert(I18n.t("components.fresh_tests_encounter_form.alert_testing_for"));    return;  }
    if( this.state.encounter.exam_reason == undefined )  {   alert(I18n.t("components.fresh_tests_encounter_form.alert_exam_reason"));    return;  }
    if( this.state.encounter.tests_requested == '')  {   alert(I18n.t("components.fresh_tests_encounter_form.alert_tests_requested"));    return;  }
    this.save();
  },

  render: function() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    var show_auto_sample = '';
    var show_manual_sample = '';
    var cancelUrl = "javascript:history.back();";

    if (this.props.referer != null) {
      cancelUrl = this.props.referer;
    }

    if (this.props.allows_manual_entry == true) {
      show_auto_sample = "hidden";
      show_manual_sample = "";
    } else {
      show_auto_sample = "";
      show_manual_sample = "hidden";
    }

    return (
      <div className="newTestOrder">
        <div className="row labelHeader">
          <div className="col-6">
            <h3>{I18n.t("components.fresh_tests_encounter_form.test_order_details_heading")}</h3>
          </div>
          <div className="col-6">
          </div>
        </div>
        <div className="panel">
          <div className="row">
            <div className="col-6">
              <label>{I18n.t("components.fresh_tests_encounter_form.testing_for_label")}</label>
            </div>
            <div className="col-6">
              <label>
                <select className="input-large" id="testing_for" name="testing_for" onChange={this.testingForChange} datavalue={this.state.encounter.testing_for}>
                  <option value="">{I18n.t("components.fresh_tests_encounter_form.please_select_option")}</option>
                  <option value="TB">{I18n.t("components.fresh_tests_encounter_form.TB_option")}</option>
                  <option value="HIV">{I18n.t("components.fresh_tests_encounter_form.HIV_option")}</option>
                  <option value="Ebola">{I18n.t("components.fresh_tests_encounter_form.Ebola_option")}</option>
                </select>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-6 flexStart">
              <label>{I18n.t("components.fresh_tests_encounter_form.reason_for_examination_label")}</label>
            </div>
            <div className="col-6 flexStart">
              <input type="radio" onChange={this.reasonClicked.bind(this, 0)} checked={this.state.encounter.exam_reason == 'diag'} name="exam_reason" id="exam_reason_diag" value="diag"/>
              <label htmlFor="exam_reason_diag">{I18n.t("components.fresh_tests_encounter_form.diagnosis_lable")}</label>
              <input type="radio" onChange={this.reasonClicked.bind(this, 1)} checked={this.state.encounter.exam_reason == 'follow'} name="exam_reason" id="exam_reason_follow" value="follow"/>
              <label htmlFor="exam_reason_follow">{I18n.t("components.fresh_tests_encounter_form.follow_up_lable")}</label>
            </div>
          </div>

          { this.state.encounter.exam_reason === 'follow' ? <ReasonFollow treatmentDateChange={this.treatmentDateChange} /> : null }
          { this.state.encounter.exam_reason === 'diag' ? <PresumptiveRR /> : null }

          <div className="row">
            <div className="col-6 flexStart">
              <label>{I18n.t("components.fresh_tests_encounter_form.samples_lable")}</label>
            </div>
            <div className="col-6">
              <SamplesList samples={this.state.encounter.samples}  />
              <NewSamplesList samples={this.state.encounter.new_samples} onRemoveSample={this.removeNewSample}/>
              <p className={show_auto_sample}>
                <a className="btn-add-link" href='#' onClick={this.addNewSamples}>
                  <span className="icon-circle-plus icon-blue"></span>
                  {I18n.t("components.fresh_tests_encounter_form.add_sample")}
                </a>
              </p>
              <p className={show_manual_sample}>
                <input type="text" size="54" placeholder={I18n.t("components.fresh_tests_encounter_form.sample_id_placeholder")} ref="manualSampleEntry" />&nbsp;
                <button type="button" className="btn-primary" onClick={this.validateAndSetManualEntry}>{I18n.t("components.fresh_tests_encounter_form.add_btn")}</button>
              </p>
            </div>
          </div>

          <RequestedTests reqtestsChange={this.reqtestsChange} />

          <div className="row">
            <div className="col-6">
              <label>{I18n.t("components.fresh_tests_encounter_form.collection_sample_type_label")}</label>
            </div>
            <div className="col-6">
              <label>
                <select className="input-large" id="coll_sample_type" name="coll_sample_type" onChange={this.sample_type_change} datavalue={this.state.encounter.coll_sample_type}>
                  <option value="">{I18n.t("components.fresh_tests_encounter_form.please_select_option")}</option>
                  <option value="sputum">{I18n.t("components.fresh_tests_encounter_form.sputum_option")}</option>
                  <option value="blood">{I18n.t("components.fresh_tests_encounter_form.blood_option")}</option>
                  <option value="other">{I18n.t("components.fresh_tests_encounter_form.other_option")}</option>
                </select>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              &nbsp;
            </div>
            <div className="col-6">
              <textarea name="sample_other" id="sample_other" onChange={this.sample_other_change}></textarea>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <label>{I18n.t("components.fresh_tests_encounter_form.test_due_date_label")}</label>
            </div>
            <div className="col-6">
              <input type="date" id="testdue_date" min={today} onChange={this.testDueDateChange} value={this.state.encounter.testdue_date}/>
            </div>
          </div>

          { this.state.encounter.exam_reason === 'diag' ? <ReasonDiag diagCommentChange={this.diagCommentChange} /> : null }

          <div className="row labelfooter">
            <div className="col-12">
              <ul>
                <li>
                  <a href="#" id="encountersave" className="button save" onClick={this.validateThenSave}>{I18n.t("components.fresh_tests_encounter_form.save_btn")}</a>
                </li>
                <li>
                  <a href={cancelUrl} className="button cancel">{I18n.t("components.fresh_tests_encounter_form.cancel_btn")}</a>
                </li>
              </ul>
            </div>
          </div>

          <Modal ref="addNewSamplesModal">
            <h1>
              <a href="#" className="modal-back" onClick={this.closeAddNewSamplesModal}></a>
              Add sample
            </h1>

            <p><input type="text" className="input-block" placeholder="Sample ID" ref="manualSampleEntry"/></p>
            <p><button type="button" className="btn-primary pull-right" onClick={this.validateAndSetManualEntry}>OK</button></p>
          </Modal>
        </div>
      </div>
    );
  },

  getInitialState: function() {
    $('#sample_other').hide();
  },

  checkme: function(what) {
    if (this.state.encounter.tests_requested.indexOf(what) != false)
      return 'selected ';
    return '';
  },

  reqtestsChange: function(requestedTests) {
    this.setState(React.addons.update(this.state, {
      encounter: {
        tests_requested: {
          $set: requestedTests
        }
      }
    }));
  },


  diagCommentChange: function() {
    var comment = $('#diag_comment').val();
    this.setState(React.addons.update(this.state, {
      encounter: {
        diag_comment: {
          $set: comment
        }
      }
    }));
  },

  treatmentDateChange: function() {
    var treatmentdate = $('#treatment_weeks').val();
    this.setState(React.addons.update(this.state, {
      encounter: {
        treatment_weeks: {
          $set: treatmentdate
        }
      }
    }));
  },

  cultureFormatChange: function() {
    var cultureFormat = $('#cultureFormat').val();
    this.setState(React.addons.update(this.state, {
      encounter: {
        culture_format: {
          $set: cultureFormat
        }
      }
    }));
  },

  testDueDateChange: function() {
    var testduedate = $('#testdue_date').val();
    this.setState(React.addons.update(this.state, {
      encounter: {
        testdue_date: {
          $set: testduedate
        }
      }
    }));
    this.state.encounter.testdue_date = testduedate;
  },

  testingForChange: function() {
    var xx = $('#testing_for').val();
    this.setState(React.addons.update(this.state, {
      encounter: {
        testing_for: {
          $set: xx
        }
      }
    }));

    $('.test_for_ebola').attr('checked', false).parent().hide();
    $('.test_for_tb').attr('checked', false).parent().hide();
    $('.test_for_hiv').attr('checked', false).parent().hide();
    switch(xx)
    {
      case 'TB':
        $('.test_for_tb').parent().show();
        break;
      case 'Ebola':
        $('.test_for_ebola').parent().show();
        break;
      case 'HIV':
        $('.test_for_hiv').parent().show();
        break;

      default:
        $('.test_for_tb').parent().show();
        $('.test_for_ebola').parent().show();
        $('.test_for_hiv').parent().show();
    }
  },

  sample_type_change: function() {
    var xx = $('#coll_sample_type').val();
    if (xx == 'other')
      $('#sample_other').show();
    else
      $('#sample_other').hide();
    this.setState(React.addons.update(this.state, {
      encounter: {
        coll_sample_type: {
          $set: xx
        }
      }
    }));
  },

  sample_other_change: function() {
    var xx = $('#sample_other').val();
    this.setState(React.addons.update(this.state, {
      encounter: {
        coll_sample_other: {
          $set: xx
        }
      }
    }));
  }

}, BaseEncounterForm));

var ReasonDiag = React.createClass({
  updateComment: function (e) {
    this.props.diagCommentChange();
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-6">
          <label>Comment</label>
        </div>
        <div className="col-6">
          <textarea name="diag_comment" id="diag_comment" rows="5" cols="60" onChange={this.updateComment}></textarea>
        </div>
      </div>
    );
  }
});

var PresumptiveRR = React.createClass({
  updatePresumptiveRR: function(e){
    alert('its changed');
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-6">
        </div>
        <div className="col-6">
          <input type="checkbox" onChnage={this.updatePresumptiveRR} className="presumptive_rr" id="presumptive_rr" name="presumptive_rr"/>
          <label htmlFor="presumptive_rr">Presumptive RR-TB/MDR-TB</label>
        </div>
      </div>
    )
  }
});

var ReasonFollow = React.createClass({
  updateWeeks: function (e) {
    this.props.treatmentDateChange();
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-6">
          <label>{I18n.t("components.fresh_tests_encounter_form.weeks_in_treatment_label")}</label>
        </div>
        <div className="col-6">
          <input type="number" min="0" max="52" onChange={this.updateWeeks} id="treatment_weeks" name="treatment_weeks"/>
        </div>
      </div>
    );
  }
});
