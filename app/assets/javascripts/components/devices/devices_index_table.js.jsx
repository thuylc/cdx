var DeviceResultRow = React.createClass({
  render: function() {
    return (
    <tr data-href={this.props.device.viewLink}>
      <td>{this.props.device.name}</td>
      <td>{this.props.device.institutionName}</td>
      <td>{this.props.device.modelName}</td>
      <td>{this.props.device.siteName}</td>
    </tr>);
  }
});

var DevicesIndexTable = React.createClass({
  getDefaultProps: function() {
    return {
      allowSorting: true,
      orderBy: "devices.name",
    }
  },

  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  render: function() {
    var rows           = [];
    var sortableHeader = function (title, field) {
      return <SortableColumnHeader title={title} field={field} orderBy={this.props.orderBy} />
    }.bind(this);

    this.props.devices.forEach(
      function(device) {
        rows.push(<DeviceResultRow key={device.id} device={device} />);
      }
    );

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="devices-table">
        <thead>
          <tr>
            {sortableHeader("Name", "devices.name")}
            {sortableHeader("Manufacturer", "institutions.name")}
            {sortableHeader("Model", "device_models.name")}
            {sortableHeader("Site", "sites.name")}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});
