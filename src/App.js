import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HexagonMap from './Components/VisualizationPanel/HexagonMap/HexagonMap'
import LineChart from './Components/VisualizationPanel/LineChart/LineChart'
import BarChart from './Components/VisualizationPanel/BarChart/BarChart'
import IntervalPlot from './Components/VisualizationPanel/IntervalPlot/IntervalPlot'

import * as d3 from 'd3'


//import data_gps_worl from "./03-22-2020.csv"
//import data_world from "./COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/04-01-2020.csv"

import new_cases_department from "./preprocess/data/DEPARTAMENTO_news.csv"
import intervals_department from "./preprocess/data/DEPARTAMENTO_intervals.csv"


import new_cases_distric from "./preprocess/data/DISTRITO_news.csv"
import intervals_distric from "./preprocess/data/DISTRITO_intervals.csv"

const host_name = ""
var dataa = []

const processDataAsycn = async () => {  
	let a = await d3.csv(intervals_distric)
	return a;  
  };  

export default class App extends React.Component {
  	
  	state = {
		proyection_num: 2,

		intervalTotalData: d3.csv(intervals_department),
		newCasesDistricData: d3.csv(new_cases_distric),
		intervalsDistricData: d3.csv(intervals_distric),

		intervalsDistricData2: d3.csv(intervals_distric).then(function(values){dataa = values; return values}),


		//dictrictData: d3.csv(`http://${host_name}:8000/surface/maps/`),
		//regionData: d3.csv(`http://${host_name}:8000/surface/maps/`),

		timeLineData: [],
		intervalLineData: [],

		finalData: []
  	}
	getPredicction = (t, x_t) => {
		var n = 30*10**12; // poblacion
		var x_0 = 1; // infectado el dia t=0

		// verhulst
		function X(t, k){
		  return (n*x_0)/(x_0+(n-x_0)*Math.exp(-n*k*t));
		}

		function k(t, x_t){
		  return -1*Math.log(x_0*(n-x_t)/(x_t*(n-x_0)))/(n*t);
		}

		var k_t = k(t, x_t);

		return X(t+1, k_t);
	}

	handleChangeState = (name, value) => {
        this.setState({
            [name] : value
        })
	}
	
	getNewDistrictData = (properties) => {
		//console.log(properties.NOMBDIST.toUpperCase())
		var name = properties.NOMBDIST.toUpperCase()


		var self = this;
		var i=0

		this.state.intervalsDistricData.then(function(intervalData){

			var interval_temp = []
			intervalData.map(function(item){
				//console.log(item)
				//console.log(item.state)
				//console.log(name)
				if (item.state == name){
					item.date = new Date(item.date);
					item.order = i++;
					interval_temp.push(item)
				}
			})

			//console.log(self.state.newCasesDistricData)
			var array_temp_time_line = []
			self.state.newCasesDistricData.then(function(cases){
				
				cases.map(function(item){
					if (item.state == name){
						//console.log(item)
						var temp = []
						temp.push( item.state );
						temp.push( new Date(item.date) );
						temp.push( item.confirmed_new );
						array_temp_time_line.push(temp)
					}
				})
				//console.log("#####")
				//console.log(array_temp_time_line)
				self.setState({
					timeLineData: array_temp_time_line,
					intervalLineData: interval_temp,

					finalData: intervalData
				})

			})


			
		})


		//this.setState({
		//	timeLineData: d3.csv(`http://${host_name}:8000/surface/maps/${name}`),
		//	intervalLineData: d3.csv(`http://${host_name}:8000/surface/maps/${name}`),
		//})
	}

	getNewRegionData = (region_name) => {
		var name = region_name.name.toUpperCase()

		var array_temp_time_line = []
		for (var prop in new_cases_department){
			var value = new_cases_department[prop]
			var props = prop.substring(2, prop.length - 1);
			props = props.split(",");
			props[0] = props[0].substring(0, props[0].length - 1);
			
			if (props[0] == name){
				props[1] = props[1].substring(12, props[1].length - 2);
				props[1]  = new Date(props[1]);
				props.push(value)
				array_temp_time_line.push(props)
			}
		}

		var self = this;
		var i=0
		this.state.intervalTotalData.then(function(intervalData){
			//console.log(intervalData)
			var interval_temp = []
			intervalData.map(function(item){
				//console.log(item)
				if (item.state == name){
					item.date = new Date(item.date);
					item.order = i++;
					interval_temp.push(item)
				}
			})

			//console.log(interval_temp)


			self.setState({
				timeLineData: array_temp_time_line,
				intervalLineData: interval_temp,
			})
		})

		
	}

	sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
			break;
			}
		}
	}



	render(){

		var history = [
			{date: new Date(2020, 2, 6, 18, 0), value: 1, descartados: 0},
			{date: new Date(2020, 2, 7, 18, 0), value: 6, descartados: 0},
			{date: new Date(2020, 2, 9, 8, 30), value: 9, descartados: 0},
			{date: new Date(2020, 2, 10, 8, 0), value: 11, descartados: 0},
			{date: new Date(2020, 2, 11, 10, 0), value: 13, descartados: 0},
			{date: new Date(2020, 2, 11, 14, 20), value: 15, descartados: 0},
			{date: new Date(2020, 2, 11, 20, 0), value: 17, descartados: 0},
			{date: new Date(2020, 2, 12, 9, 55), value: 22, descartados: 0},
			{date: new Date(2020, 2, 13, 8, 30), value: 28, descartados: 0},
			{date: new Date(2020, 2, 13, 16, 0), value: 38, descartados: 0},
			{date: new Date(2020, 2, 14, 19, 20), value: 43, descartados: 0},
			{date: new Date(2020, 2, 15, 13, 10), value: 71, descartados: 0},
			{date: new Date(2020, 2, 16, 8, 46), value: 86, descartados: 0},
			{date: new Date(2020, 2, 17, 8, 20), value: 117, descartados: 2680},
			{date: new Date(2020, 2, 18, 7, 0), value: 145, descartados: 2930},
			{date: new Date(2020, 2, 19, 12, 0), value: 234, descartados: 3607},
			{date: new Date(2020, 2, 20, 12, 0), value: 263, descartados: 4035},
			{date: new Date(2020, 2, 21, 15, 0), value: 318, descartados: 4945},   // upfate
			{date: new Date(2020, 2, 22, 14, 30), value: 363, descartados: 5821}, 
			{date: new Date(2020, 2, 23, 13, 0), value: 395, descartados: 6269},
			{date: new Date(2020, 2, 24, 0, 0), value: 416, descartados: 0},	
			{date: new Date(2020, 2, 25, 0, 0), value: 558, descartados: 7560},
			{date: new Date(2020, 2, 26, 0, 0), value: 580, descartados: 8639},	
			// dale
			{date: new Date(2020, 2, 27, 0, 0), value: 635, descartados: 0},	
			{date: new Date(2020, 2, 28, 0, 0), value: 671, descartados: 0},	
			{date: new Date(2020, 2, 29, 0, 0), value: 852, descartados: 0},	
			{date: new Date(2020, 2, 30, 0, 0), value: 950, descartados: 0},
			{date: new Date(2020, 2, 31, 0, 0), value: 1065, descartados: 0},

			{date: new Date(2020, 3, 1, 0, 0), value: 1065, descartados: 0},
			{date: new Date(2020, 3, 2, 0, 0), value: 1323, descartados: 0},
			{date: new Date(2020, 3, 3, 0, 0), value: 1414, descartados: 0},
			{date: new Date(2020, 3, 4, 0, 0), value: 1595, descartados: 0},
			{date: new Date(2020, 3, 5, 0, 0), value: 1746, descartados: 0},
			{date: new Date(2020, 3, 6, 0, 0), value: 2281, descartados: 0},
			{date: new Date(2020, 3, 7, 0, 0), value: 2561, descartados: 0},
			{date: new Date(2020, 3, 8, 0, 0), value: 2954, descartados: 0},
			{date: new Date(2020, 3, 9, 0, 0), value: 4342, descartados: 0},
			{date: new Date(2020, 3, 10, 0, 0), value: 5256, descartados: 0},
			{date: new Date(2020, 3, 11, 0, 0), value: 5897, descartados: 0},
			{date: new Date(2020, 3, 12, 0, 0), value: 6848, descartados: 0},
			{date: new Date(2020, 3, 13, 0, 0), value: 7519, descartados: 0},
			{date: new Date(2020, 3, 14, 0, 0), value: 7519, descartados: 0},
			{date: new Date(2020, 3, 15, 0, 0), value: 10303, descartados: 0},
			{date: new Date(2020, 3, 16, 0, 0), value: 11475, descartados: 0},
			{date: new Date(2020, 3, 17, 0, 0), value: 12491, descartados: 0},
			{date: new Date(2020, 3, 18, 0, 0), value: 13489, descartados: 0},
			{date: new Date(2020, 3, 19, 0, 0), value: 14420, descartados: 0},
			{date: new Date(2020, 3, 20, 0, 0), value: 15628, descartados: 0},
			{date: new Date(2020, 3, 21, 0, 0), value: 16325, descartados: 0},
			{date: new Date(2020, 3, 22, 0, 0), value: 17837, descartados: 0},
			{date: new Date(2020, 3, 23, 0, 0), value: 19250, descartados: 0},
			{date: new Date(2020, 3, 24, 0, 0), value: 20914, descartados: 0},
			{date: new Date(2020, 3, 25, 0, 0), value: 21648, descartados: 0},
			{date: new Date(2020, 3, 26, 0, 0), value: 25331, descartados: 0},
			{date: new Date(2020, 3, 27, 0, 0), value: 27517, descartados: 0},
			{date: new Date(2020, 3, 28, 0, 0), value: 28699, descartados: 0},
			{date: new Date(2020, 3, 29, 0, 0), value: 31190, descartados: 0},
			{date: new Date(2020, 3, 30, 0, 0), value: 33931, descartados: 0},
			{date: new Date(2020, 4, 1, 0, 0), value: 36976, descartados: 0},
			{date: new Date(2020, 4, 2, 0, 0), value: 40459, descartados: 0},
			{date: new Date(2020, 4, 3, 0, 0), value: 42534, descartados: 0},
			{date: new Date(2020, 4, 4, 0, 0), value: 45928, descartados: 0},
			{date: new Date(2020, 4, 5, 0, 0), value: 47372, descartados: 0},
			//{date: new Date(2020, 4, 6, 0, 0), value: , descartados: 0},
		]

		var updated = history[history.length-1]

		var days = Math.ceil(((updated.date.getTime() - 20) - history[0].date.getTime())/(1000*60*60*24))

		var projection = [
			updated,
		]

		
		var predicted = this.getPredicction(days, updated.value);
		for (var i = 0; i < this.state.proyection_num; i++){
			var temp_date = new Date()
			temp_date.setDate(updated.date.getDate() + i+1)
			temp_date.setHours(12)
			temp_date.setMinutes(0)
			projection.push({date: temp_date, value: predicted})
			predicted = this.getPredicction(days + i + 1, predicted);
		}


		var data = [
            {name: 'Lima', code:'LIM', exits: 76176, coordinates: [-76.705245, -11.817466]},
            {name: 'Arequipa', code:'AQP', exits: 2198, coordinates: [-71.750411, -16.197379]},
            {name: 'Amazonas', code:'', exits: 422, coordinates: [-78, -5]},
            {name: 'Áncash', code:'', exits: 2701, coordinates: [-77.75, -9.5]},
            {name: 'Apurímac', code:'', exits: 131, coordinates: [-72.849045, -13.991221]},
            {name: 'Ayacucho', code:'', exits: 556, coordinates: [-74.183884, -13.607129]},
            {name: 'Cajamarca', code:'', exits: 541, coordinates: [-78.833333, -6.25]},
            {name: 'Callao', code:'', exits: 8370, coordinates: [-77.1391133, -12.0522626]},
            {name: 'Cusco', code:'', exits: 806, coordinates: [-71.871261, -13.516349]},
            {name: 'Huancavelica', code:'', exits: 325, coordinates: [-75, -13]},
            {name: 'Huánuco', code:'', exits: 575, coordinates: [-75.833333, -9.5]},
            {name: 'Ica', code:'', exits: 2099, coordinates: [-75.705490, -14.188353]},
            {name: 'Junín', code:'', exits: 1383, coordinates: [-75.106736, -11.543116]},
            {name: 'La Libertad', code:'', exits: 3081, coordinates: [-78.5, -8]},
            {name: 'Lambayeque', code:'', exits: 6174, coordinates: [-79.781417, -6.390209]},
            {name: 'Loreto', code:'', exits: 3460, coordinates: [-74.288253, -3.950413]},
            {name: 'Madre de Dios', code:'', exits: 302, coordinates: [-70.508957, -11.865852]},
            {name: 'Moquegua', code:'', exits: 344, coordinates: [-70.887985, -16.839882]},
            {name: 'Pasco', code:'', exits: 299, coordinates: [-75.25, -10.5]},
            {name: 'Piura', code:'', exits: 4204, coordinates: [-80.6323, -5.1949018]},
            {name: 'Puno', code:'', exits: 246, coordinates: [-70.014572, -15.843632]},
            {name: 'San Martín', code:'', exits: 908, coordinates: [-76.776658, -7.104824]},
            {name: 'Tacna', code:'', exits: 303, coordinates: [-70.256271, -17.663501]},
            {name: 'Tumbes', code:'', exits: 724, coordinates: [-80.550460, -3.873688]},
            {name: 'Ucayali', code:'', exits: 2837, coordinates: [-73.321457, -9.740033]},
        ]

        data = data.slice().sort((a, b) => d3.descending(a.exits, b.exits))

        var total_confirmados = d3.sum(data, function(it){ return it.exits})

        const markSeries = [];
        data.map(function(item, i) {
        	//console.log(i)
	        markSeries.push(
	        	<li><spam className="data-exist">{item.exits} </spam>{item.name} </li>
	        )
	    });

        var formatTime = d3.timeFormat("%B %d, %Y %I:%M %p");

		var a = processDataAsycn()
		//console.log(a)

	    return (
	    	<div className="">
	    		<div className="col-sm-12 header">
	            	Coronavirus en Perú <spam className="By-class">By <a href="https://twitter.com/wzunigah">wzuniga</a> and <a href="https://twitter.com/fmorenovr">fmorenovr</a></spam>
	            </div>

	            <div className="col-sm-12 body">
					<div className="col-sm-12 body-map">
						<div id="legendMap" ></div>
						<HexagonMap 
							intervalsDistricData = { this.state.intervalsDistricData }
							finalData = { this.state.finalData }
							data = {data}
							getNewDistrictData = { this.getNewDistrictData }
						/>
					</div>
		        	
					<div className="box-total">

							<div className="text-conf" >Total Confirmados</div>
							<div className="num-conf" >{total_confirmados}</div>
							<hr/>
					</div>
		        	
					<div className="box-bar">
		        		<BarChart
		        			data = { data }
							handleChangeState = { this.handleChangeState }
							getNewRegionData = { this.getNewRegionData }
		        		/>
						
		        	</div>

					<div className="box-interval">
						
		        		<IntervalPlot
							intervalLineData = { this.state.intervalLineData }
		        			data = { data }
		        			handleChangeState = { this.handleChangeState }
		        		/>
		        	</div>

					<div className="box-line">
						<LineChart
							timeLineData = { this.state.timeLineData }
		        			data = { history }
		        			last = { updated }
		        			projection = { projection }
		        			proyection_num = { this.state.proyection_num }

		        			handleChangeState = { this.handleChangeState }
		        		/>
		        	</div>
	    		</div>
	        </div>
	    );
	}
}


/*

<div className="col-sm-2 body-left">
	<div className="body-left-top">
		<div className="text-conf" >Total Confirmados</div>
		<div className="num-conf" >{total_confirmados}</div>
	</div>
	<div className="body-left-bottom">
		<div className="text-prov" >Casos confirmados por departamento</div>
		<ul>
			{markSeries}
		</ul>
	</div>
</div>

*/
