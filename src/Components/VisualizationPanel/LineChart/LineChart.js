import React from 'react';

import D3LineChart from "./D3LineChart"
import "./LineChart.css"
import 'bootstrap/dist/css/bootstrap.min.css';

import * as d3 from 'd3'
import * as dep_cases from "../../Variables"

let data_history_department = dep_cases.default.data_history_department;

var lineChartPlot;

export default class LineChart extends React.Component {

	componentDidMount(){
	  var total_confirmados = d3.sum(data_history_department, function(it){ return it.exits})
		var endDomain = new Date()
		endDomain.setDate(this.props.last.date.getDate());

		var daily_case = this.props.data.map(function(item, i, data){
			if(i == 0 )
				return {date: item.date, value: 0};
			else{
				return {date: item.date, value: item.value - data[i-1].value};
			}
		})
		lineChartPlot = D3LineChart("#linePlot", this.props.data, this.props.timeLineData, daily_case, endDomain, this.props.projection, "Peru", total_confirmados);
    }

    componentDidUpdate(){
		  var endDomain = new Date()
		  endDomain.setDate(this.props.last.date.getDate() );

		  var daily_case = this.props.data.map(function(item, i, data){
			  if(i == 0 )
				  return {date: item.date, value: 0};
			  else{
				  return {date: item.date, value: item.value - data[i-1].value};
			  }
		  })
		  lineChartPlot = D3LineChart("#linePlot", this.props.data, this.props.timeLineData, daily_case, endDomain, this.props.projection, this.props.nameRegion, this.props.totalData);
    }

    handleChangeForm = (event) => {
    	this.props.handleChangeState(event.target.name, parseInt(event.target.value == "" ? 0 : event.target.value))
    }

	render(){
		//alert("@")
        return (
            <div className="box-line-anomaly" >
            	<div className="legend-box" id="legend"></div>
            	
                <div id="linePlot"></div>
            </div>
        )
    }
}

/**
 * 
 * <div className="menu-box" id="menu">
            		<input 
            			type="number" 
            			className="form-control prediccion-input"
            			name="proyection_num"
            			 onChange={ this.handleChangeForm }
            			 value={ this.props.proyection_num }
            		/>
            	</div>
 */
