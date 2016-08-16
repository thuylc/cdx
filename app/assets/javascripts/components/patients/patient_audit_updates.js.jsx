var PatientAuditUpdates = React.createClass({
  getInitialState: function() {
    return {
      patientAuditUpdates: [],
      queryOrder: true,
      loadingMessasge: I18n.t("components.patients.msg_loading")
    };
  },

  getAuditUpdates: function(field, e) {
    if (e) { e.preventDefault(); }
    this.serverRequest = $.get(this.props.auditUpdatesUrl + this.getParams(field), function (results) {
      if (results.length > 0) {
        this.setState({ patientAuditUpdates: results });
      } else {
        this.setState({ loadingMessasge: I18n.t("components.patients.msg_no_log") });
      };
    }.bind(this));
  },

  getParams: function(field) {
    this.state.queryOrder = !this.state.queryOrder;
    return '&field='+ field + '&order=' + this.state.queryOrder;
  },

  componentDidMount: function() {
    this.getAuditUpdates(1);
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function(){
    var rows = [];
    this.state.patientAuditUpdates.forEach(
      function(auditUpdate) {
        rows.push(<AuditUpdate auditUpdate={auditUpdate} key={auditUpdate.id} />);
      }
    );

    return (
      <div className="row">
        {
          this.state.patientAuditUpdates.length < 1 ? <LoadingResults loadingMessage={this.state.loadingMessage} /> :
          <table className="patient-audit-updates">
            <thead>
              <tr>
                <th><a href="#" onClick={this.getAuditUpdates.bind(null, 'name')}>{I18n.t("components.patients.col_field")}</a></th>
                <th>{I18n.t("components.patients.col_ori_value")}</th>
                <th>{I18n.t("components.patients.col_new_value")}</th>
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
