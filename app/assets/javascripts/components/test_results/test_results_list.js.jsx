var TestResultRow = React.createClass({
  render: function() {
    var test = this.props.test_result;

    var assays = test.assays;
    var fillAssays = this.props.assaysColspan - assays.length;

    return (
    <tr data-href={'/test_results/' + test.uuid}>
      <td>{test.name}</td>

      {assays.map(function(assay) {
         return <td key={assay.condition} className="text-right"><AssayResult assay={assay}/></td>;
      })}
      { fillAssays > 0 ? <td colSpan={fillAssays}></td> : null }

      { this.props.showSites ? <td>{test.site ? test.site.name : null}</td> : null }
      { this.props.showDevices ? <td>{test.device ? test.device.name : null}</td> : null }
      { this.props.showDevices ? <td>{test.device ? test.device.serial_number : null}</td> : null }
      <td>{test.sample_entity_ids}</td>
      <td>{test.type}</td>
      <td>{test.status}</td>
      <td>{test.error_code}</td>
      <td>{test.start_time}</td>
      <td>{test.end_time}</td>
    </tr>);
  }
});

var TestResultsList = React.createClass({
  getDefaultProps: function() {
    return {
      title: "Tests",
      titleClassName: "",
      downloadCsvPath: null,
      allowSorting: true,
      orderBy: "site.name",
      showSites: true,
      showDevices: true
    }
  },

  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  render: function() {
    var sortableHeader = function (title, field) {
      if (this.props.allowSorting) {
        return <SortableColumnHeader title={title} field={field} orderBy={this.props.orderBy} />
      } else {
        return <th>{title}</th>;
      }
    }.bind(this);

    var totalAssaysColCount = _.reduce(this.props.testResults, function(m, test) {
      return Math.max(m, test.assays.length);
    }, 1);

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="test-results-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.test_results.col_test"), "test.name")}
            <th data-resizable-column-id="results" colSpan={totalAssaysColCount}>{I18n.t("components.test_results.col_result")}</th>
            { this.props.showSites ? sortableHeader(I18n.t("components.test_results.col_site"), "site.name") : null }
            { this.props.showDevices ? sortableHeader(I18n.t("components.test_results.col_device_name"), "device.name") : null }
            { this.props.showDevices ? sortableHeader(I18n.t("components.test_results.col_device_number"), "device.serial_number") : null }
            {sortableHeader(I18n.t("components.test_results.col_sample_id"), "sample.id")}
            {sortableHeader(I18n.t("components.test_results.col_type"), "test.type")}
            {sortableHeader(I18n.t("components.test_results.col_status"), "test.status")}
            {sortableHeader(I18n.t("components.test_results.col_err_code"), "test.error_code")}
            {sortableHeader(I18n.t("components.test_results.col_start_time"), "test.start_time")}
            {sortableHeader(I18n.t("components.test_results.col_end_time"), "test.end_time")}
          </tr>
        </thead>
        <tbody>
          {this.props.testResults.map(function(test_result) {
             return <TestResultRow key={test_result.uuid} test_result={test_result}
              showSites={this.props.showSites} showDevices={this.props.showDevices}
              assaysColspan={totalAssaysColCount} />;
          }.bind(this))}
        </tbody>
      </table>
    );
  }
});
