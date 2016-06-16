var ChangedBaseEncounterForm = {
  getInitialState: function() {
    return {
      encounter: this.props.encounter
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({encounter: nextProps.encounter});
  },

  save: function() {
    var callback = function() {
      window.location.href = '/encounters/' + this.state.encounter.id;
    };

    if (this.state.encounter.id) {
      this._ajax('PUT', '/encounters/' + this.state.encounter.id, callback);
    } else {
      this._ajax('POST', '/encounters', callback);
    }
  },

  addNewSamples: function(event) {
    this._ajax_put('/encounters/add/new_sample');
    event.preventDefault();
  },

  removeNewSample: function(sample) {
    var filtered = _.filter(this.state.encounter.new_samples, function(s) { return s.entity_id != sample.entity_id });

    this.setState(React.addons.update(this.state, {
      encounter : { new_samples: { $set : filtered }},
    }));
  },

  _ajax_put: function(url, success, extra_data) {
    this._ajax('PUT', url, success, extra_data);
  },

  _ajax: function(method, url, success, extra_data) {
    var _this = this;
    $.ajax({
      url: url,
      method: method,
      data: _.extend({ encounter: JSON.stringify(this.state.encounter), context: this.props.context.full_context }, extra_data),
      success: function (data) {
        if (data.status == 'error') {
          alert(data.message); //TODO show errors nicely
        } else {
          _this.setState(React.addons.update(_this.state, {
            encounter: { $set: data.encounter }
          }), function(){
            if (data.status == 'ok' && success) {
              success.call(_this, data);
            }
          });
        }
      }
    });
  },
}

var ChangedEncounterForm = React.createClass(_.merge({
  getDefaultProps: function() {
    return {
      assayResultOptions: _.map(['positive', 'negative', 'indeterminate'], function(v){return {value: v, label: _.capitalize(v)};})
    }
  },

  showAddSamplesModal: function(event) {
    this.refs.addSamplesModal.show()
    event.preventDefault()
  },

  closeAddSamplesModal: function (event) {
    this.refs.addSamplesModal.hide();
    event.preventDefault();
  },

  showUnifySamplesModal: function(sample) {
    this.setState(React.addons.update(this.state, {
      unifyingSample: { $set: sample }
    }));

    this.refs.unifySamplesModal.show()
    event.preventDefault()
  },

  closeUnifySamplesModal: function (event) {
    this.refs.unifySamplesModal.hide();
    event.preventDefault();
  },

  unifySample: function(sample) {
    this.refs.unifySamplesModal.hide();
    this._ajax_put("/encounters/merge/sample/", null, { sample_uuids: [this.state.unifyingSample.uuid, sample.uuid] });
  },

  appendSample: function(sample) {
    this.refs.addSamplesModal.hide()
    this._ajax_put("/encounters/add/sample/" + sample.uuid);
  },

  showTestsModal: function(event) {
    this.refs.testsModal.show()
    event.preventDefault()
  },

  closeTestsModal: function(event) {
    this.refs.testsModal.hide()
    event.preventDefault()
  },

  appendTest: function(test) {
    this.refs.testsModal.hide()
    this._ajax_put("/encounters/add/test/" + test.uuid);
  },

  encounterChanged: function(field){
    return function(event) {
      var newValue = event.target.value;
      this.setState(React.addons.update(this.state, {
        encounter : { [field] : { $set : newValue } }
      }));
    }.bind(this);
  },

  encounterAssayChanged: function(index, field){
    return function(event) {
      var newValue;

      if (field == 'result') {
        newValue = event;
      } else if (field == 'quantitative_result') {
        newValue = event.target.value
        firstChar = newValue[0]
        newValue = newValue.replace(/[^0-9]/g, '');
        if (firstChar == '+' || firstChar == '-') {
          newValue = firstChar + newValue;
        }
      } else {
        newValue = event.target.value;
      }

      this.setState(React.addons.update(this.state, {
        encounter : { assays : { [index] : { [field] : { $set : newValue } } } }
      }));
    }.bind(this);
  },

  render: function() {
    var diagnosisEditor = null;

    if (this.state.encounter.assays.length > 0) {
      diagnosisEditor = (
        <div className="row">
          <div className="col pe-2">
            <label>Diagnosis</label>
            <p style={{fontSize: "12px"}}><i>Each time a new test arrives, the list of conditions will be updated for you to diagnostic</i></p>
          </div>

          <div className="col assays-editor">
            {this.state.encounter.assays.map(function(assay, index){
              return (
                <div className="row" key={index}>
                  <div className="col px-4">
                    <div className="underline">
                      <span>{assay.condition.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="col px-2">
                    <Select value={assay.result} options={this.props.assayResultOptions} onChange={this.encounterAssayChanged(index, 'result')} clearable={false} className="input-block"/>
                  </div>
                  <div className="col px-2">
                    <input type="text" className="quantitative pull-right" value={assay.quantitative_result} placeholder="Quant." onChange={this.encounterAssayChanged(index, 'quantitative_result')} />
                  </div>
                </div>
              );
            }.bind(this))}
            <div className="row">
              <div className="col px-6">
                <textarea className="observations input-block" value={this.state.encounter.observations} placeholder="Observations" onChange={this.encounterChanged('observations')} />
              </div>
            </div>
          </div>
        </div>);
    } else {
      diagnosisEditor = null;
    }

    return (
      <div>
        {(function(){
          if (this.state.encounter.id == null) return;

          return (
          <div className="row">
            <div className="col pe-2">
              <label>Site</label>
            </div>
            <div className="col">
              <p>{this.props.encounter.site.name}</p>
            </div>
          </div>);
        }.bind(this))()}

        <FlexFullRow>
          <PatientCard patient={this.state.encounter.patient} />
        </FlexFullRow>

        {diagnosisEditor}

        <div className="row">
          <div className="col pe-2">
            <label>Samples</label>
          </div>
          <div className="col">
            <SamplesList samples={this.state.encounter.samples} onUnifySample={this.showUnifySamplesModal} />
            <NewSamplesList samples={this.state.encounter.new_samples} onRemoveSample={this.removeNewSample} />

            <p>
              <a className="btn-add-link" href='#' onClick={this.addNewSamples}><span className="icon-circle-plus icon-blue"></span> Append new sample</a>
            </p>
            <p>
              <a className="btn-add-link" href='#' onClick={this.showAddSamplesModal}><span className="icon-circle-plus icon-blue"></span> Append sample</a>
            </p>
          </div>

          <Modal ref="addSamplesModal">
            <h1>
              <a href="#" className="modal-back" onClick={this.closeAddSamplesModal}></a>
              Add sample
            </h1>

            <AddItemSearch callback={"/encounters/search_sample?institution_uuid=" + this.state.encounter.institution.uuid} onItemChosen={this.appendSample}
              placeholder="Search by sample id"
              itemTemplate={AddItemSearchSampleTemplate}
              itemKey="uuid" />
          </Modal>

          <Modal ref="unifySamplesModal">
            <h1>
              <a href="#" className="modal-back" onClick={this.closeUnifySamplesModal}></a>
              Unify sample
            </h1>
            <p>Unifying sample {this.state.unifyingSample ? this.state.unifyingSample.entity_ids[0] : ""}</p>

            <AddItemSearch callback={"/encounters/search_sample?institution_uuid=" + this.state.encounter.institution.uuid + "&sample_uuids=" + _.pluck(this.state.encounter.samples, 'uuid')} onItemChosen={this.unifySample}
              placeholder="Search by sample id"
              itemTemplate={AddItemSearchSampleTemplate}
              itemKey="uuid" />
          </Modal>
        </div>

        <div className="row">
          <div className="col">
            <TestResultsList testResults={this.state.encounter.test_results} /><br/>
            <a className="btn-add-link"  href='#' onClick={this.showTestsModal}><span className="icon-circle-plus icon-blue"></span> Add tests</a>
          </div>

          <Modal ref="testsModal">
            <h1>
              <a href="#" className="modal-back" onClick={this.closeTestsModal}></a>
              Add test
            </h1>

            <AddItemSearch callback={"/encounters/search_test?institution_uuid=" + this.state.encounter.institution.uuid} onItemChosen={this.appendTest}
              placeholder="Search by test id"
              itemTemplate={AddItemSearchTestResultTemplate}
              itemKey="uuid" />
          </Modal>
        </div>

        <FlexFullRow>
          <button type="button" className="btn-primary" onClick={this.save}>Save</button>
        </FlexFullRow>

      </div>
    );
  },

}, ChangedBaseEncounterForm));
