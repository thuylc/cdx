var ShowPatientEpisodes = React.createClass({
  getInitialState: function() {
    return {
      patientEpisodes: [],
      loadingMessasge: I18n.t("components.patients.show.episodes.msg_loading"),
    };
  },

  getData: function(e) {
    if (e) { e.preventDefault(); }
    this.serverRequest = $.get(this.props.episodesUrl + this.getParams(), function (results) {
      if (results.length > 0) {
        this.setState({ patientEpisodes: results });
      } else {
        this.setState({ loadingMessage: I18n.t("components.patients.show.episodes.msg_no_episode") });
      };
    }.bind(this));
  },

  getParams: function() {
    return '&status='+ this.props.filterEpisodes;
  },

  componentDidMount: function() {
    this.getData();
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    var showEpisodes = [];

    this.state.patientEpisodes.forEach(
      function(episode) {
        showEpisodes.push(<ShowPatientEpisode episode={episode} key={episode.id} />);
      }
    );

    return (
      <div className="panel patient-details episodelisting patient-summary">
        {
          this.state.patientEpisodes.length < 1 ? <LoadingResults loadingMessage={this.state.loadingMessage} /> : {showEpisodes}
        }
      </div>
    );
  }
});
