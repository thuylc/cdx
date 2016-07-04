var EncounterNew = React.createClass({
  getInitialState: function() {
    return {encounter: {
      institution: this.props.context.institution,
      site: null,
      performing_site: null,
      patient: this.props.patient,
      samples: [],
      new_samples: [],
      test_results: [],
      assays: [],
      observations: '',
      coll_sample_type: '',
      coll_sample_other: '',
      exam_reason: '',
      tests_requested: '',
      diag_comment: '',
      treatment_weeks: 0,
      testdue_date: '',
      allows_manual_entry: null
    }};
  },
  setSite: function(site) {
    this.setState(React.addons.update(this.state, {
      encounter: {
        site: { $set: site },
        performing_site: { $set: site },
        patient: { $set: this.props.patient },
        samples: { $set: [] },
        new_samples: { $set: [] },
        test_results: { $set: [] },
        assays: { $set: [] },
        observations: { $set: '' },
        coll_sample_type: { $set: '' },
        coll_sample_other: { $set: '' },
        exam_reason: { $set: '' },
        tests_requested: { $set: '' },
        diag_comment: { $set: '' },
        treatment_weeks: { $set: 0 },
        testdue_date: { $set: '' }
      }
    }));
  },
  setPerformingSite: function(site) {  
    this.setState(React.addons.update(this.state, {
      encounter: {
        performing_site: { $set: site },
      }
    }));
  },
  allow_manual_entry_callback: function(manual_entry) {
    this.setState({
      allows_manual_entry: manual_entry
    });
  },
  render: function() {
    var sitesUrl = URI("/encounters/sites").query({context: this.props.context.institution.uuid});
    var siteSelect = <SiteSelect onChange={this.setSite} url={sitesUrl} fieldLabel='Requested' defaultSiteUuid={_.get(this.props.context.site, 'uuid')} allow_manual_entry_callback={this.allow_manual_entry_callback} />;
    var performingSiteSelect = <SiteSelect onChange={this.setPerformingSite} url={sitesUrl} fieldLabel='Performing' defaultSiteUuid={_.get(this.props.context.performingsite, 'uuid')} />;

    if (this.state.encounter.site == null)
      return (<div className="testflow">{siteSelect}</div>);

    return (
      <div className="testflow">
        {siteSelect}
        {performingSiteSelect}

        {(function(){
          if (this.props.mode == 'existing_tests') {
            return <EncounterForm encounter={this.state.encounter} context={this.props.context} possible_assay_results={this.props.possible_assay_results} manual_sample_entry={this.state.encounter.site.allows_manual_entry} />
          } else {
            return <FreshTestsEncounterForm encounter={this.state.encounter} context={this.props.context} possible_assay_results={this.props.possible_assay_results} 
                    manual_sample_entry={this.state.encounter.site.allows_manual_entry} referer={this.props.referer} allows_manual_entry={this.state.allows_manual_entry}/>                 
          }
        }.bind(this))()}
      </div>
    );
  },
});
