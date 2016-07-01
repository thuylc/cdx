var PatientAuditLogs = React.createClass({
  getInitialState: function() {
    return {
      patientLogs: [],
      queryOrder: true,
      loadingMessasge: 'Loading logs...'
    };
  },

  getPatientLogs: function(field, e) {
    if (e) { e.preventDefault(); }
    this.serverRequest = $.get(this.props.patientLogsUrl + this.getParams(field), function (results) {
      if (results.length > 0) {
        this.setState({ patientLogs: results });
      } else {
        this.setState({ loadingMessasge: 'There are no logs available.' });
      };
    }.bind(this));
  },

  getParams: function(field) {
    var orderField = field === 1 ? 'date' : 'name';
    this.state.queryOrder = !this.state.queryOrder;
    return '&field='+ orderField + '&order=' + this.state.queryOrder;
  },

  componentDidMount: function() {
    this.getPatientLogs(1);
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function(){
    var rows = [];
    this.state.patientLogs.forEach(
      function(patientLog) {
        rows.push(<PatientLog patientLog={patientLog} key={patientLog.id} />);
      }
    );

    return (
      <div className="row">
        {
          this.state.patientLogs.length < 1 ? <LoadingResults loadingMessage={this.state.loadingMessage} /> :
          <table className="patient-audit-logs">
            <thead>
              <tr>
                <th>Title</th>
                <th><a href="#" onClick={this.getPatientLogs.bind(null, 2)}>User</a></th>
                <th><a href="#" onClick={this.getPatientLogs.bind(null, 1)}>Date Added</a></th>
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
