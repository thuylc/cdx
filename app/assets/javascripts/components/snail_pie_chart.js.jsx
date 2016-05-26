var SnailPieChart = React.createClass({
  getInitialState: function() {
    if (this.props.data.length==0) {
      shouldHide=true;
    } else {
      shouldHide=false;
    };

    return {
      shouldHide: shouldHide
    };
  },

  getDefaultProps: function() {
    return {
      margin: {top: 20, right: 20, bottom: 30, left: 50},
      height: 250,
      bar_height: 30,
      bar_gap: 20,
      space_for_labels: 160,
      space_for_ticks: 60,
      space_for_legend: 200,
      fill_colour: '#03A9F4',
      colors: ["#9D1CB2", "#F6B500", "#47B04B", "#009788", "#A05D56", "#D0743C", "#FF8C00"],
      offcolor: "#434343",
    }
  },

  componentDidMount: function() {
    if (!this.props.width) {
      this.setProps({
        width: this.refs.svg.getDOMNode().clientWidth
      })
    }
  },

  buildColorScale: function () {
    return d3.scale.ordinal().range(this.props.colors);
  },

  componentDidMount: function () {
    var svg = d3.select(this.refs.svg.getDOMNode());
    var data = this.props.data;

    var total = _.sum(data, '_value');

    var arcs_path = svg.selectAll(".arc path").data(data);
    var g_legends = svg.selectAll("g.legend").data(data);

    var main_total = svg.selectAll(".main.total");
    var details_total = svg.selectAll(".details.total");
    var details_total_number = svg.selectAll(".details.total.number");
    var details_total_legend_l = svg.selectAll(".details.total.legend .left");
    var details_total_legend_r = svg.selectAll(".details.total.legend .right");

    var stopOngoingAnimations = function () {
      arcs_path.transition().duration(0);
      main_total.transition().duration(0);
      details_total.transition().duration(0);
    };

    var radialGradient = svg.append("defs")
      .append("radialGradient")
        .attr("id", "radial-gradient");

    radialGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "white")
        .attr("stop-opacity", "1");

    radialGradient.append("stop")
        .attr("offset", "90%")
        .attr("stop-color", "white")
        .attr("stop-opacity", "1");

    radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "white")
        .attr("stop-opacity", "0");

    // source: http://stackoverflow.com/a/32129715/30948
    function wrapWithEllipsis( d ) 
    {
        var self = d3.select(this),
            textLength = self.node().getComputedTextLength(),
            text = self.text();
        while ( ( textLength > self.attr('width') )&& text.length > 0) 
        {
            text = text.slice(0, -1);
            self.text(text + '...');
            textLength = self.node().getComputedTextLength();
        }
    }

    var showItemPercentage = function (hoverItem) 
    {
      stopOngoingAnimations();
      var color = this.buildColorScale();

      details_total_number.text(hoverItem._value);
      details_total_legend_l.text(hoverItem._label).each(wrapWithEllipsis);
      details_total_legend_r.text(_.round(hoverItem._value * 100.0 / total) + '%');

      main_total.transition().style('opacity', 0).each("end", function()
      {
        details_total.transition().style('opacity', 1);
      });

      arcs_path.transition().attr('fill', function(d,i) {
        var c = color(i);
        return hoverItem == d ? c : this.props.offcolor;
      }.bind(this));
    }.bind(this);

    var showOverall = function() 
    {
      stopOngoingAnimations();
      var color = this.buildColorScale();
      details_total.transition().style('opacity', 0).each("end", function()
      {
        main_total.transition().style('opacity', 1);
      });
      arcs_path.transition().attr('fill', function(d,i) 
      {
        return color(i);
      }.bind(this));
    }.bind(this);

    arcs_path
      .on('mouseover', showItemPercentage)
      .on('mouseleave', showOverall);

    g_legends
      .on('mouseover', showItemPercentage)
      .on('mouseleave', showOverall);
  },

  render: function() 
  {
    var radius = Math.min(this.props.width || this.props.height, this.props.height) / 2;
    var color = this.buildColorScale();
    var dropamount = this.props.data.length>10 ? (50/this.props.data.length) : 5; // up to 10 will contract by 5, else less.

    var arc = d3.svg.arc()
      .outerRadius( function(d,i) { return radius - (dropamount * i)} )
      .innerRadius(0);

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d._value < 10?10:d._value; });

    var legendPos = d3.scale.ordinal()
      .domain(this.props.data.map(function(x, i) { return i; }))
      .rangePoints([-25 * (this.props.data.length - 1) / 2, 25 * (this.props.data.length - 1) / 2]);

    var svgProps = {}
    if (this.props.width) 
    {
      svgProps.viewBox = "0 0 " + this.props.width + " " + this.props.height
    }
    return (
      <div>
        <div className={this.state.shouldHide ? '' : 'hidden'}>
          <span className="chart-value-item">There is no data to display</span>
        </div>

        <div className={this.state.shouldHide ? 'hidden' : ''}>    
         <svg className="chart"
           width="100%"
           height={this.props.height} ref="svg"
           {...svgProps}>
          <g transform={"translate(" + radius + "," + (this.props.height / 2) + ")"}>

          {/* Pie Slices */}
          {pie(this.props.data).map(function(d,i) 
            {
              return (
                <g className="arc" key={d._label}>
                  <path d={arc(d,i)} fill={color(i)}/>
                </g>
              );
            }
          )}

          <circle r="60" fill="url(#radial-gradient)" />

          {/* Total Count */}
          <text className="main total" dy=".25em">{ d3.sum(this.props.data, function(d) { return d._value }) }</text>
          <text className="main total legend" dy="2.25em">{this.props.label}</text>

          {/* Details Count */}
          <text className="details total number"  dy=".25em"></text>
          <text className="details total legend"  dy="2.25em">
                <tspan className="left" width="120"></tspan>
                <tspan className="right" dx=".35em"></tspan>
          </text>

          {/* Legends */}
          {this.props.data.map(function(d, i) {
            var txt = d._label+' ('+d._value+')';
            return (
              <g className="legend" key={d._label}
                 transform={"translate(" + (radius + 30) + "," + legendPos(i) + ")"}>
                <circle r="8" fill={color(i)} />
                <text dx="15" dy=".35em">{txt}</text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
   </div>
    );
  }
})
