$(document).ready(function(){

var h = 550;
var w = 970;
var padding = 30;
var URLjson = "js/bachtowns.json";

function zIndex(evt) {
    var element = evt.target; //get node reference
    element.parentNode.appendChild(element); //appendChild after the last child
  }   


        //pull in JSON
        d3.json(URLjson, function(testJson){


            //Scaling: domain = data, range = svg area
            var xScale = d3.scale.linear()
                           .domain([-1, 20])
                           .range([padding, w-padding]);
           
            var yScale = d3.scale.linear()
                             .domain([8, 60])
                             .range([h-padding, padding]);

            var rScale = d3.scale.linear()
                             .domain([0, d3.max(testJson, function(d) { 
                                return d.AREA10; 
                              })])
                             .range([0, 32]); //bigger the max, bigger the circle

            //Axis
            var xAxis = d3.svg.axis()
                          .scale(xScale)
                          .orient("bottom")
                          .ticks(5);

            var yAxis = d3.svg.axis()
                          .scale(yScale)
                          .orient("left")
                           .ticks(5);

            //simple scatter bubble chart
            var svg = d3.select("#chartContainer")  
                      .append('svg')
                      .attr("width", w)
                      .attr("height", h);
 
            var circles = svg.selectAll("circle")
                      .data(testJson)
                      .enter()
                      .append("circle");

               circles.attr("id", function(d,i) {
                                    return d.NAME
                                    })
                      .attr("data-slug", function(d,i) {
                                   return d.SLUG
                                   })
                      .attr("cx", function(d,i) {
                                    return xScale(d.ATTCHANGE)
                                    })
                      .attr("cy", function(d,i) {
                                    return yScale(d.ATT10) 
                                    })
                      .attr("r", function(d) {
                                    return rScale(d.AREA10)
                                    })
           //           .attr("onmouseover", "zIndex(evt)")
                      .on("mouseover", mouseover)
                      .on("mousemove", mousemove)
                      .on("mouseout", mouseout)

            //tooltip
            var tooltip = d3.select(".art-container")
                      .append("div")
                      .attr("id", "tooltip")
                      .attr("class", "tooltip")

            function updatePosition(event) {
                    var ttid = "#tooltip";
                    var xOffset = 10;
                    var yOffset = 10;

                    var ttw = $(ttid).width();
                    var tth = $(ttid).height();
                    var wscrY = $(window).scrollTop();
                    var wscrX = $(window).scrollLeft();
                    var curX = (document.all) ? event.clientX + wscrX : event.pageX;
                    var curY = (document.all) ? event.clientY + wscrY : event.pageY;
                    var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > $(window).width()) ? curX - ttw - xOffset * 2 : curX + xOffset;
                    if (ttleft < wscrX + xOffset) {
                        ttleft = wscrX + xOffset;
                    }
                    var tttop = ((curY - wscrY + yOffset * 2 + tth) > $(window).height()) ? curY - tth - yOffset * 2 : curY + yOffset;
                    if (tttop < wscrY + yOffset) {
                        tttop = curY + yOffset;
                    }
                    $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
                }

            //Rollover attributes
            function mouseover(d){
                                d3.select(this)
                                  .style({'stroke-width':2,'stroke':'#000'})
                                  
                                tooltip
                                  .style("visibility", "visible") 
                              };

            function mousemove(d, i){
                                tooltip
                                .style("visibility", "visible")
                                .style("top", d3.event.pageY + "px")
                                .style("left", d3.event.pageX + "px")
                                .html("<span class='tipHed'>" + d.NAME + "</span> <br> <span class='tipPop'> Population: "+ d.POP10 + " </span><br> <b>Share with bachelor's degree or higher </b><br> 1980: <b>" + d.ATT80 + "% </b> <br> 2010: <b>" + d.ATT10 + "% </b> <br> Percentage change: <b>" + d.ATTCHANGE + "% </b>")

                                 updatePosition(event);

                              };                  
                              
            function mouseout(d){
                                d3.select(this)
                                  .style({'stroke-width':1, 'stroke-opacity':.8,'stroke':'rgb(250, 166, 26)'})

                                tooltip
                                  .style("visibility", "hidden")
                              };

            //call axis
                svg.append("g")
                      .attr("class", "axis")
                      .attr("transform", "translate(0, " + (h-padding) + ")")
                      .call(xAxis);

                svg.append("g")
                      .attr("class", "axis")
                      .attr("transform", "translate(" + padding + ",0)")
                      .call(yAxis);


            //button and transitions
            var delay = function(d, i) { return i * 2; };

            $("#btn1980").click(function(e) {

              $("#textAll").hide()

               circles.transition()
                      .duration(1300)
                      .delay(delay)
                      .ease("elastic")
                      .attr("cy", function(d,i) {
                                    return yScale(d.ATT80)
                                    })

            });

            $("#btn2010").click(function(e) {

               circles.transition()
                      .duration(1300)
                      .delay(delay)
                      .ease("elastic")
                      .attr("cy", function(d,i) {
                                    return yScale(d.ATT10)
                                    })

               $("#textAll").delay(1500).show(0);

            });


              //search
              $('.combobox').combobox()


              $('input[type="hidden"]').change(function(){
               var citySlug = $(this).val();
               d3.selectAll('circle').classed("selected", false);
               d3.selectAll('circle[data-slug="' + citySlug + '"]').classed("selected", true);
              });


               //console.log(d3.max(testJson, function(d) { return d.SLUG;  }))

        })


 });