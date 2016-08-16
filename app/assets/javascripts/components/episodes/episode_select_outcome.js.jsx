var EpisodeSelectOptionWrapper = React.createClass({
  isSelected: function(){
    return this.props.selected === true ? 'selected' : ''
  },

  render: function() {
    var value = this.props.data.id;
    var name = this.props.data.name;
    var selected = this.isSelected();

    return (<option value={value} selected={selected}>{name}</option>)
  }
});

var EpisodeSelectOutcome = React.createClass({
  confirmCloseEpisode: function(event) {
    this.refs.confirmCloseEpisode.show();
    event.preventDefault();
  },

  closeEpisodeModal: function(event) {
    this.refs.confirmCloseEpisode.hide();
    event.preventDefault();
  },

  closeEpisode: function(event) {
    $('#episode_closed').val(1);
    this.refs.confirmCloseEpisode.hide();
    event.preventDefault();
  },

  render: function(){
    var _this = this
    return(
      <div className="row">
        <div className="col-6">
          <label htmlFor="outcome">{I18n.t("components.episodes.lbl_treatment_outcome")}</label>
        </div>
        <div className="col-6">
          <select name="episode[outcome]" onChange={this.confirmCloseEpisode}>
            {this.props.outcomeOptions.map(function(result){
              var selected = _this.props.selected == result.id
              return <EpisodeSelectOptionWrapper key={result.id} data={result} selected={selected} />
            })}
          </select>
        </div>
        <Modal ref="confirmCloseEpisode">
          <h1>{I18n.t("components.episodes.h1_comfirm_msg")}</h1>
          <p><a href="#" onClick={this.closeEpisode}>{I18n.t("components.episodes.comfirm_yes")}</a> | <a href="#" onClick={this.closeEpisodeModal}>{I18n.t("components.episodes.comfirm_no")}</a></p>
        </Modal>
      </div>
    );
  }
});
