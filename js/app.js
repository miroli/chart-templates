// Extend D3
d3.scale.pejl5 = d3.scale.ordinal().range(['#008EBD','#EA6899','#F02A09','#0ACA91','#EDE481']);
d3.scale.pejlSignals = d3.scale.ordinal().range(['#079100','#C3CE0F','#F49D06','#FF5A00','#B60C0C']);
d3.scale.kuler = d3.scale.ordinal().range(['#B6D0F2','#307367','#025940','#F2EAE4','#F25E3D']);

var svg = d3.select('#chart')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%');

// Instantiate a new Pejlchart
d3.csv('data.csv', function(data) {
  // var barChart = PejlCharts.BarChart()
  //  .data(data)
  //  .distribution('name')
  //  .value('age')
  //  .color(d3.scale.category20())
  //  .colorBy('name');

  // barChart(svg);

  var pieChart = PejlCharts.PieChart()
    .data(data)
    .outerRadius(150)
    .innerRadius(100)
    .color(d3.scale.kuler)
    .colorBy('name');

  pieChart(svg);
});