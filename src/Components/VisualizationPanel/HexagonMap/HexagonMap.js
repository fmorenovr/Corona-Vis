import React from 'react';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core'
import {View} from '@deck.gl/core'

import {GeoJsonLayer} from '@deck.gl/layers';
//import chroma from 'chroma-js';
import * as d3 from 'd3'

import {StaticMap} from 'react-map-gl';

import {ScatterplotLayer} from '@deck.gl/layers';

import "./HexagonMap.css"

import dataDistrito from "./distrito.json"
//import dataDistrito from "./test.json"


// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoid3p1bmlnYSIsImEiOiJjazcwdGhnbjcwMHBuM2xsOXJmZWp0YzYwIn0.8GEV3zUu8yiT2xsLzYBwJw';

// Initial viewport settings
const initialViewState = {
    longitude: -67.824474,
    latitude: -13.858777,
    zoom: 4.5,
    pitch: 0,
    bearing: 0,
};


const getFillColor = async(value) => {
    //console.log(value)
    let val = await this.props.intervalsDistricData
    //console.log(val)
    var color = d3.interpolateReds(Math.random())
    var values = color.substring(4, color.length - 1);
    values = values.split(",");
    values[0] = parseInt(values[0])
    values[1] = parseInt(values[1])
    values[2] = parseInt(values[2])
    return values;
    
}


export default class HexagonMap extends React.Component {

    state = {
		data: dataDistrito //d3.json(dataDistrito)
    }
      
    getRadius = (d) => {
        if (d.exits == 0 ) return 0;
        //var ans = Math.log10( d.exits + 1 ) * 4000 * 6
        var ans = Math.log10( d.exits + 1 ) * 20000
        return ans
    }

    getRadiusWorld = (d) => {
        if (d.Confirmed == 0 ) return 0;
        if (d["Country_Region"] == "Peru" ) return 0;
        var ans = Math.log10( d.Confirmed ) * 40000
        //var ans = d.Confirmed * 100
        //console.log(ans)
        return ans
    }

    setTooltip = (object, x, y) => {
        const el = document.getElementById('tooltip');
        if (object) {
          el.innerHTML = "<b>" + object.name + "</b></br> Confirmados: " + object.exits;
          el.style.display = 'block';
          el.style.left = x + 'px';
          el.style.top = y + 'px';
        } else {
          el.style.display = 'none';
        }
    }

    setTooltipWorld = (object, x, y) => {
        const el = document.getElementById('tooltip');
        if (object) {
          el.innerHTML = "<b>" + object["Combined_Key"] 
                            + "</b></br> Confirmados: " + object.Confirmed + "</br>"
                            + " Muertes: " + object.Deaths + "</br>"
                            + " Recuperados: " + object.Recovered + "</br>"
                            + " Actualizado: " + object.Last_Update + "</br>"
          el.style.display = 'block';
          el.style.left = x + 'px';
          el.style.top = y + 'px';
        } else {
          el.style.display = 'none';
        }
    }

    
    

    componentDidUpdate(){
        this.plotLegend();
    }

    componentDidMount(){
        this.plotLegend();
    }

