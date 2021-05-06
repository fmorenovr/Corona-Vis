import * as d3 from "d3";

//export default function D3ScatterMediumPlot (containerSelector, data) {
export default function D3LineChart (idSelector, dataset, timeLineData, daily_case, endDomain, projection, name_region) {

	//var margin = {top: 30, right: 50, bottom: 60, left: 70}
	//  , width = window.innerWidth * 0.7 - margin.left - margin.right // Use the window's width 
	//  , height = window.innerHeight * 0.3 - margin.top - margin.bottom; // Use the window's height
	
	var margin = {top: 20, right: 20, bottom: 40, left: 60},
	  width = window.innerWidth * 0.7  - margin.left - margin.right,
	  height = window.innerHeight * 0.3 - margin.top - margin.bottom;

	// The number of datapoints
	

	// 5. X scale will use the index of our data
	//var xScale = d3.scaleLinear()
	//    .domain([0, dataset.length + 1]) // input
	//    .range([0, width]); // output

	d3.select(idSelector).html("")
	d3.select("#legend").html("")

	//console.log(endDomain)
	//console.log(new Date(2020, 2, 18, 0, 0))

	var xScale = d3.scaleTime()
	    .domain([new Date(2020, 2, 6, 0, 0), endDomain])
	    .range([0, width]);


	var parseTime = d3.timeParse("%d/%b/%y %I:%M");
	// 6. Y scale will use the randomly generate number 
	var yScale = d3.scaleLinear()
	    //.domain([0, d3.max(dataset, function(d){return d.value}) + 10 ]) // input 
	    .domain([0, d3.max(timeLineData, function(d){return parseInt(d[2]) }) + 10 ])
	    .range([height, 0]); // output 

	var div = d3.select("body").append("div")
            .attr("class", "tooltip-line")
            .style("opacity", 0);


    var formatTime = d3.timeFormat("%b %d");

	


	// 1. Add the SVG to the page and employ #2
	var svg = d3.select(idSelector).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// 3. Call the x axis in a group tag
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

	// 4. Call the y axis in a group tag
	svg.append("g")
	    .attr("class", "y axis")
	    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

	function make_x_gridlines() {		
    	return d3.axisBottom(xScale).ticks(20)
	}
	function make_y_gridlines() {		
    	return d3.axisLeft(yScale).ticks(10)
	}
	svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
    )
	// add the Y gridlines
  	svg.append("g")			
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
      )


     /* Daily Cases */
	var line_daily = d3.line()
	    .x(function(d) { return xScale(d[1]); }) // set the x values for the line generator
	    .y(function(d) { return yScale(d[2]); }) // set the y values for the line generator 
	    .curve(d3.curveMonotoneX)

	svg.append("path")
	    .datum(timeLineData) // 10. Binds data to the line 
	    .attr("class", "lineDaily") // Assign a class for styling 
	    .attr("d", line_daily);

	svg.selectAll(".dotDaily")
	    .data(timeLineData)
	  .enter().append("circle") // Uses the enter().append() method
	    .attr("class", "dotDaily") // Assign a class for styling
	    .attr("cx", function(d) { return xScale(d[1]); })
	    .attr("cy", function(d) { return yScale(d[2]); })
	    .attr("r", 4)
	      .on("mouseover", function(d) { 
	  			div.transition()
                  .duration(200)
                  .style("opacity", .9);
                div.html(
                    
                    formatTime(d[1])  + "</br>" + d[0] +"</br> Confirmados por día: " + parseInt(d[2])
                )
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
			})
	      .on("mouseout", function() {
	      	div.transition()
                  .duration(500)
                  .style("opacity", 0);
	      })



	/* Proyeccion */
		  /*
	var line = d3.line()
	    .x(function(d) { return xScale(d.date); }) // set the x values for the line generator
	    .y(function(d) { return yScale(d.value); }) // set the y values for the line generator 
	    .curve(d3.curveMonotoneX) // apply smoothing to the line

	// 9. Append the path, bind the data, and call the line generator 
	svg.append("path")
	    .datum(projection) // 10. Binds data to the line 
	    .attr("class", "line-pro") // Assign a class for styling 
	    .attr("d", line);

	svg.selectAll(".dot-pro")
	    .data(projection)
	  .enter()
	  	.append("circle") // Uses the enter().append() method
	    .attr("class", "dot-pro") // Assign a class for styling
	    .attr("cx", function(d) { return xScale(d.date); })
	    .attr("cy", function(d) { return yScale(d.value); })
	    .attr("r", 5)
	      .on("mouseover", function(d) { 
	      	//console.log(projection[1])
	  			div.transition()
                  .duration(200)
                  .style("opacity", .9);
                div.html(
                    
                    formatTime(d.date) + "</br> Predicción: " + parseInt(d.value)
                )
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
			})
	      .on("mouseout", function() {
	      	div.transition()
                  .duration(500)
                  .style("opacity", 0);
	      })

		  */
     /* CONfirmados */
	/*
	// 7. d3's line generator
	var line = d3.line()
	    .x(function(d) { return xScale(d.date); }) // set the x values for the line generator
	    .y(function(d) { return yScale(d.value); }) // set the y values for the line generator 
	    .curve(d3.curveMonotoneX) // apply smoothing to the line

	// 9. Append the path, bind the data, and call the line generator 
	svg.append("path")
	    .datum(dataset) // 10. Binds data to the line 
	    .attr("class", "line") // Assign a class for styling 
	    .attr("d", line); // 11. Calls the line generator 



	// 12. Appends a circle for each datapoint 
	svg.selectAll(".dot")
	    .data(dataset)
	  .enter().append("circle") // Uses the enter().append() method
	    .attr("class", "dot") // Assign a class for styling
	    .attr("cx", function(d) { return xScale(d.date); })
	    .attr("cy", function(d) { return yScale(d.value); })
	    .attr("r", 5)
	      .on("mouseover", function(d) { 
	  			div.transition()
                  .duration(200)
                  .style("opacity", .9);
                div.html(
                    
                    formatTime(d.date) + "</br> Confirmados: " + parseInt(d.value) + "</br> Descartados: " + d.descartados
                )
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
			})
	      .on("mouseout", function() {
	      	div.transition()
                  .duration(500)
                  .style("opacity", 0);
	      })

	*/



	/* Legend */
	var keys = [ {name: "Casos Diarios: "+name_region, color: "#83bbad"}]
	
	var legend_svg = d3.select("#legend")
		.append("svg")
		.attr("width", 195)
	    .attr("height", 25)

	var legend = legend_svg.selectAll('.legend')                     // NEW
          .data(keys)                                   // NEW
          .enter()                                                // NEW
          .append('g')                                            // NEW
          .attr('class', 'legend')                                // NEW
          .attr('transform', function(d, i) {                     // NEW   // NEW
            var horz = 0;                       // NEW
            var vert = 5 + i * 20;                       // NEW
            return 'translate(' + horz + ',' + vert + ')';        // NEW
          });                                                     // NEW

        legend.append('rect')                                     // NEW
          .attr('width', 10)                          // NEW
          .attr('height', 10)                         // NEW
          .style('fill', function(d) { return d.color })                                   // NEW
          .style('stroke', function(d) { return d.color });                                // NEW
          
        legend.append('text')                                     // NEW
          .attr('x', 15)              // NEW
          .attr('y', 10 )              // NEW
          .text(function(d) { return d.name; }); 
	

}
