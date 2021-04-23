import React from 'react';

import D3BarChart from "./D3BarChart"
import "./BarChart.css"
//import 'bootstrap/dist/css/bootstrap.min.css';

var barChartPlot;

export default class BarChart extends React.Component {

	componentDidMount(){
		barChartPlot = D3BarChart("#barPlot", this.props.data, this.props.getNewRegionData);
    }

	render(){


		return(
			<div>
				<div className="confirm-cases">Casos confirmados por departamento</div>
				<div id="barPlot"></div>
			</div>
		)
	}
}