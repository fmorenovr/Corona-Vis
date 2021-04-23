import React from 'react';

import D3LineChart from "./D3LineChart"
import "./LineChart.css"
import 'bootstrap/dist/css/bootstrap.min.css';

var lineChartPlot;

export default class LineChart extends React.Component {

	componentDidMount(){
		var endDomain = new Date()
		endDomain.setDate(this.props.last.date.getDate());

		var daily_case = this.props.data.map(function(item, i, data){
			if(i == 0 )
				return {date: item.date, value: 0};
			else{
				return {date: item.date, value: item.value - data[i-1].value};
			}
		})
		lineChartPlot = D3LineChart("#linePlot", this.props.data, this.props.timeLineData, daily_case, endDomain, this.props.projection);
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
		lineChartPlot = D3LineChart("#linePlot", this.props.data, this.props.timeLineData, daily_case, endDomain, this.props.projection);
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