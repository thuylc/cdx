var EncounterShow = React.createClass({
  getInitialState: function() {
    var user_email='';
    if (this.props.encounter["user"] != null) {
      user_email= this.props.encounter["user"].email
    };

    var disable_all_selects=false;
    if (this.props.showCancel==true || this.props.showEdit==false) {
      disable_all_selects=true;
    }

    return {
      user_email: user_email,
      error_messages:[],
      requestedTests: this.props.requestedTests,
      disable_all_selects: disable_all_selects
    };
  },

  submitError: function(errorArray) {
    this.setState({
      error_messages: errorArray
    });
    $('body').scrollTop(0);
  },

  EncounterDeleteHandler: function() {
    if (this.props.referer != null) {
      successUrl = this.props.referer;
    } else {
      successUrl = '/test_orders';
    }

    var  urlParam = this.props.encounter.id
    EncounterActions.deleteEncounter(urlParam, successUrl, this.submitError);
  },

  EncounterUpdateHandler: function() {
    if (this.props.referer != null) {
     successUrl = this.props.referer;
    } else {
     successUrl = '/test_orders';
    }

    if (this.props.requestedTests.length>0) {
      var urlParam   = '/requested_tests';
      urlParam       = urlParam + '/' + this.props.encounter.id;
      requestedTests = this.props.requestedTests;
      EncounterRequestTestActions.update(urlParam, requestedTests, successUrl, this.submitError);
    } else {
      window.location.href = successUrl;
    }
  },

  onTestChanged: function(newTest) {
    var len = this.state.requestedTests.length;
    for (var i = 0; i<len; i++) {
      if (this.state.requestedTests[i].id == newTest.id) {
        tempRequestedTests    = this.state.requestedTests;
        tempRequestedTests[i] = newTest;
        this.setState({
          requestedTests: tempRequestedTests
        });
      }
    }
  },

  render: function() {
    if (this.props.can_update && this.props.showCancel) {
      actionButton = <EncounterDelete showEdit={true} onChangeParentLevel={this.EncounterDeleteHandler} encounter={this.props.encounter} />;
    } else if (this.props.can_update && this.props.showEdit) {
      actionButton = <EncounterUpdate onChangeParentLevel={this.EncounterUpdateHandler} />;
    } else {
      actionButton = <ShowNoButton />;
    }

    if (this.props.encounter.performing_site == null) {
      performing_site = "";
    } else {
      performing_site = this.props.encounter.performing_site.name;
    }
    return (
      <div className="testflow">
        <div className="row errorMsg">
         <div className="col pe-2">
           <FlashErrorMessages messages={this.state.error_messages} />
         </div>
        </div>
        <div className="row labelHeader">
          <div className="col-6">
            <h3>Site Details</h3>
          </div>
          <div className="col-6">
          </div>
        </div>
        <div className="newTestOrder">
          <div className="panel">
            <DisplayFieldWithLabel fieldLabel='Requesting site:' fieldValue={ this.props.encounter.site.name } />
            <DisplayFieldWithLabel fieldLabel='Performing site:' fieldValue={ performing_site } />
          </div>
        </div>
        <div className="row labelHeader">
          <div className="col-6">
            <h3>Test Details</h3>
          </div>
          <div className="col-6">
          </div>
        </div>
        <div className="newTestOrder">
          <div className="panel">
            <div className="row collapse">
              <div className="col-6">
                <DisplayFieldWithLabel fieldLabel='Requesting site:'  fieldValue={ this.props.encounter.site.name } />
                <DisplayFieldWithLabel fieldLabel='Performing site:' fieldValue={ performing_site } />
                <DisplayFieldWithLabel fieldLabel='Order Id:'    fieldValue={ this.props.encounter.uuid } />
                <DisplayFieldWithLabel fieldLabel='Testing for:' fieldValue={ this.props.encounter.testing_for } />
                {
                  this.props.encounter.testing_for === 'TB' ?
                  <DisplayFieldWithLabel fieldLabel='Culture format:' fieldValue={ this.props.encounter.culture_format } /> : null
                }
                <DisplayFieldWithLabel fieldLabel='Comment:' fieldValue={ this.props.encounter.diag_comment } />
                {
                  this.props.encounter.exam_reason === 'follow' ?
                  <DisplayFieldWithLabel fieldLabel='Weeks in treatment:' fieldValue={ this.props.encounter.treatment_weeks } /> : null
                }
                {
                  this.props.showEdit ?
                  <DisplayFieldWithLabel fieldLabel='Samples Id:'    fieldValue={ <LabSamplesList context={this.props.context} samples={this.props.encounter.samples}  /> } /> : null
                }

                <DisplayFieldWithLabel fieldLabel='Sample type:'   fieldValue={ this.props.encounter.coll_sample_type } />
                <DisplayFieldWithLabel fieldLabel='Test due date:' fieldValue={ this.props.encounter.testdue_date } />
                <DisplayFieldWithLabel fieldLabel='Status:'        fieldValue={ this.props.encounter.status } />
              </div>

              <div className="col-6 patientCard">
                <FlexFullRow>
                  <PatientCard patient={this.props.encounter.patient} />
                </FlexFullRow>
              </div>
            </div>

          </div>
        </div>

        <div className="row">
          <RequestedTestsIndexTable encounter={this.props.encounter} requestedTests={this.state.requestedTests} requestedBy={this.props.requested_by}
            statusTypes={this.props.statusTypes} edit={this.props.showEdit} onTestChanged={this.onTestChanged} associatedTestsToResults={this.props.associatedTestsToResults}
            showDstWarning={this.props.showDstWarning} />
        </div>
        <br />
        <div className="row buttonActions">
          <div className="col">
            {actionButton}
          </div>
        </div>
      </div>
      );
    },
  });


