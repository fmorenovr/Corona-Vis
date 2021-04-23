import * as d3 from "d3";

//export default function D3ScatterMediumPlot (containerSelector, data) {
export default function D3LineChart (idSelector, dataset, getNewRegionData) {
	// set the dimensions and margins of the graph
var margin = {top: 20, right: 45, bottom: 40, left: 80},
    width = window.innerWidth * 0.3  - margin.left - margin.right,
	height = window.innerHeight * 0.45 - margin.top - margin.bottom;
	

var font_size = 9

// append the svg object to the body of the page
var svg = d3.select(idSelector)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Add X axis
var x = d3.scaleLinear()
	.domain([0, d3.max(dataset, function(d){ return d.exits }) + 20])
	.range([ 0, width]);
	svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))
	.selectAll("text")
	  .attr("transform", "translate(-10,0)rotate(-45)")
	  .style("text-anchor", "end")
	  .attr("font-family", "sans-serif")
      .attr("font-size", font_size);

// Y axis
var y = d3.scaleBand()
	.range([ 0, height ])
	.domain(dataset.map(function(d) { return d.name; }))
	.padding(.1);
	svg.append("g")
	.call(d3.axisLeft(y))
	.selectAll("text")
	  .attr("font-family", "sans-serif")
      .attr("font-size", font_size);


//Bars
var bars = svg.selectAll("myRect")
	.data(dataset)
	.enter()
	.append("rect")
	.attr("x", x(0) + 1 )
	.attr("y", function(d) { return y(d.name); })
	.attr("width", function(d) { return x(d.exits); })
	.attr("height", y.bandwidth() )
	.attr("fill", "#6db8d7")
	.on("click", function(d) {
		getNewRegionData(d)
	})
	.on("mouseover", function(d, i, rects) {
		d3.select(this)
			.transition()
			.duration(1000)
			.attr("stroke", "#000000")
      		.style("stroke-width", .05)
			//.attr("fill", "#000000");
	})
	.on("mouseout", function(d) {
		d3.select(this)
			.transition()
			.duration(500)
			.attr("stroke", "#6db8d7")
			.style("stroke-width", .0)
			.attr("fill", "#6db8d7");
	  });

svg.append("g")
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", font_size)
    .selectAll("text")
    .data(dataset)
    .join("text")
      .attr("x", d => x(d.exits) + 5)
      .attr("y", (d, i) => y(d.name) + y.bandwidth() / 2 )
      .attr("dy", "0.35em")
      .text(d => d.exits);

// .attr("x", function(d) { return x(d.Country); })
// .attr("y", function(d) { return y(d.Value); })
// .attr("width", x.bandwidth())
// .attr("height", function(d) { return height - y(d.Value); })
// .attr("fill", "#69b3a2")

}