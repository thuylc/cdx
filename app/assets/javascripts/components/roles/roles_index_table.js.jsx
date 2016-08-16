var RoleResultRow = React.createClass({
  render: function() {
    return (
    <tr data-href={this.props.role.viewLink}>
      <td>{this.props.role.name}</td>
      <td>{this.props.role.site}</td>
      <td>{this.props.role.count}</td>
    </tr>);
  }
});

var RolesIndexTable = React.createClass({
  getDefaultProps: function() {
    return {
      allowSorting: true,
      orderBy: 'roles.name'
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

    this.props.roles.forEach(
      function(role) {
        rows.push(<RoleResultRow key={role.id} role={role} />);
      }
    );

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="roles-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.roles.col_name"), 'roles.name', I18n.t("components.roles.tooltip_name"))}
            {sortableHeader(I18n.t("components.roles.col_location"), 'sites.name', I18n.t("components.roles.tooltip_location"))}
            <th data-resizable-column-id="count">
              <div className="tooltip">
                {I18n.t("components.roles.col_user")}
                <div className="tooltiptext_r">
                  {I18n.t("components.roles.tooltip_user")}
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
