var CanvasJsChart = React.createClass({
  componentDidMount() {
    var that = this;
    setTimeout(function(){
      var chart = new CanvasJS.Chart(that.props.chartDiv, that.props.chartData);
      chart.render();
    }, 10);

  },

  render: function(){
    return (
      <p>{I18n.t("components.canvas-charts.err_chart_msg")}</p>
    );
  }
});
