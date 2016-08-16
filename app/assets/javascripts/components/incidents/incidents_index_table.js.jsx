var IncidentResultRow = React.createClass({
  render: function() {
    return (
    <tr data-href={this.props.incident.viewLink}>
      <td>{this.props.incident.alertName}</td>
      <td>{this.props.incident.devices}</td>
      <td>{this.props.incident.date}</td>
      <td>
        { this.props.incident.testResult.resultLink === false ?
          this.props.incident.testResult.caption :
          <a href={this.props.incident.testResult.resultLink}>{I18n.t("components.incidents.lnk_view_result")}</a>
        }
      </td>
    </tr>);
  }
});

var IncidentsIndexTable = React.createClass({
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

    this.props.incidents.forEach(
      function(incident) {
        rows.push(<IncidentResultRow key={incident.id} incident={incident} />);
      }
    );

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="incidents-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.incidents.col_alert"), "alerts.name")}
            <th data-resizable-column-id="devices">{I18n.t("components.incidents.col_devices")}</th>
            {sortableHeader(I18n.t("components.incidents.col_date"), "alert_histories.created_at")}
            {sortableHeader(I18n.t("components.incidents.col_result"), "alert_histories.test_result_id")}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});
