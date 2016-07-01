var PatientTestOrders = React.createClass({
  getInitialState: function() {
    return {
      patientTestOrders: [],
      queryOrder: true,
      loadingMessage: 'Loading test orders...'
    };
  },

  getTestOrders: function(field, e) {
    if (e) { e.preventDefault(); }
    this.serverRequest = $.get(this.props.testOrdersUrl + this.getParams(field), function (results) {
      if (results.length > 0) {
        this.setState({ patientTestOrders: results });
      } else {
        this.setState({ loadingMessasge: 'There are no test orders.' });
      };
    }.bind(this));
  },

  getParams: function(field) {
    this.state.queryOrder = !this.state.queryOrder;
    return '&field='+ field + '&order=' + this.state.queryOrder;
  },

  componentDidMount: function() {
    this.getTestOrders(1);
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function(){
    var rows = [];
    this.state.patientTestOrders.forEach(
      function(patientTestOrder) {
        rows.push(<PatientTestOrder patientTestOrder={patientTestOrder} key={patientTestOrder.id} />);
      }
    );

    return (
      <div className="row">
        {
          this.state.patientTestOrders.length < 1 ? <LoadingResults loadingMessage={this.state.loadingMessage} /> :
          <table className="patient-test-orders">
            <thead>
              <tr>
                <th><a href="#" onClick={this.getTestOrders.bind(null, 'site')}>Site</a></th>
                <th><a href="#" onClick={this.getTestOrders.bind(null, 'orderId')}>Order ID</a></th>
                <th><a href="#" onClick={this.getTestOrders.bind(null, 'requester')}>Requested By</a></th>
                <th><a href="#" onClick={this.getTestOrders.bind(null, 'date')}>Request Date</a></th>
                <th><a href="#" onClick={this.getTestOrders.bind(null, 'dueDate')}>Due Date</a></th>
                <th>Status</th>
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
