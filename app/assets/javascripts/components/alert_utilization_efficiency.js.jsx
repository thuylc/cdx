var AlertUtilizationEfficiency = React.createClass({
	render: function() {
		return (
			< div className = "row" id = "utilizationEfficiencyRow" >
			<div className = "col pe-2" >
				<label> {I18n.t("components.alert_utilization_efficiency.timespan_row_label")}</label>
			</div>

			<div className = "col pe">
				<input type = "text" type="number" min="0" max="10000" placeholder = {I18n.t("components.alert_utilization_efficiency.number_placeholder")} valueLink = {
						this.props.valueLink
					}
					id = "alertutilizationefficiencynumber" disabled={this.props.edit} />
			</div>
		</div>
	);
}
});
