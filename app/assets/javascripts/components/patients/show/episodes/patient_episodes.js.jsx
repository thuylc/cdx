var PatientEpisodes = React.createClass({
  getInitialState: function () {
    var currentTab = window.store.get('patientEpisodeTab') ? window.store.get('patientEpisodeTab') : 1;
    return {
      tabList: [
        { 'id': 1, 'name': I18n.t("components.patients.show.episodes.lst_open") },
        { 'id': 2, 'name': I18n.t("components.patients.show.episodes.lst_close") }
      ],
      currentTab: currentTab
    };
  },

  changeTab: function(tab, e) {
    window.store.set('patientEpisodeTab', tab.id);
    this.setState({ currentTab: tab.id });
  },

  render: function(){
    return(
      <div>
        <PatientTabs currentTab={this.state.currentTab} tabList={this.state.tabList} changeTab={this.changeTab} />
        <PatientEpisodesContent currentTab={this.state.currentTab} episodesUrl={this.props.episodesUrl} />
      </div>
    );
  }
});
