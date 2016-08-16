var CultureResultRow = React.createClass({
  render: function() {
    return (
      <tr data-href={this.props.testResult.viewLink}>
        <td>{this.props.testResult.sampleCollectedOn}</td>
        <td>{this.props.testResult.serialNumber}</td>
        <td>{this.props.testResult.examinedBy}</td>
        <td>{this.props.testResult.mediaUsed}</td>
        <td>{this.props.testResult.testResult}</td>
        <td>{this.props.testResult.resultOn}</td>
      </tr>
    );
  }
});

var CultureResultsIndex = React.createClass({
  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  render: function() {
    var sortableHeader = function (title, field) {
      return <SortableColumnHeader title={title} field={field} orderBy='patient_results.sample_collected_on' />
    }.bind(this);

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="culture-test-results-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.test_results.col_sample"), 'patient_results.sample_collected_on')}
            {sortableHeader(I18n.t("components.test_results.col_number"),       'patient_results.serial_number')}
            {sortableHeader(I18n.t("components.test_results.col_exam_by"),         'patient_results.examined_by')}
            {sortableHeader(I18n.t("components.test_results.col_media_used"),          'patient_results.media_used')}
            {sortableHeader(I18n.t("components.test_results.col_test_result"),         'patient_results.test_result')}
            {sortableHeader(I18n.t("components.test_results.col_result_on"),           'patient_results.result_on')}
          </tr>
        </thead>
        <tbody>
          {
            this.props.testResults.map(function(testResult) {
             return <CultureResultRow key={testResult.id} testResult={testResult} />;
            })
          }
        </tbody>
      </table>
    );
  }
});
