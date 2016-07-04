var SiteSelect = React.createClass({
  getDefaultProps: function() {
    return {
      url: '/api/sites'
    }
  },

  getInitialState: function() {
    return {
      sites: [],
      selectedSiteUuid: this.props.defaultSiteUuid
    };
  },

  componentDidMount: function() {
    $.get(this.props.url, function(result) {
      if (!this.isMounted()) return;

      var changes = {
        sites: { $set: result.sites }
      };

      // if there is only one site in the institution, select it (without user intervention)
      // since the control will be hidden.
      if (result.total_count == 1 && !this.state.selectedSiteUuid) {
        changes.selectedSiteUuid = { $set: result.sites[0].uuid }
      }

      this.setState(React.addons.update(this.state, changes), function(){
        this.fireSiteChanged(this.state.selectedSiteUuid);
      }.bind(this));

    }.bind(this));
  },

  handleSiteChange: function(uuid) {
    this.setState(React.addons.update(this.state, {
      selectedSiteUuid: { $set: uuid }
    }));

    this.fireSiteChanged(uuid);
  },

  fireSiteChanged: function(siteUuid) {
    this.props.onChange(_.find(this.state.sites, {uuid: siteUuid}));

    if (this.props.allow_manual_entry_callback != null) {
      if (this.state.sites != null) {
        var results = this.state.sites.filter(function (site) { return site.uuid === siteUuid; });
        if ( (results != null) && (results.length > 0)) {
          this.props.allow_manual_entry_callback(results[0].allows_manual_entry);
        }
      }
    }
  },

  render: function() {
    if (this.state.sites.length > 1)
      return (
      <div className="row">
        <div className="col-6">
          <label>{this.props.fieldLabel} Site</label>
        </div>
        <div className="col-6">
          <Select className="input-large" ref="select" clearable={false}
            value={this.state.selectedSiteUuid}
            onChange={this.handleSiteChange}
            options={this.state.sites.map(function(site) {
              return {value: site.uuid, label: site.name};
            })}>
          </Select>
        </div>
      </div>);
    else
      return null;
  },
});
