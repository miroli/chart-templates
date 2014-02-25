var PejlCharts = PejlCharts || {};

// The charts
PejlCharts.PieChart = function() {
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var margin = {top: 150, right: 20, bottom: 30, left: 150};

  var conf = {
    data: [],
    color: d3.scale.category10(),
    colorBy: '',
    outerRadius: 50,
    innerRadius: 40,
    width: null,
    height: null
  };

  function addChartMethod(property) {
    return function(value) {
      if (!arguments.length) return conf[property];
      conf[property] = value;
      return chart;
    }
  }

  for (var prop in conf) {
    if (conf.hasOwnProperty(prop)) {
      chart[prop] = addChartMethod(prop);
    }
  }

  function chart(svg) {
      conf.width = svg.style('width').replace('px','') - (margin.left + margin.right);
      conf.height = svg.style('height').replace('px','') - (margin.top + margin.bottom);

    var g = svg.append('g')
      .data([conf.data])
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('class', 'pejl-piechart');

    var arc = d3.svg.arc()
      .innerRadius(conf.innerRadius)
      .outerRadius(conf.outerRadius);

    var pie = d3.layout.pie()
      .value(function(d) { return d.age });

    var arcs = g.selectAll('g.slice')
      .data(pie)
      .enter()
        .append('g')
        .attr('class','slice');

    arcs.append('path')
      .attr('fill', function(d) { return conf.color(d.data[conf.colorBy]); })
      .attr('d', arc);

    d3.select(window).on('resize', resize);

    function resize() {
      conf.width = svg.style('width').replace('px','') - (margin.left + margin.right);
      conf.height = svg.style('height').replace('px','') - (margin.top + margin.bottom);
    }
  }

  return chart;
}