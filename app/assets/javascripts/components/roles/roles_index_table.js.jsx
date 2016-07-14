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
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="alert-groups-table">
        <thead>
          <tr>
            {sortableHeader('Name', 'roles.name', 'This is the name of the role.')}
            {sortableHeader('Location', 'sites.name', 'This is the site the role applies to.')}
            <th data-resizable-column-id="count">
              <div className="tooltip">
                Users
                <div className="tooltiptext_r">
                  Number of users who have this role.
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
