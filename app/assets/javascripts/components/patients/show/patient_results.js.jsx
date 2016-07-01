var PatientResults = React.createClass({
  getInitialState: function() {
    return {
      patientResults: [],
      queryOrder: true,
      loadingMessasge: 'Loading test results...'
    };
  },

  getPatientResults: function(field, e) {
    if (e) { e.preventDefault(); }
    this.serverRequest = $.get(this.props.testResultsUrl + this.getParams(field), function (results) {
      if (results.length > 0) {
        this.setState({ patientResults: results });
      } else {
        this.setState({ loadingMessasge: 'There are no comments available.' });
      };
    }.bind(this));
  },

  getParams: function(field) {
    var orderField = field === 1 ? 'date' : 'name';
    this.state.queryOrder = !this.state.queryOrder;
    return '&field='+ orderField + '&order=' + this.state.queryOrder;
  },

  componentDidMount: function() {
    this.getPatientResults(1);
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function(){
    var rows = [];
    this.state.patientResults.forEach(
      function(patientResult) {
        rows.push(<PatientResult patientResult={patientResult} key={patientResult.id} />);
      }
    );

    return (
      <div className="row">
        {
          this.state.patientResults.length < 1 ? <LoadingResults loadingMessage={this.state.loadingMessage} /> :
          <table className="patient-results">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        }
      </div>
    );
  }
});
