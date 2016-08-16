var ShowPatientEpisode = React.createClass({
  render: function () {
    return(
      <div className="row">
        <div className="col-12">
          <ul>
            <li>
              <label>
                {I18n.t("components.patients.show.episodes.lbl_diagnosis")}
              </label>
              {this.props.episode.diagnosis}
            </li>
            <li>
              <label>
                {I18n.t("components.patients.show.episodes.lbl_hiv_status")}
              </label>
              {this.props.episode.hivStatus}
            </li>
            <li>
              <label>
                {I18n.t("components.patients.show.episodes.lbl_history")}
              </label>
              {this.props.episode.initialHistory}
            </li>
          </ul>
          <ul>
            <li>
              <label>
                {I18n.t("components.patients.show.episodes.lbl_drug")}
              </label>
              {this.props.episode.drugResistance}
            </li>
            <li>
              <label>
                {I18n.t("components.patients.show.episodes.lbl_outcome")}
              </label>
              {this.props.episode.outcome}
            </li>
            <li>
              <label>
                {I18n.t("components.patients.show.episodes.lbl_diagnosis_by_site")}
              </label>
              &nbsp;{this.props.episode.anatomicalSiteDiagnosis}
            </li>
          </ul>
          <ul>
            <li>
              <a className="button edit" href={this.props.episode.editLink}>{I18n.t("components.patients.show.episodes.btn_edit")}</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
})
