//d3.select('.chart-popCng').style("background-color", "yellow");

var dimB = parseInt(d3.select(".barbox").style("width")),
	widthB = dimB - margin.left - margin.right,
    heightB = 40;

// set the ranges
var x = d3.scaleLinear().rangeRound([0, widthB]);
var y = d3.scaleLinear().range([heightB, 0]);


d3.csv("data/acprural.csv", function(error, data) {
  if (error) throw error;


function scatter(namez) {
  xAxis =  d3.axisBottom(x)
            .ticks(5)
            .tickFormat(function(d, i) {
              if(namez == 'houseBuilt') {
                  return d;
              } else if ((i == 0 && namez == 'medHome') || (i == 0 && namez == 'hhIncome')) {
                  return '$' + d + 'k';
              } else if (namez == 'popCng' || namez == 'miles' || namez == 'hhIncome' || namez == 'medHome') {
                  return d + 'k';           
              } else if (i == 0) {
                  return d + '%';
              }
              return d;
            });
          

   // format the data
  data.forEach(function(d) {
  	  d.color = d.color;
  	  d.type = +d.type;
      d[namez] = +d[namez];
  });

  var svg = d3.select(".chart-" + namez).append("svg")
    .attr("width", widthB + margin.left + margin.right)
    .attr("height", heightB + margin.top + margin.bottom)
  	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  x.domain([d3.min(data, function(d) { return d[namez]; }), d3.max(data, function(d) { return d[namez]; })]);
  y.domain(0);

  //console.log(x.domain());

  svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("id", function(d) { return "county" + d.id; }) 
    .attr('class', 'ctyRect')
    .attr("fip", function(d) { return d.id; })
    .attr('ctyType', function(d) {return d.type })
    .attr("r", 5)
    .attr("x", function(d) { return x(d[namez]); })
    .attr("y", 0)
    .attr('height', '20px')
    .attr('width', '2px')
    .style("fill", '#ccc') //function(d) { return d.color }
    .style('opacity', 0.2)

  // Add the X Axis
  svg.append("g")
    .attr("transform", "translate(0,30)")
    .call(xAxis).select(".domain").remove();

 };

 scatter('popCng');
 scatter('nhWhite');
 scatter('health');
 scatter('someColl');
 scatter('uninsured');
 scatter('hhIncome');
 scatter('miles');
 scatter('houseBuilt');
 scatter('medHome');

});
