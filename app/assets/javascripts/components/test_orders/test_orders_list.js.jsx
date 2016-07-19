var TestOrderRow = React.createClass({
  selectedTestOrders: function (selectAll) {
    this.props.selectedTestOrders(selectAll);
  },

  visitLink: function () {
    window.location = this.props.testOrder.viewLink;
  },

  render: function() {
    return (
    <tr>
      <CsvCheckboxColumn columnId={this.props.testOrder.id} selectedTestOrders={this.selectedTestOrders} />
      <td onClick={this.visitLink}>{this.props.testOrder.requestedSiteName}</td>
      <td onClick={this.visitLink}>{this.props.testOrder.performingSiteName}</td>
      <td onClick={this.visitLink}>{this.props.testOrder.sampleId}</td>
      <td onClick={this.visitLink}>{this.props.testOrder.testingFor}</td>
      <td onClick={this.visitLink}>{this.props.testOrder.requestedBy}</td>
      <td onClick={this.visitLink}>{this.props.testOrder.requestDate}</td>
      <td onClick={this.visitLink}>{this.props.testOrder.dueDate}</td>
      <td onClick={this.visitLink}>{this.props.testOrder.status}</td>
    </tr>);
  }
});

var TestOrdersIndexTable = React.createClass({
  getDefaultProps: function() {
    return {
      title: "Test orders",
      allowSorting: true,
      orderBy: "encounters.testdue_date"
    }
  },

  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  selectedTestOrders: function(selectAll) {
    var selectedItems = '';
    if (selectAll) {
      window.store.set('selectedItems', '');
    } else {
      $('.table input:checked').each(function(element) {
        selectedItems += $(this).attr('name') + ',';
      });
      selectedItems = selectedItems.slice(0, -1)
      window.store.set('selectedItems', selectedItems);
    }
  },

  requestCsvFile: function () {
    window.location = this.props.csvUrl + '&format=csv&selectedItems=' + window.store.get('selectedItems')
  },

  render: function() {
    var sortableHeader = function (title, field) {
      return <SortableColumnHeader title={title} field={field} orderBy={this.props.orderBy} />
    }.bind(this);

    return (
      <div className="small-12 columns box">
        <header>
          <img src={this.props.imageUrl} alt={this.props.headerTitle} />
          <h3>
            {this.props.headerTitle}
          </h3>
          <span className="table-actions">
            <a title={this.props.csvTitle} onClick={this.requestCsvFile} href="#">
              <span className="icon-download icon-gray"></span>
            </a>
          </span>
        </header>
        <div className="box-content">
          <table className="table" cellPadding="0" cellSpacing="0"  data-resizable-columns-id="test-orders-table">
            <thead>
              <tr>
                <CsvCheckboxColumnHeader columnId="test-orders-table" selectedTestOrders={this.selectedTestOrders} />
                {sortableHeader("Request by", "sites.name")}
                {sortableHeader("Request to",    "performing_sites_encounters.name")}
                <th data-resizable-column-id="sample-id">Sample Id</th>
                {sortableHeader("Testing for",  "patients.name")}
                {sortableHeader("Order by user", "users.first_name")}
                {sortableHeader("Request date", "encounters.start_time")}
                {sortableHeader("Due date",     "encounters.testdue_date")}
                {sortableHeader("Status",       "encounters.status")}
              </tr>
            </thead>
            <tbody>
              {this.props.testOrders.map(function(testOrder) {
                 return <TestOrderRow key={testOrder.id} testOrder={testOrder} selectedTestOrders={this.selectedTestOrders} />;
              }.bind(this))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});
