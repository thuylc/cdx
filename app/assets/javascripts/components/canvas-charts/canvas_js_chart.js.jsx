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
      <p>There was an error displaying the graph.</p>
    );
  }
});
