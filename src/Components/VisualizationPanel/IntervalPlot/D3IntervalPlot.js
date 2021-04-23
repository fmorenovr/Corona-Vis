import * as d3 from "d3";
import dataFile from "./data.csv"

//export default function D3ScatterMediumPlot (containerSelector, data) {

var dataFile2 = d3.csv(dataFile)

export default function D3IntervalPlot (idSelector, intervalLineData) {

    var margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = window.innerWidth * 0.3  - margin.left - margin.right,
        height = window.innerHeight * 0.3 - margin.top - margin.bottom;

    d3.select(idSelector).html("")

    // append the svg object to the body of the page
    var svg = d3.select(idSelector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

            
    var x = d3.scaleLinear()
        .domain([-0.1, d3.max(intervalLineData, function(d){return d.order})  ])
        .range([ 0, width ]);
    
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(intervalLineData, function(d){return d.High_90}) + 1 ])
        .range([ height, 0 ]);
    
        svg.append("g")
        .call(d3.axisLeft(y));


        //console.log(intervalLineData)

        svg.append("path")
            .datum(intervalLineData)
            .attr("fill", "#cce5df")
            .attr("stroke", "none")
            .attr("d", d3.area()
            .x(function(d) { return x(d.order) })
            .y0(function(d) { return y(d.Low_90) })
            .y1(function(d) { return y(d.High_90) })
            )

        svg.append("path")
            .datum(intervalLineData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.order) })
                .y(function(d) { return y(d.ML) })
                .curve(d3.curveMonotoneX) 
            )

    
      
}