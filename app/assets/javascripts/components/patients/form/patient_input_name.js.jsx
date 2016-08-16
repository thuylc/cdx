var PatientInputName = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return { inputValue: this.props.fieldValue || '' };
  },

  checkPatientName: function() {
    if ( this.linkState('inputValue').value.length > 3 ) {
      PatientSearchActions.searchPatients(this.linkState('inputValue').value, this.props.patientsSearchUrl);
    }
  },

  render: function(){
    return (
      <div className="row">
        <div className="col pe-2">
          <label htmlFor="patient_name">{I18n.t("components.patients.form.lbl_name")}</label>
        </div>
        <div className="col">
          <input className="input-large" onBlur={this.checkPatientName()} valueLink={this.linkState('inputValue')} type="text" name="patient[name]" id="patient_name" />
        </div>
      </div>
    );
  }
});
