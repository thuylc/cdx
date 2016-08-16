var PatientTestOrders = React.createClass({
  getInitialState: function() {
    return {
      patientTestOrders: [],
      queryOrder: true,
      loadingMessage: I18n.t("components.patients.show.history.msg_loading_order"),
      orderedColumns: {},
      availableColumns: [
        { title: I18n.t("components.patients.show.history.col_test_order_request_by"),      fieldName: 'site' },
        { title: I18n.t("components.patients.show.history.col_test_order_request_to"),      fieldName: 'performingSite' },
        { title: I18n.t("components.patients.show.history.col_test_order_id"),        fieldName: 'orderId' },
        { title: I18n.t("components.patients.show.history.col_test_order_by_user"),   fieldName: 'requester' },
        { title: I18n.t("components.patients.show.history.col_test_order_request_date"),    fieldName: 'requestDate' },
        { title: I18n.t("components.patients.show.history.col_test_order_due_date"),        fieldName: 'dueDate' },
        { title: I18n.t("components.patients.show.history.col_test_order_time"), fieldName: '' },
        { title: I18n.t("components.patients.show.history.col_test_order_status"),          fieldName: 'status' }
      ]
    };
  },

  getData: function(field, e) {
    if (e) { e.preventDefault(); }
    this.serverRequest = $.get(this.props.testOrdersUrl + this.getParams(field), function (results) {
      if (results.length > 0) {
        this.setState({ patientTestOrders: results });
        this.updateOrderIcon(field);
        $("table").resizableColumns({store: window.store});
      } else {
        this.setState({ loadingMessage: I18n.t("components.patients.show.history.msg_no_order") });
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
    this.getData('site');
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function(){
    var rows       = [];
    var rowHeaders = [];
    var that       = this;
    this.state.patientTestOrders.forEach(
      function(patientTestOrder) {
        // Add new on-the-fly field to the output row
        patientTestOrder.turnaroundTime = 42;
        rows.push(<PatientTestOrder patientTestOrder={patientTestOrder} key={patientTestOrder.id} />);
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
          this.state.patientTestOrders.length < 1 ? <LoadingResults loadingMessage={this.state.loadingMessage} /> :
          <table className="table patient-test-orders" data-resizable-columns-id="patient-test-orders-table">
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