    plotLegend(){
        d3.select("#legendMap").html("")

        var svg1 = d3.select("#legendMap")
            .append("svg")
            .attr("width", 240)
            .attr("height", 60)
            .append("g")

        var legendRectSize = 20
        var lengthLegend = 8
        var maxValue = 6
        var lengthData = []

        //for(var i = 0; i <= lengthLegend; i++)
        //    lengthData.push({data: d3.interpolateRdBu(i/lengthLegend), text: parseInt( parseInt(100) * (-1 + i * (2) / lengthLegend )) })
        for(var i = 0; i <= lengthLegend; i++)
            lengthData.push({data: d3.interpolateReds(i/lengthLegend), text:  i * maxValue/lengthLegend  })

        //console.log(lengthData)

            var legend = svg1.selectAll('.legend')
                .data(lengthData)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .style("border-style", "groove")  
                .attr('transform', function(d, i) {
                    var horz = 20 + i * 21;
                    var vert = 30 ;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', 10)
                .style('fill', function(d, i){
                    return d.data
                })
            
            legend.append('text')
                .attr('x', function(d){
                    if(d.text == 0) return 8;
                    if(d.text > 0) return 4;
                    return 0;
                })
                .attr('y', 25)
                .text(function(d, i){
                    return d.text;
                })
                .style('font-size', "9px");
            
            svg1.append('text')
                .attr('x', 10)
                .attr('y', 10)
                .text("Legenda")
                .attr('transform', function(d, i) {
                    return 'translate(' + 0 + ',' + 10 + ')';
            });

    }

    getFillColorRandom(value){
        //console.log("###$$$")
        //console.log(value)
        var name = value.properties.NOMBDIST

        //var color = d3.interpolateReds(Math.random())
        var color = d3.interpolateReds(0)
        //console.log(this.props.finalData)
        if(this.props.finalData.length != 0){
            var last = 0
            var i = 0
            this.props.finalData.map(function(item){
				if (item.state == name){
                    last = parseInt(item.ML)
                    i++
				}
            })
            //console.log(last / 6.0)
            color = d3.interpolateReds(last / 6.0)
            if (i < 20)
                color = d3.interpolateReds(0)
        }

        var values = color.substring(4, color.length - 1);
        values = values.split(",");
        values[0] = parseInt(values[0])
        values[1] = parseInt(values[1])
        values[2] = parseInt(values[2])
        return values;
        
    }

    render() {
        
        //var data = this.props.data
        //const layer = new ScatterplotLayer({
        //    id: 'scatterplot-layer',
        //    data,
        //    pickable: true,
        //    opacity: 0.5,
        //    stroked: true,
        //    filled: true,
        //    //radiusScale: 6,
        //    //radiusMinPixels: 1,
        //    //radiusMaxPixels: 100,
        //    lineWidthMinPixels: 1,
        //    getPosition: d => d.coordinates,
        //    getRadius: this.getRadius,
        //    //getFillColor: d => [255, 0, 0],
        //    getFillColor: d => [51, 169, 211],
        //    getLineColor: d => [255, 255, 255],
        //    onHover: info => this.setTooltip(info.object, info.x, info.y)
        //});
        //data = this.props.dataWorld
        //const layer_world = new ScatterplotLayer({
        //    id: 'world',
        //    data,
        //    pickable: true,
        //    opacity: 0.5,
        //    stroked: true,
        //    filled: true,
        //    //radiusScale: 6,
        //    //radiusMinPixels: 1,
        //    //radiusMaxPixels: 100,
        //    lineWidthMinPixels: 1,
        //    getPosition: d => [parseFloat(d.Long_), parseFloat(d.Lat)],
        //    getRadius: this.getRadiusWorld,
        //    getFillColor: d => [255, 0, 0],
        //    getLineColor: d => [255, 255, 255],
        //    onHover: info => this.setTooltipWorld(info.object, info.x, info.y)
        //});

        //console.log(this.state.data)
        var data = this.state.data;
        
        const layer = new GeoJsonLayer({
            id: 'geojson-layer'+this.props.finalData,
            data,
            opacity: 0.2,
            pickable: true,
            stroked: true,
            filled: true,
            //lineWidthScale: 200,
            //lineWidthMinPixels: 200,
            //getFillColor: f => getFillColor(f),
            getFillColor: f => this.getFillColorRandom(f),
            //getLineColor: d => colorToRGBArray(d.properties.color),
            getLineColor: [255, 255, 255],
            //getRadius: 100,
            getLineWidth: 100,
            onClick: ({object, x, y}) => {
                if (object){
                    const tooltip = object.properties;
                    //console.log(tooltip)
                    this.props.getNewDistrictData(object.properties)
                }
            }
          });

        return (
            <div>
                <div id="tooltip" className="Tooltip-map" ></div>
                <DeckGL
                    initialViewState={initialViewState}
                    controller={true}
                    //height="100%"
                    //layers={[layer, layer_world]}
                    layers={[layer]}
                >   
                        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
                </DeckGL>

            </div>
        );
    }
}
//<View id="mini-map" controller={true} >
//<StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
//</View>