var EncounterUpdate = React.createClass({
  clickHandler: function() {
    this.props.onChangeParentLevel();
   },
  render: function() {
    return(
      <div><a className="btn-secondary" onClick={this.clickHandler} id="update_encounter" href="#">Update Test Order</a></div>
    );
  }
});

var ShowNoButton = React.createClass({
  render: function() {
    return(
      <div></div>
     );
    }
});

var EncounterDelete = React.createClass({
  getInitialState: function() {
    return {
      displayConfirm: false
    };
  },

  clickHandler: function(e) {
    e.preventDefault()
    this.setState({
      displayConfirm: true
    });
  },

  cancelDeleteClickHandler: function() {
    this.setState({
      displayConfirm: false
    });
  },

  confirmClickHandler: function() {
    this.props.onChangeParentLevel();
  },

  render: function() {
    if (this.state.displayConfirm == true) {
      return (
        <ConfirmationModalEncounter message= {'You are about to permanently cancel this test order. Are you sure you want to proceed?'} title= {'Cancel confirmation'} cancelTarget= {this.cancelDeleteClickHandler} target={this.confirmClickHandler} hideOuterEvent={this.cancelDeleteClickHandler} deletion= {true} hideCancel= {false} confirmMessage= {'Delete'} />
      );
    }
    else if (this.props.showEdit && (this.props.encounter.status != 'inprogress')) {
      return (
        <div>
          <a className = "btn-secondary pull-right" onClick={this.clickHandler} id="delete_encounter" href="#">Cancel Test Order</a>
        </div>
      );
    } else {
      return null;
    }
  }
});

var ConfirmationModalEncounter = React.createClass({
  modalTitle: function() {
    return this.props.title || (this.props.deletion ? "Cancel confirmation" : "Confirmation");
  },

  cancelMessage: function() {
   return this.props.cancelMessage || "Cancel";
  },

  confirmMessage: function() {
    return this.props.confirmMessage || (this.props.deletion ? "Cancel" : "Confirm");
  },

  componentDidMount: function() {
    this.refs.confirmationModal.show();
  },

  onCancel: function() {
    this.refs.confirmationModal.hide();
    if (this.props.target instanceof Function ) {
     this.props.cancelTarget();
    }
  },

  onConfirm: function() {
    if (this.props.target instanceof Function ) {
     this.props.target();
    } else {
    window[this.props.target]();
    }
    this.refs.confirmationModal.hide();
  },

  hideOuterEvent: function() {
    this.props.hideOuterEvent();
  },

  confirmButtonClass: function() {
    return this.props.deletion ? "btn-primary btn-danger" : "btn-primary";
  },

  showCancelButton: function() {
    return this.props.hideCancel != true;
  },

  render: function() {
    var cancelButton = null;
    if (this.showCancelButton()) {
      cancelButton = <button type="button" className="btn-link" onClick={this.onCancel}>{this.cancelMessage()}</button>
    }

    return (
      <Modal ref="confirmationModal" show="true" hideOuterEvent={this.hideOuterEvent}>
        <h1>{this.modalTitle()}</h1>
        <div className="modal-content">
          {this.props.message}
        </div>

        <div className="modal-footer button-actions">
          <button type="button" className={this.confirmButtonClass()} onClick={this.onConfirm}>{this.confirmMessage()}</button>
          { cancelButton }
        </div>
      </Modal>
    );
  }
 });
