/*
  Expected Data format (eg. in ruby):
  [
    {:_label=>"AbbA", :peak=>26, :average=>12.2343},
    {:_label=>"BB", :peak=>26, :average=>70.12341234},
    {:_label=>"CC", :peak=>26, :average=>0.76347},
    {:_label=>"Aardvark", :peak=>42, :average=>21.345234},
    {:_label=>"Thirds", :peak=>66, :average=>33},
    {:_label=>"Fork", :peak=>12, :average=>5},
    {:_label=>"Spoon", :peak=>40, :average=>45}
  ]

  The attributes 'peak and 'average' can be anything, their names will be displayed in the legend.
  '_label', however, is special and cannot be a different name.
*/

var GroupedVerticalBarChart = React.createClass({ 
  getInitialState: function() 
  {
    var height_value = this.props.height || 250;
    return {
      height: height_value,
    };
  },
  getDefaultProps: function() 
  {
    return {
      margin: {top: 20, right: 20, bottom: 30, left: 50},
      width: 250,
      bar_size: 30,
      bar_gap: 20,
      space_for_labels: 50,
      space_for_ticks: 30,
      space_for_legend: 100,
      fill_colour: '#03A9F4',
      colors: ["#9D1CB2", "#F6B500", "#47B04B", "#009788", "#A05D56", "#D0743C", "#FF8C00","#9D1CB2", "#F6B500", "#47B04B", "#009788", "#A05D56", "#D0743C", "#FF8C00","#9D1CB2", "#F6B500", "#47B04B", "#009788", "#A05D56", "#D0743C", "#FF8C00"],
      offcolor: "#434343",
    }
  },
/*
  componentDidMount: function() 
  {
    if (!this.props.width) 
    {
      this.setProps({
        width: this.refs.svg.getDOMNode().clientWidth
      })
    }
    if (!this.props.height) 
    {
      this.setProps({
        height: this.refs.svg.getDOMNode().clientHeight
      })
    }

  },
*/
  render: function() 
  {
    var barWidth  = this.props.bar_size;
    var barGap    = this.props.bar_gap;
    var margin    = this.props.margin;

    all_data = this.props.data;
    var siteCount = all_data.length;

    if(siteCount == 0) return '';

    // returns array of all data fieldnames (except _label)
    var legendNames = d3.keys(all_data[0]).filter(function(key) 
                          { 
                            return key !== "_label"; 
                          });
    var barCountPerSite = legendNames.length;

    // calc width
    var xtmp = (((barCountPerSite * barWidth) + barGap) * siteCount) + margin.left + margin.right + this.props.space_for_legend;
    if(this.props.width > xtmp) xtmp = this.props.width;

    var chart = document.getElementById(this.props.chart_div);
    var height = Math.abs( parseInt(d3.select(chart).style('height'), 10) )-20;
    if(height <= 0) height = this.props.height || 400;

    var  width = xtmp - margin.left - margin.right - this.props.space_for_legend;
    height = height - margin.top - margin.bottom - this.props.space_for_labels;

    if(width == NaN) return '';

    // set the range bands for the domain array (created further down the code)
    // rangeband will return the step for each band
    var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1); // 10% padding

    var x1 = d3.scale.ordinal();

    var yi = d3.scale.linear()
      .range([0,height]);

    var y = d3.scale.linear()
      .range([height,0]);

    var colorFromRange = d3.scale.ordinal()
      .range(this.props.colors);

    var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".0"));

    var svg = d3.select(chart).append("svg")
      .attr("width", width + margin.left + margin.right + this.props.space_for_legend)
      .attr("height", height + margin.top + margin.bottom + this.props.space_for_labels)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // This bit must come AFTER the legendNames section above
    // creates new section in data with just data values
    all_data.forEach(function(d) 
      {   
        d.tests = legendNames.map(function(name) 
          { 
            return {name: name, value: +d[name]}; 
          });  
      });

    // create a domain range based on the _label name (eg. ['AA','BB','CC'])
    x0.domain(all_data.map(function(d) { return d._label; }));

    x1.domain(legendNames).rangeRoundBands([0, x0.rangeBand()]);

    // return the y value scaled to fit the minima (0) and maxima for the chart
    y.domain([0,d3.max(all_data, function(d) 
      { 
        return d3.max(d.tests, function(d) 
          { 
            return d.value; 
          }); 
      })
    ]);

    yi.domain([0,d3.max(all_data, function(d) 
      { 
        return d3.max(d.tests, function(d) 
          { 
            return d.value; 
          }); 
      })
    ]);

    // Horizontal Axis
    svg.append("g")
      .attr("class", "chart-axis")
      .attr("transform", "translate(0,"+y(0)+")")
      .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", function(d) { return "rotate(-45)" });

    // Vertical Axis
    svg.append("g")
      .attr("class", "chart-axis")
      .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)   // note:  x/y are reversed due to the rotation (-x = move down)
        .attr("x", 10-(height/2))
        .attr("dy", ".71em")  // align top
        .style("text-anchor", "end")
        .text("# tests");

    // Each block of graphs for a _label
    var state = svg.selectAll(".state")
      .data(all_data)
      .enter()
        .append("g")
        .attr("class", "state")
        .attr("transform", function(d) { return "translate(" + x0(d._label) + ",0)"; });

    // all bars within _label
    //var barWidth = x1.rangeBand();
    state.selectAll("rect")
      .data(function(d) { return d.tests; })
      .enter()
        .append("rect")
          .attr("width", barWidth )
          .attr("x", function(d,i) { return barWidth*i; })
          .attr("y", function(d) { return y(d.value)-yi(0); })
          .attr("height", function(d) { return yi(d.value)-yi(0); })
          .style("fill", function(d) { return colorFromRange(d.name); });

    state.selectAll("text")
      .data(function(d) { return d.tests; })
      .enter()
        .append("circle")
          .attr("r", barWidth/2 )
          .attr("cx", function(d,i) { return (barWidth*i)+(barWidth/2); })
          .attr("cy", function(d) { return y(d.value)-yi(0); })
          .attr("fill", function(d) { return colorFromRange(d.name); })
          .attr("stroke", function(d) { return colorFromRange(d.name) })
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 0.2);

    state.selectAll("text")
      .data(function(d) { return d.tests; })
      .enter()
        .append("circle")
          .attr("r", (barWidth/2)-3 )
          .attr("cx", function(d,i) { return (barWidth*i)+(barWidth/2); })
          .attr("cy", function(d) { return y(d.value)-yi(0); })
          .attr("fill", "white")
          .attr("stroke", "none")
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 0.2);

    state.selectAll("text")
      .data(function(d) { return d.tests; })
      .enter()
        .append("text")
          .attr("class", "chart-value-item")
          .style("text-anchor", "middle")
          .attr("x", function(d,i) { return (barWidth*i)+(barWidth/2); })
          .attr("y", function(d) { return y(d.value)-yi(0); })
          .attr("dy", ".35em") //vertical align middle
          .style("color", "black")
          .text(function(d) { return d.value.toFixed(0); });

    // legend
    var legend = svg.selectAll(".legend")
      .data(legendNames.slice())
      .enter()
        .append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(100,"+(i*25)+")"; });

    legend.append("rect")
      .attr("x", width - 1)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorFromRange);

    legend.append("text")
      .attr("x", width - 5)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

    /*
    if (all_data.length == 0) {
      svg.append("text")
        .attr("x", this.props.width/2)
        .attr("y", this.props.height/2)
        .attr("dy", "-.7em")
        .attr("class", "chart-value-item")
        .style("text-anchor", "middle")
        .text("There is no data to display");
    }
    */

    return (
      <div> </div>
    );
  }
});
