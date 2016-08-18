var AlertGroupResultRow = React.createClass({
  render: function() {
    return (
    <tr data-href={this.props.alert.viewLink}>
      <td>{this.props.alert.name}</td>
      <td>{this.props.alert.description}</td>
      <td>{this.props.alert.enabled}</td>
      <td>{this.props.alert.sites}</td>
      <td>{this.props.alert.roles}</td>
      <td>{this.props.alert.lastIncident}</td>
    </tr>);
  }
});

var AlertGroupsIndexTable = React.createClass({
  getDefaultProps: function() {
    return {
      allowSorting: true,
      orderBy: 'alerts.name'
    }
  },

  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  render: function() {
    var rows           = [];
    var sortableHeader = function (title, field, tooltipText) {
      return <SortableColumnHeaderWithTooltip title={title} field={field} orderBy={this.props.orderBy} tooltipText={tooltipText} />
    }.bind(this);

    this.props.alerts.forEach(
      function(alert) {
        rows.push(<AlertGroupResultRow key={alert.id} alert={alert} />);
      }
    );

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="alert-groups-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.alert_groups.col_name"), 'alerts.name', I18n.t("components.alert_groups.tooltip_name"))}
            {sortableHeader(I18n.t("components.alert_groups.col_description"), 'alerts.description', I18n.t("components.alert_groups.tooltip_description"))}
            {sortableHeader(I18n.t("components.alert_groups.col_enabled"), 'alerts.enabled', I18n.t("components.alert_groups.tooltip_enabled"))}
            <th data-resizable-column-id="alerts.sites">
              <div className="tooltip">
                {I18n.t("components.alert_groups.col_sites")}
                <div className="tooltiptext_r">
                  {I18n.t("components.alert_groups.tooltip_sites")}
                </div>
              </div>
            </th>
            <th data-resizable-column-id="alerts.roles">
              <div className="tooltip">
                {I18n.t("components.alert_groups.col_roles")}
                <div className="tooltiptext_r">
                  {I18n.t("components.alert_groups.tooltip_roles")}
                </div>
              </div>
            </th>
            <th data-resizable-column-id="alerts.last_incident">
              <div className="tooltip">
                {I18n.t("components.alert_groups.col_last_incident")}
                <div className="tooltiptext_r">
                  {I18n.t("components.alert_groups.tooltip_last_incident")}
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});
