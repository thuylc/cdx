var AlertMessageResultRow = React.createClass({
  render: function() {
    return (
    <tr data-href={this.props.alertMessage.viewLink}>
      <td>{this.props.alertMessage.alertGroup}</td>
      <td>{this.props.alertMessage.date}</td>
      <td>{this.props.alertMessage.channel}</td>
      <td>{this.props.alertMessage.message}</td>
    </tr>);
  }
});

var AlertMessagesIndexTable = React.createClass({
  getDefaultProps: function() {
    return {
      allowSorting: true,
      orderBy: "alerts.name",
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

    this.props.alertMessages.forEach(
      function(alertMessage) {
        rows.push(<AlertMessageResultRow key={alertMessage.id} alertMessage={alertMessage} />);
      }
    );

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="alert-messages-table">
        <thead>
          <tr>
            {sortableHeader("Name", "alerts.name")}
            {sortableHeader("Date", "recipient_notification_histories.created_at")}
            <th data-resizable-column-id="channels">Channels</th>
            {sortableHeader("Message", "recipient_notification_histories.message_sent")}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});
