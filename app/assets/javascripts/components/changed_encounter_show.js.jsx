var ChangedEncounterShow = React.createClass({
	getInitialState: function() {
		var user_email='';
		if (this.props.encounter["user"] != null) {
			user_email= this.props.encounter["user"].email
		};

    return {
      user_email: user_email
    };
  },
	EncounterDeleteHandler: function() {
	//	var urlParam = this.props.url;
		var	urlParam = this.props.encounter.id;
		EncounterActions.deleteEncounter(urlParam, '/test_results?display_as=test_order', this.submit_error);
	},
  render: function() {
		 if (this.props.can_update) {
		  cancelButton = <EncounterDelete edit={true} onChangeParentLevel={this.EncounterDeleteHandler} />;
		 } else {
		  cancelButton = "<div>/<div>"
		}
		
    return (
      <div>
        <div className="row">
          <div className="col pe-2">
          <label>Requested Site:</label> 
          </div>
          <div className="col">
            <p>{this.props.encounter.site.name}</p>
          </div>
        </div>

        <div className="row">
          <div className="col pe-2">
          <label>Performing Site:</label> 
          </div>
          <div className="col">
            <p>{this.props.encounter.site.name}</p>
          </div>
        </div>

				<div className="row">
          <div className="col pe-2">
            <label>Testing for:</label>
          </div>
          <div className="col">
            <p>{this.state.user_email}</p>
          </div>
        </div>

        <div className="row">
          <div className="col pe-2">
            <label>Comment:</label>
          </div>
          <div className="col">
            <p>{this.props.encounter.diag_comment}</p>
          </div>
        </div>

        <div className="row">
          <div className="col pe-2">
            <label>Weeks In Treatment:</label>
          </div>
          <div className="col">
            <p>{this.props.encounter.treatment_weeks}</p>
          </div>
        </div>

        <div className="row">
          <div className="col pe-2">
            <label>Samples ID:</label>
          </div>
          <div className="col">
               <SamplesList samples={this.props.encounter.samples}  />
          </div>
        </div>

       <div className="row">
          <div className="col pe-2">
            <label>Sample Type:</label>
          </div>
          <div className="col">
            <p>{this.props.encounter.coll_sample_type}</p>
          </div>
        </div>

        <div className="row">
          <div className="col pe-2">
            <label>Weeks In Treatment:</label>
          </div>
          <div className="col">
            <p>{this.props.encounter.treatment_weeks}</p>
          </div>
        </div>

        <div className="row">
          <div className="col pe-2">
            <label>Test Due Date:</label>
          </div>
          <div className="col">
            <p>{this.props.encounter.testdue_date}</p>
          </div>
        </div>

        <FlexFullRow>
          <PatientCard patient={this.props.encounter.patient} />
        </FlexFullRow>

        <div className="row">
        
  <RequestedTestsIndexTable encounter={this.props.encounter} requested_tests={this.props.requested_tests} />

        
        </div>

        <br />
				 <div className="row">
          <div className="col pe-2">
	{cancelButton}
	        </div>
        </div>

</div>
      );
    },

  });


	var EncounterDelete = React.createClass({
		getInitialState: function() {
			return {
				displayConfirm: false
			};
		},
		clickHandler: function() {
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
			if (this.state.displayConfirm==true) {
				return (
					<ConfirmationModalEncounter message= {'You are about to permanently cancel this test order. Are you sure you want to proceed?'} title= {'Cancel confirmation'} cancel_target= {this.cancelDeleteClickHandler} target= {this.confirmClickHandler} deletion= {true} hideCancel= {false} confirmMessage= {'Delete'} />
				);
			}
			else
			if(this.props.edit) {
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
			this.props.cancel_target();	
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

	  message: function() {
	    return {__html: this.props.message};
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
	      <Modal ref="confirmationModal" show="true">
	        <h1>{this.modalTitle()}</h1>
	        <div className="modal-content" dangerouslySetInnerHTML={this.message()}>
	        </div>
	        <div className="modal-footer button-actions">
	          <button type="button" className={this.confirmButtonClass()} onClick={this.onConfirm}>{this.confirmMessage()}</button>
	          { cancelButton }
	        </div>
	      </Modal>
	    );
	  }
	});
	