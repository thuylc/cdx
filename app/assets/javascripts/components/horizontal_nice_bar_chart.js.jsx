var HorizontalNiceBarChart = React.createClass({

  getInitialState: function() {
    var width_value = this.props.width || 0;
    return {
      width: width_value
    };
  },

  getDefaultProps: function() {
    return {
      margin: {top: 20, right: 20, bottom: 30, left: 50},
      height: 250,
      bar_height: 30,
      bar_gap: 20,
      space_for_labels: 100,
      space_for_ticks: 60,
      space_for_legend: 200,
      fill_colour: '#03A9F4',
      colors: ["#9D1CB2", "#F6B500", "#47B04B", "#009788", "#A05D56", "#D0743C", "#FF8C00"],
      offcolor: "#434343",
    }
  },

  render: function() 
  {
    var data = this.props.data;

    barHeight        = this.props.bar_height,
    barHeightHalf    = barHeight /2,
    groupHeight      = barHeight * data.length,
    gapBetweenGroups = this.props.bar_gap,
    spaceForLabels   = this.props.space_for_labels,
    spaceForLegend   = this.props.space_for_legend;
    fillColour       = this.props.fill_colour;
    fillColourList   = this.props.colors;

    var chart = document.getElementById(this.props.chart_div),
      axisMargin = 20,
      margin = 20,
      valueMargin = 0,
      width = this.state.width,
      barPadding = gapBetweenGroups,
      bar, svg, scale, xAxis, labelWidth = 0,
      chartHeight = (barHeight * (data.length+1)) + (gapBetweenGroups * (data.length+1));

      // get maximum data value
    max_data_value = d3.max(data.map(function(d){ 
        return d._value;
      }));

    if (data.length==0) {
      chartHeight = 200;
    }

    barColour = function(i) 
    { 
      return fillColourList[i];
    }

    //---------------------------------------------------------

    svg = d3.select(chart)
      .append("svg")
      .attr("width", this.state.width)
      .attr("height", chartHeight);

    // make all bars
    bar = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g");

    bar.attr("class", "chart-base")
      .attr("cx",0)
      .attr("transform", function(d, i) { 
        return "translate(0," + (i * (barHeight + barPadding) + barPadding) + ")";
      });

    // per bar labels
    bar.append("text")
      .attr("class", "chart-axis-label" )
      .attr("text-anchor", "end")
      .attr("y", barHeightHalf)
      .attr("dy", ".35em") //vertical align middle
      .text(function(d){ return d._label; })
      .each(function() {
        labelWidth = Math.min(spaceForLabels, Math.max(labelWidth, this.getBBox().width))+barHeightHalf;
      })
      .attr("x", labelWidth-barHeightHalf);

    scale = d3.scale.linear()
      .domain([0, max_data_value])
      .range([0, width - (margin*4) - labelWidth]);

    xAxis = d3.svg.axis()
      .scale(scale)
      .tickSize( -chartHeight + (margin*2) + axisMargin)
      .orient("bottom");

    // main bar rectangle
    bar.append("rect")
      .attr("transform", "translate("+(labelWidth)+", 0)")
      .attr("height", barHeight)
      .attr("stroke", "none")
      .attr("fill",function(d, i) { return barColour(i) })
      .attr("width", function(d)
      {
        return scale(d._value);
      })
      .attr("id", function(d, i)
      {
        return i;
      });

    // outer circle
    bar.append("circle")
      .attr("cy", barHeightHalf)
      .attr("r", barHeightHalf)
      .attr("fill", function(d, i) { return barColour(i) })
      .attr("stroke", function(d, i) { return barColour(i) })
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.2)
      .attr("cx", function(d)
      {
        return scale(d._value) + labelWidth;
      });

    // inner circle
    bar.append("circle")
      .attr("cy", barHeightHalf)
      .attr("r", barHeightHalf-3)
      .attr("fill", "white")
      .attr("stroke", "none")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.2)
      .attr("cx", function(d)
      {
        return scale(d._value) + labelWidth;
      });

    // end of bar labels
    bar.append("text")
      .attr("class", "chart-value-item")
      .attr("y", barHeightHalf)
      .attr("dx", "0")
      .attr("dy", ".35em") //vertical align middle
      .attr("text-anchor", "middle")
      .attr("color", function(d, i) { return barColour(i) })
      .text(function(d)
      {
        if( d._value > 0 )
          return d._value;
        return '0';
      })
      .attr("x", function(d)
      {
        return scale(d._value) + valueMargin + labelWidth;
      });

    /*
    var canvasWidth = this.props.width,
        canvasHeight = chartHeight,
        otherMargins = canvasWidth * 0.1,
        leftMargin = canvasWidth * 0.25,
        maxBarWidth = canvasHeight - - otherMargins - leftMargin
        maxChartHeight = canvasHeight - (otherMargins * 2);

    //x axis title        
    svg.append("text")
      .attr("x", (maxBarWidth / 2) + leftMargin)
      .attr("y", chartHeight - (otherMargins / 8))
      .attr("text-anchor", "middle")
      .attr("class", "chart-axis-title")
      .text(this.props.label);                                

    if (data.length==0) 
    {
      svg.append("text")
        .attr("x", this.state.width / 2)
        .attr("y", chartHeight/2)
        .attr("dy", "-.7em")
        .attr("class", "chart-value-item")
        .style("text-anchor", "middle")
        .text("There is no data to display");
    }
    */
    return (
        <div>
        </div>
        );
  }
});
