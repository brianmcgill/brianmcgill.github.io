function bringToFront(evt) {
    var element = evt.target; //get node reference
    element.parentNode.appendChild(element); //appendChild after the last child
}  

var margin = {top: 20, right: 30, bottom: 40, left: 165},
    dim = Math.min(parseInt(d3.select("#chart").style("width")), parseInt(d3.select("#chart").style("height"))),
    width = dim - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var x = d3.scaleLinear().rangeRound([0, width]);

var y = d3.scaleBand().rangeRound([height, 0]);

//var r = d3.scale.linear().range([7, 18]);

var color = d3.scaleOrdinal()
      .range(['#699246','#C43B82','#7A3842','#3A2C70','#C44244','#3A9C9B','#EACD3F','#1F8FBA','#F08031','#ABBF48','#86563E','#82477F','#457A59','#2E547A','#FCB93A']);

var xAxis = d3.axisBottom(x).ticks(5)
      .tickFormat(function(d, i) {
        if (i == 0) {
            return d + '%';
        }
        return d;
      });

var yAxis = d3.axisLeft(y);

var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function pctDecimal(num) {
  return Math.round(num *10)/10 //+"%"
}

const addCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<div><strong style='color: #fff; line-height:1.4;'>" + d.countyname + ", " + d.state + "</strong></div>" + 
        "<span style='font-size:12px; line-height:1.4;'>" + 'Uninsured Rate: ' + pctDecimal(d.uninsured) + '%</span>' ;
      })

svg.call(tip);

