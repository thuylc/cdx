var DeviceMessageRow = React.createClass({
  render: function() {
    return (
    <tr>
      <td>
        {
          this.props.deviceMessage.indexStatus.hasOwnProperty('success') ?
          this.props.deviceMessage.indexStatus.success :
                    <a href={this.props.deviceMessage.indexStatus.link} title={I18n.t("components.device_messages_table.click_to_process")} method="post">
            {this.props.deviceMessage.indexStatus.failed}
          </a>
        }</td>
      <td>{this.props.deviceMessage.failureReason}</td>
      <td>{this.props.deviceMessage.modelName}</td>
      <td>{this.props.deviceMessage.deviceName}</td>
      <td>{this.props.deviceMessage.numberOfFailures}</td>
      <td>{this.props.deviceMessage.errorField}</td>
      <td>{this.props.deviceMessage.createdAt}</td>
      <td>
        
        <a href={this.props.deviceMessage.rawLink} title={I18n.t("components.device_messages_table.download_raw_file")}>
          <div className="icon-download icon-gray"></div>
        </a>
      </td>
    </tr>);
  }
});

var DeviceMessagesList = React.createClass({
  getDefaultProps: function() {
    return {
      title: "Device messages",
      titleClassName: "table-title",
      allowSorting: true,
      orderBy: "-device_messages.created_at"
    }
  },

  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  render: function() {
    var sortableHeader = function (title, field) {
      return <SortableColumnHeader title={title} field={field} orderBy={this.props.orderBy} />
    }.bind(this);

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="test-orders-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.device_messages_table.col_status"),  "device_messages.index_failed")}
            {sortableHeader(I18n.t("components.device_messages_table.col_message"), "device_messages.index_failure_reason")}
            {sortableHeader(I18n.t("components.device_messages_table.col_model"),   "device_models.name")}
            {sortableHeader(I18n.t("components.device_messages_table.col_device"),  "devices.name")}
            <th data-resizable-column-id="failures">{I18n.t("components.device_messages_table.col_failures")}</th>
            <th data-resizable-column-id="error-field">{I18n.t("components.device_messages_table.col_error_field")}</th>
            {sortableHeader(I18n.t("components.device_messages_table.col_date"),    "device_messages.created_at")}
            <th data-resizable-column-id="raw">{I18n.t("components.device_messages_table.col_raw")}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.deviceMessages.map(function(deviceMessage) {
             return <DeviceMessageRow key={deviceMessage.id} deviceMessage={deviceMessage} />;
          }.bind(this))}
        </tbody>
      </table>
    );
  }
});
