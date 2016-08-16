var AlertAggregation = React.createClass({
	getDefaultProps: function(){
		return {
			multiple: false,
			name: 'Aggregation',
		}
	},
	//github.com/JedWatson/react-select/issues/256
	onChange(textValue, arrayValue) {
		//this.props.valueLink.requestChange(arrayValue[0].label);
		this.props.onChange(arrayValue[0].label);
	},
	render: function() {
		var options = [];
		for (var i = 0; i < Object.keys(this.props.aggregation_types).length; i++) {
			option = {};
			option["value"] = i;
			option["label"] = Object.keys(this.props.aggregation_types)[i];
			options.push(option);
		}

		var {
			valueLink,
			value,
			onChange,
			...other
		} = this.props;
		return (
			< div className = "row" id = "aggregationTypeRow" >
			<div className = "col pe-2" >
				<label className="tooltip">I18n.t("components.alert_aggregation.aggregation_type")
					<div className="tooltiptext_r">I18n.t("components.alert_aggregation.aggregation_type_tooltip")</div> 
				</label>
			</div>
			<div className = "col" >
				<Select
					name = "aggregation"
					value = {
						value || this.props.aggregationFrequencyField
					}
					options = {
						options
					}
					multi = {
						false
					}
					onChange = {
						this.onChange
					}
					disabled = {
						this.props.disable_all_selects
					}
					clearable = { false }
					/>
			</div>
		</div>
	);
}
});


var AlertAggregationFrequency = React.createClass({
	getDefaultProps: function(){
		return {
			multiple: false,
			name: 'Aggregation',
		}
	},
	//github.com/JedWatson/react-select/issues/256
	onChange(textValue, arrayValue) {
		this.props.valueLink.requestChange(arrayValue[0].label);
	},
	render: function() {
		var options = [];
		for (var i = 0; i < Object.keys(this.props.aggregation_frequencies).length; i++) {
			option = {};
			option["value"] = i;
			option["label"] = Object.keys(this.props.aggregation_frequencies)[i];
			options.push(option);
		}

		var {
			valueLink,
			value,
			onChange,
			...other
		} = this.props;
		return (
			< div className = "row" id = "aggregationFrequenciesRow" >
			<div className = "col pe-2" >
				<label className="tooltip">I18n.t("components.alert_aggregation.aggregation_frequency")
					<div className="tooltiptext_r">I18n.t("components.alert_aggregation.aggregation_frequency_tooltip")</div> 
				</label>
			</div>
			<div className = "col" >
				<Select
					name = "aggregation_frequency"
					value = {
						value || valueLink.value
					}
					options = {
						options
					}
					multi = {
						false
					}
					onChange = {
						this.onChange
					}
					disabled = {
						this.props.disable_all_selects
					}
					clearable = { false }
					/>
			</div>
		</div>
	);
}
});


var AlertAggregationThreshold = React.createClass({
	render: function() {
		return (
			< div className = "row" id = "aggregationThresholdRow" >
			<div className = "col pe-2" >
				<label className="tooltip">I18n.t("components.alert_aggregation.aggregation_threshold")
					<div className="tooltiptext_r">I18n.t("components.alert_aggregation.aggregation_threshold_tooltip")</div> 
				</label>
			</div>

			<div className = "col" >
					<input type = "text" type="number" min="0" max="10000" 
					  placeholder = {I18n.t("components.alert_aggregation.agg_threshold_placeholder")}
					  valueLink = {
							this.props.textLink
						}
						id="alertaggregationthresholdlimit" />
			</div>
					
			<div className = "col">
				<label>I18n.t("components.alert_aggregation.use_percentage")</label>
			</div>
			<div className = "col">
			  <input
					type = "checkbox"
					checkedLink = {
						this.props.checkedLink
					}
					id="alertaggregationpercentage"
					disabled={this.props.edit}
					/>		
				 <label htmlFor="alertaggregationpercentage">&nbsp;</label>
			</div>		
		</div>
	);
}
});

