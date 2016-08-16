var PatientResults = React.createClass({
  getInitialState: function() {
    return {
      patientResults: [],
      queryOrder: true,
      loadingMessasge: I18n.t("components.patients.show.history.msg_loading_result"),
      orderedColumns: {},
      availableColumns: [
        { title: I18n.t("components.patients.show.history.col_result_name"),   fieldName: 'name' },
        { title: I18n.t("components.patients.show.history.col_result_status"), fieldName: 'status' },
        { title: I18n.t("components.patients.show.history.col_result_date"),   fieldName: 'date' }
      ]
    };
  },

  getData: function(field, e) {
    if (e) { e.preventDefault(); }
    this.serverRequest = $.get(this.props.testResultsUrl + this.getParams(field), function (results) {
      if (results.length > 0) {
        this.setState({ patientResults: results });
        this.updateOrderIcon(field);
        $("table").resizableColumns({store: window.store});
      } else {
        this.setState({ loadingMessage: I18n.t("components.patients.show.history.msg_no_result") });
      };
    }.bind(this));
  },

  getParams: function(field) {
    this.state.queryOrder = !this.state.queryOrder;
    return '&field='+ field + '&order=' + this.state.queryOrder;
  },

  updateOrderIcon: function(orderedField) {
    var that                       = this;
    var updatedState               = {};
    var iconValue                  = (this.state.queryOrder == true) ? '&#x25BC;' : '&#x25B2;';
    this.state.availableColumns.forEach(
      function(column) {
        updatedState[column.fieldName] = ''
      }
    );
    updatedState[orderedField] = iconValue;
    this.setState({ orderedColumns: updatedState });
  },

  componentDidMount: function() {
    this.getData('date');
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function(){
    var rows       = [];
    var rowHeaders = [];
    var that       = this;
    this.state.patientResults.forEach(
      function(patientResult) {
        rows.push(<PatientResult patientResult={patientResult} key={patientResult.id} />);
      }
    );

    this.state.availableColumns.forEach(
      function(availableColumn) {
        rowHeaders.push(<OrderedColumnHeader key={availableColumn.fieldName} title={availableColumn.title} fieldName={availableColumn.fieldName} orderEvent={that.getData} orderIcon={that.state.orderedColumns[availableColumn.fieldName]} />);
      }
    );

    return (
      <div className="row">
        {
          this.state.patientResults.length < 1 ? <LoadingResults loadingMessage={this.state.loadingMessage} /> :
          <table className="table patient-results" data-resizable-columns-id="patient-results-table">
            <thead>
              <tr>
                {rowHeaders}
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
