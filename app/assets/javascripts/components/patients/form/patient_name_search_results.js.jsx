var PatientSearchActions = Reflux.createActions([
  'searchPatients'
]);

var PatientSearchStore = Reflux.createStore({

  listenables: PatientSearchActions,

  searchPatients: function(patientName, searchUrl) {
    var that    = this;
    patientName = encodeURIComponent(patientName)
    $.get(searchUrl + '&q=' + patientName, function (results) {
      that.trigger(results);
    });

  }
});

var PatientNameSearch = React.createClass({
  mixins: [Reflux.listenTo(PatientSearchStore, "onStatusChange")],

  getInitialState: function() {
    return { searchResults: [] };
  },

  onStatusChange: function(patientResults) {
    this.setState({ searchResults: patientResults });
  },

  render: function(){
    return (
      <div>
        { this.state.searchResults.length > 0 ? <PatientNameSearchResults searchResults={this.state.searchResults} /> : null }
      </div>

    );
  }
});

var PatientNameSearchResults = React.createClass({
  render: function(){
    var rows = [];
    this.props.searchResults.forEach(
      function(searchResult) {
        rows.push(<PatientNameSearchResult patientNameSearchResult={searchResult} key={searchResult.id} />);
      }
    );

    return (
      <table className="patient-name-duplicates">
        <caption>{I18n.t("components.patients.form.tbl_duplicate_msg")}</caption>
        <thead>
          <tr>
            <th>{I18n.t("components.patients.form.col_name")}</th>
            <th>{I18n.t("components.patients.form.col_gender")}</th>
            <th>{I18n.t("components.patients.form.col_birth_date")}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

var PatientNameSearchResult = React.createClass({
  navigateTo: function (toUrl) {
    window.location = toUrl;
  },

  render: function(){
    return (
      <tr onClick={this.navigateTo.bind(this, this.props.patientNameSearchResult.viewLink)}>
        <td>{this.props.patientNameSearchResult.name}</td>
        <td>{this.props.patientNameSearchResult.gender}</td>
        <td>{this.props.patientNameSearchResult.birthDate}</td>
      </tr>
    );
  }
});
