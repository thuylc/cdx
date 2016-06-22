var CanvasBarChart = React.createClass({
  componentDidMount() {
    console.log(this.props.graphData);
    var chart = new CanvasJS.Chart("chartContainer", this.props.graphData);
    chart.render();
  },

  render: function(){
    return (
      <p>There was an error displaying this graph.</p>
    );
  }
});
