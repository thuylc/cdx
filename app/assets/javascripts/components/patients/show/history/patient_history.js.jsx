var PatientHistory = React.createClass({
  getInitialState: function () {
    return {
      tabList: [
        { 'id': 1, 'name': I18n.t("components.patients.show.history.lst_history") },
        { 'id': 2, 'name': I18n.t("components.patients.show.history.lst_test_order") },
        { 'id': 3, 'name': I18n.t("components.patients.show.history.lst_results") },
        { 'id': 4, 'name': I18n.t("components.patients.show.history.lst_comments") }
      ],
      currentTab: this.props.defaultTab
    };
  },

  changeTab: function(tab, e) {
    document.cookie = 'defaultTab=' + tab.id;
    this.setState({ currentTab: tab.id });
  },

  render: function(){
    return(
      <div>
        <PatientTabs
          currentTab={this.state.currentTab}
          tabList={this.state.tabList}
          changeTab={this.changeTab}
          />
        <PatientHistoryContent currentTab={this.state.currentTab} commentsUrl={this.props.commentsUrl} testOrdersUrl={this.props.testOrdersUrl} patientLogsUrl={this.props.patientLogsUrl} testResultsUrl={this.props.testResultsUrl} />
      </div>
    );
  }
});
