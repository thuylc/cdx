AlertDisplayIncidentInfo = React.createClass({
	render: function() {

		if(this.props.edit) {
			return (
        <div className="col">
  				<div className="box small gray">
  					<div className = "row">
    					<div className = "col pe-2">
    						<label>I18n.t("components.alert_incidents.creation_date_row")</label>
    					</div>
    					<div className = "col">
    						<label>{this.props.alert_created_at}</label>
    					</div>
    				</div>

    				<div className = "row">
      				<div className = "col pe-2">
      					<label>I18n.t("components.alert_incidents.incidents_row")</label>
      				</div>
      				<div className = "col">
      					<a className = "btn-link" href={"/incidents?alert.id="+this.props.alert_info.id}><label>{this.props.alert_number_incidents}</label></a>
      				</div>
      			</div>
    			  <div className = "row">
        			<div className = "col pe-2">
        				<label>I18n.t("components.alert_incidents.last_incident_row")</label>
        			</div>
        			<div className = "col" id="incidents">
        				<label>{this.props.alert_last_incident} I18n.t("components.alert_incidents.ago_col")</label>
        			</div>
        		</div>
          </div>
        </div>
      )
    } else {
	    return null;
    }
  }
});
