var XpertResultRow = React.createClass({
  render: function() {
    return (
      <tr data-href={this.props.testResult.viewLink}>
        <td>{this.props.testResult.sampleCollectedOn}</td>
        <td>{this.props.testResult.examinedBy}</td>
        <td>{this.props.testResult.tuberculosis}</td>
        <td>{this.props.testResult.trace}</td>
        <td>{this.props.testResult.rifampicin}</td>
        <td>{this.props.testResult.resultOn}</td>
      </tr>
    );
  }
});

var XpertResultsIndex = React.createClass({
  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  render: function() {
    var sortableHeader = function (title, field) {
      return <SortableColumnHeader title={title} field={field} orderBy='patient_results.sample_collected_on' />
    }.bind(this);

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="xpert-test-results-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.test_results.col_sample"), 'patient_results.sample_collected_on')}
            {sortableHeader(I18n.t("components.test_results.col_exam_by"),         'patient_results.examined_by')}
            {sortableHeader(I18n.t("components.test_results.col_tuber"),        'patient_results.tuberculosis')}
            {sortableHeader(I18n.t("components.test_results.col_trace"),               'patient_results.trace')}
            {sortableHeader(I18n.t("components.test_results.col_rifampicin"),          'patient_results.rifampicin')}
            {sortableHeader(I18n.t("components.test_results.col_result_on"),           'patient_results.result_on')}
          </tr>
        </thead>
        <tbody>
          {
            this.props.testResults.map(function(testResult) {
             return <XpertResultRow key={testResult.id} testResult={testResult} />;
            })
          }
        </tbody>
      </table>
    );
  }
});
