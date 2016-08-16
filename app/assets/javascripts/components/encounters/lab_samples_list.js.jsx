var LabSamplesList = React.createClass({
  render: function() {
    var that = this;
    return (
      <ul className="samples">
        {
          this.props.samples.map(function(sample) {
            return(
              <LabSample key={sample.uuid} sample={sample} context={that.props.context} onUnifySample={that.props.onUnifySample} />
            )
          })
        }
      </ul>
    );
  }
});

var LabSample = React.createClass({
  componentDidMount: function() {
    this.props.sample.lab_sample_ids ?
      React.findDOMNode(this.refs.manualLabSampleEntry).value = this.props.sample.lab_sample_ids[0] : null
  },

  addLabId: function () {
    var labSampleId = React.findDOMNode(this.refs.manualLabSampleEntry).value;
    var sampleId    = React.findDOMNode(this.refs.sampleId).value;

    if (!labSampleId && !sampleId) { return }

    $.ajax({
      url: '/sample_identifiers/' + sampleId,
      type: 'PUT',
      data: { sample_identifier: { lab_sample_id: labSampleId }, context: this.props.context.full_context },
      success: function(result) {
      }
    });
  },

  render: function () {
    return (
      <p className="lab-sample-id">
        <Sample key={this.props.sample.uuid} sample={this.props.sample} onUnifySample={this.props.onUnifySample} />
        <br />
        <input type="text" size="20" placeholder="Lab. sample Id" ref="manualLabSampleEntry" />
        <input type="hidden" ref="sampleId" value={this.props.sample.uuid} />
        <button type="button" className="btn-primary" onClick={this.addLabId}>{I18n.t("components.encounters.btn_save")}</button>
      </p>
    );
  }
});
