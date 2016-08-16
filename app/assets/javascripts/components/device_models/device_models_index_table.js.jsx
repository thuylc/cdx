var DeviceModelResultRow = React.createClass({
  render: function() {
    return (
    <tr data-href={this.props.deviceModel.viewLink}>
      <td>{this.props.deviceModel.name}</td>
      <td>{this.props.deviceModel.version}</td>
    </tr>);
  }
});

var DeviceModelsIndexTable = React.createClass({
  getDefaultProps: function() {
    return {
      allowSorting: true,
      orderBy: "device_models.name",
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

    this.props.deviceModels.forEach(
      function(deviceModel) {
        rows.push(<DeviceModelResultRow key={deviceModel.id} deviceModel={deviceModel} />);
      }
    );

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="device-models-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.device_models.col_name"), 'device_models.name')}
            <th data-resizable-column-id="version">{I18n.t("components.device_models.col_ver")}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});