d3.csv("data/acpdata.csv", function(error, data) {
  if (error) throw error;

  //var subset = data.filter(function(el){return el.Metric === 'Cost'});

  data.forEach(function(d) {
    d.fips = +d.fips
    d.type = +d.type
    d.color = d.color
    d.typename = d.typename
    d.obesity = +d.obesity
    d.uninsured = +d.uninsured
    d.death = +d.death
    d.childpoverty = +d.childpoverty
    d.longcommute = +d.longcommute
    d.college = +d.college
    d.income = +d.income
    d.nhwhite = +d.nhwhite
    d.mental = +d.mental
    d.foodinsecure = +d.foodinsecure
    d.healthfood = +d.healthfood
    d.singleparent = +d.singleparent;
  });

  d3.csv("data/acpaverage.csv", function(error, avg) {

    avg.forEach(function(d) {
      d.type = +d.type
      d.typename = d.typename
      d.obesity = +d.obesity
      d.uninsured = +d.uninsured
      d.death = +d.death
      d.childpoverty = +d.childpoverty
      d.longcommute = +d.longcommute
      d.college = +d.college
      d.income = +d.income
      d.nhwhite = +d.nhwhite
      d.mental = +d.mental
      d.foodinsecure = +d.foodinsecure
      d.healthfood = +d.healthfood
      d.singleparent = +d.singleparent;
    });

  //create search box
  d3.select('#combobox').selectAll('.option')
      .data(data).enter()
      .append("option")
      .attr('value', function(d) {return d.fips; })
      .text(function(d) {return d.countyname + ', ' + d.state; })
      .sort(function(a,b) {return d3.ascending(a.state, b.state) || d3.ascending(a.countyname, b.countyname); })

  //create axises
  x.domain([0, d3.max(data, function(d) { return d.uninsured; })]);
  y.domain(data.map(function(d) { return d.typename; }));
  //r.domain(d3.extent (subset, function (d)  {return d.TotalValue;}));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  //create county circles
  const circles = svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")

      circles.attr("class", "dot")
      .attr("data-slug", function(d) { return d.fips  }) //to connect search box
      .attr("r", 6)
      .attr("cx", function(d) { return x(d.uninsured); })
      .attr("cy", function(d) { return y(d.typename); })
      .style("fill", function(d) {return '#' + d.color; })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  //create average lines
  const rect = svg.selectAll('.blackrect')
      .data(avg)
      .enter().append("rect")

      rect.attr('class', 'avgz')
      .attr('x', function(d) { return x(d.uninsured)-1; })
      .attr('y', function(d) { return y(d.typename)-10; })
      .attr('height', '20px')
      .attr('width', '4px')

  //button transitions
  function btnTrans(hed, cat) {

    d3.select("#" + cat + "-btn").on("click",function(e) {

      d3.select(".hed").text(hed)

      x.domain([d3.min(data, function(d) { return d[cat]; }), d3.max(data, function(d) { return d[cat]; })]); 
      xAxis = d3.axisBottom(x).ticks(5).tickFormat(function(d, i) {
        if(i == 0 && cat == 'income') {
            return '$' + d + 'k';
        } else if (i == 0 && cat == 'death') {
            return d + 'k';
        } else if (i == 0) {
            return d + '%';
        }
        return d;
      });

      const delay = function(d, i) { return i * 0.2; };
      const duration = 1300;

      svg.selectAll(".x.axis")
        .transition()
        .duration(duration)
        .call(xAxis);

      circles.transition()
        .duration(duration)
        .delay(delay)
        .ease(d3.easeElastic)
        .attr("cx", function(d) { return x(d[cat]); })
        .style('visibility', function(d){ if (d[cat] == 0) { return 'hidden'; } else { return 'visible'; } }) 

      rect.transition()
        .duration(duration)
        .delay(delay)
        .ease(d3.easeElastic)
        .attr("x", function(d) { return x(d[cat]); })   

      tip.html(function(d) {
        if (cat == 'income') { 
           return "<div><strong style='color: #fff; line-height:1.4;'>" + d.countyname + ", " + d.state + "</strong></div>" + 
          "<span style='font-size:12px; line-height:1.4;'>" + 'Median HH Income: $' + addCommas(d.income*1000) + '</span>' ;
        } else if (cat == 'death') {
          return "<div><strong style='color: #fff; line-height:1.4;'>" + d.countyname + ", " + d.state + "</strong></div>" + 
          "<span style='font-size:12px; line-height:1.4;'>"  + addCommas(pctDecimal(d.death*1000)) + ' years of potential life lost per 100k people</span>' ;
        } else {
          return "<div><strong style='color: #fff; line-height:1.4;'>" + d.countyname + ", " + d.state + "</strong></div>" + 
          "<span style='font-size:12px; line-height:1.4;'>" + hed + ': ' + pctDecimal(d[cat]) + '%</span>' ;
        }
      })

      
    });   
  };

  //call buttons
  btnTrans("Uninsured Rate", "uninsured");
  btnTrans("Obesity Rate","obesity");
  btnTrans("Premature Deaths per 100k People","death");
  btnTrans("Children in Poverty","childpoverty");
  btnTrans("Commute Over 30 Minutes","longcommute");
  btnTrans("Children in Single-Parent Homes","singleparent");
  btnTrans("Median Household Income","income");
  btnTrans("People with Some College","college");
  btnTrans("Non-Hispanic White","nhwhite");
  btnTrans("Has Frequent Mental Distress","mental");
  btnTrans("Food Insecurity","foodinsecure");
  btnTrans("Limited Access to Healthy Food","healthfood");

  //search
  $('.combobox').combobox()

  //adds, removes searched circles
  function removeCircStyle() { 
    d3.selectAll('circle')
      .classed("selected", false)
      .style('stroke', null).style('opacity', 0.15);
  };

  $('input[type="hidden"]').change(function(){
    var ctySlug = $(this).val();
    removeCircStyle();
    d3.selectAll('circle[data-slug="' + ctySlug + '"]')
      .classed("selected", true)
      .style('stroke', '#222').style('stroke-width', 2).style('opacity', 1)
      .each(function(d,i) { 
                     var evt = { target: this};
                     bringToFront(evt);
                  });;
  });

  d3.select('.combobox-clear').on('click', removeCircStyle)

})


function resize() {

  var dim = Math.min(parseInt(d3.select("#chart").style("width"))),
  width = dim - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

  console.log(dim);

  x.domain([0, d3.max(data, function(d) { return d.uninsured; })]);
 

  // Update the range of the scale with new width/height
  x.range([0, width]);
  y.range([height, 0]);

  // Update the axis and text with the new scale
  svg.select('.x.axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.select('.x.axis').select('.label')
      .attr("x",width);

  svg.select('.y.axis')
    .call(yAxis);

  // Update the tick marks
  xAxis.ticks(dim / 75);
  yAxis.ticks(dim / 75);

  d3.select(".hed").text("Uninsured Rate")

  // Update the circles
  //r.range([dim / 90, dim / 35])

  svg.selectAll('.dot')
    .attr("r", 6)
    .attr("cx", function(d) { return x(d.uninsured); })
    .attr("cy", function(d) { return y(d.typename); })

  svg.selectAll('.avgz')
    .attr("x", function(d) { return x(d.uninsured)-1; })
    .attr("y", function(d) { return y(d.typename)-10; })
}

//d3.select(window).on('resize', resize);
//resize();

});