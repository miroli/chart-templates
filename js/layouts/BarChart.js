var PejlCharts = PejlCharts || {};

// The charts
PejlCharts.BarChart = function() {
  var div = d3.select("body").append("div")   
      .attr("class", "tooltip")
      .style("opacity", 0);

  var margin = {top: 20, right: 20, bottom: 30, left: 40};

  var conf = {
    data: [],
    distribution: '',
    value: '',
    color: d3.scale.category10(),
    colorBy: '',
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
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('class', 'pejl-barchart');

    var x = d3.scale.ordinal()
      .domain(conf.data.map(function(d) { return d[conf.distribution]; }))
      .rangeRoundBands([0, conf.width]);

    var y = d3.scale.linear()
      .domain([0, d3.max(conf.data, function(d) { return +d[conf.value]; })])
      .range([conf.height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    var xAxisG = g.append('g')
      .attr('transform', 'translate(0,' + (conf.height + 2) + ')')
      .attr('class', 'x axis')
      .call(xAxis);

    var yAxisG = g.append('g')
      .attr('class', 'y axis')
      .call(yAxis);
      
    yAxisG.append('text')
      .attr({
        'transform': 'rotate(-90)',
        'font-size': '150%',
        'x': -5,
        'y': 5,
        "dy": ".91em",
        'text-anchor': 'end'
      })
      .text('Ålder');

    var bars = g.selectAll('.bar')
      .data(conf.data)
      .enter().append('rect')
      .attr({
        'class': 'bar',
        'x': function(d) { return x( d[conf.distribution] ); },
        'y': function(d) { return y( d[conf.value] ); },
        'width': x.rangeBand(),
        'height': function(d) { return conf.height - y( d[conf.value] ); },
        'fill': function(d) { return conf.color( d[conf.colorBy] ); }
      })
      .on('mousemove', function(d) { 
        d3.select(this).style('opacity', 0.8);
        div
          .style('opacity', 1)
          .html(d[conf.distribution])
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
      })
      .on('mouseout', function() { 
        d3.select(this).style('opacity', 1);
        div
          .style('opacity', 0);
      })

    var labels = g.selectAll('.bar-label')
      .data(conf.data)
      .enter().append('text')
      .attr({
        'class': 'bar-label',
        'fill': '#fff',
        'font-size': '150%',
        'text-anchor': 'middle',
        'x': function(d) { return x( d[conf.distribution] ) + (x.rangeBand() / 2); },
        'y': function(d) { return y( d[conf.value] ); },
        'dy': '1em'
      })
      .text(function(d) { return d[conf.value]; });

    d3.select(window).on('resize', resize);

    function resize() {
      conf.width = svg.style('width').replace('px','') - (margin.left + margin.right);
      conf.height = svg.style('height').replace('px','') - (margin.top + margin.bottom);

      conf.width < 600 ? conf.height = conf.height - 50 : conf.height = conf.height;

      x.rangeRoundBands([0, conf.width]);
      y.range([conf.height, 0]);

      xAxisG
        .attr('transform', 'translate(0,' + conf.height + ')')
        .call(xAxis)
        .selectAll('text')
          .style('text-anchor', function() {
            return conf.width < 600 ? 'end' : 'middle';
          })
          .attr('transform', function() {
            return conf.width < 600 ? 'rotate(-50),translate(-10,0)' : 'rotate(0)';
          });

      yAxisG
        .call(yAxis);

      bars
        .attr('x', function(d) { return x( d[conf.distribution] ); })
        .attr('y', function(d) { return y( d[conf.value] ); })
        .attr('width', x.rangeBand())
        .attr('height', function(d) { return conf.height - y( d[conf.value] ); });

      labels
        .attr('x', function(d) { return x( d[conf.distribution] ) + (x.rangeBand() / 2.3); })
        .attr('y', function(d) { return y( d[conf.value] ); })
    }
  }

  return chart;
}