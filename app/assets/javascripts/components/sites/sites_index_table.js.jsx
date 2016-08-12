var SiteResultRow = React.createClass({
  render: function() {
    return (
    <tr data-href={this.props.site.viewLink}>
      <td>{this.props.site.name}</td>
      <td>{this.props.site.city}</td>
      <td>{this.props.site.comment}</td>
    </tr>);
  }
});

var SitesIndexTable = React.createClass({
  getDefaultProps: function() {
    return {
      allowSorting: true,
      orderBy: "sites.name",
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

    this.props.sites.forEach(
      function(site) {
        rows.push(<SiteResultRow key={site.id} site={site} />);
      }
    );

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="sites-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.sites_index_table.col_name"), 'sites.name')}
            {sortableHeader(I18n.t("components.sites_index_table.col_city"), 'sites.city')}
            {sortableHeader(I18n.t("components.sites_index_table.col_comment"), 'sites.comment')}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});
