var UserResultRow = React.createClass({
  render: function() {
    return (
    <tr data-href={this.props.user.viewLink}>
      <td>{this.props.user.name}</td>
      <td>{this.props.user.roles}</td>
      <td>{this.props.user.isActive}</td>
      <td>{this.props.user.lastActivity}</td>
    </tr>);
  }
});

var UsersIndexTable = React.createClass({
  getDefaultProps: function() {
    return {
      allowSorting: true,
      orderBy: 'users.first_name'
    }
  },

  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  render: function() {
    var rows           = [];
    var sortableHeader = function (title, field, tooltipText) {
      return <SortableColumnHeader title={title} field={field} orderBy={this.props.orderBy} tooltipText={tooltipText} />
    }.bind(this);

    this.props.users.forEach(
      function(user) {
        rows.push(<UserResultRow key={user.id} user={user} />);
      }
    );

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="users-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.users.col_full_name"), 'users.first_name')}
            <th data-resizable-column-id="sample-id">{I18n.t("components.users.col_role")}</th>
            {sortableHeader(I18n.t("components.users.col_status"), 'users.is_active')}
            {sortableHeader(I18n.t("components.users.col_last_activity"), 'users.last_sign_in_at')}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});
