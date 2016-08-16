var DstLpaResultRow = React.createClass({
  render: function() {
    return (
      <tr data-href={this.props.testResult.viewLink}>
        <td>{this.props.testResult.sampleCollectedOn}</td>
        <td>{this.props.testResult.serialNumber}</td>
        <td>{this.props.testResult.examinedBy}</td>
        <td>{this.props.testResult.mediaUsed}</td>
        <td>{this.props.testResult.resultH}</td>
        <td>{this.props.testResult.resultR}</td>
        <td>{this.props.testResult.resultE}</td>
        <td>{this.props.testResult.resultS}</td>
        <td>{this.props.testResult.resultAmk}</td>
        <td>{this.props.testResult.resultKm}</td>
        <td>{this.props.testResult.resultCm}</td>
        <td>{this.props.testResult.resultFq}</td>
        <td>{this.props.testResult.resultOn}</td>
      </tr>
    );
  }
});

var DstLpaResultsIndex = React.createClass({
  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  render: function() {
    var sortableHeader = function (title, field) {
      return <SortableColumnHeader title={title} field={field} orderBy='patient_results.sample_collected_on' />
    }.bind(this);

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="dstlpa-test-results-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.test_results.col_sample"), 'patient_results.sample_collected_on')}
            {sortableHeader(I18n.t("components.test_results.col_number"),       'patient_results.serial_number')}
            {sortableHeader(I18n.t("components.test_results.col_exam_by"),         'patient_results.examined_by')}
            {sortableHeader(I18n.t("components.test_results.col_media_used"),          'patient_results.media_used')}
            {sortableHeader(I18n.t("components.test_results.col_h"),           'patient_results.results_h')}
            {sortableHeader(I18n.t("components.test_results.col_r"),           'patient_results.results_r')}
            {sortableHeader(I18n.t("components.test_results.col_e"),           'patient_results.results_e')}
            {sortableHeader(I18n.t("components.test_results.col_s"),           'patient_results.results_s')}
            {sortableHeader(I18n.t("components.test_results.col_amk"),         'patient_results.results_amk')}
            {sortableHeader(I18n.t("components.test_results.col_km"),          'patient_results.results_km')}
            {sortableHeader(I18n.t("components.test_results.col_cm"),          'patient_results.results_cm')}
            {sortableHeader(I18n.t("components.test_results.col_fq"),          'patient_results.results_fq')}
            {sortableHeader(I18n.t("components.test_results.col_on"),           'patient_results.result_on')}
          </tr>
        </thead>
        <tbody>
          {
            this.props.testResults.map(function(testResult) {
             return <DstLpaResultRow key={testResult.id} testResult={testResult} />;
            })
          }
        </tbody>
      </table>
    );
  }
});
