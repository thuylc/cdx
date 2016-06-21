var tabList = [
    { 'id': 1, 'name': 'History', 'url': '#' },
    { 'id': 2, 'name': 'Test Orders', 'url': '#' },
    { 'id': 3, 'name': 'Results', 'url': '#' },
    { 'id': 4, 'name': 'Comments', 'url': '#' }
];

var PatientHistory = React.createClass({
  getInitialState: function () {
    return {
      tabList: tabList,
      currentTab: 1
    };
  },

  changeTab: function(tab) {
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
        <PatientContent currentTab={this.state.currentTab} commentsUrl={this.props.commentsUrl}/>
      </div>
    );
  }
});
