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
import total_cases_department from "./preprocess/data/DEPARTAMENTO_total.csv"

import new_cases_province from "./preprocess/data/PROVINCIA_news.csv"
import intervals_province from "./preprocess/data/PROVINCIA_intervals.csv"
import total_cases_province from "./preprocess/data/PROVINCIA_total.csv"

import new_cases_distric from "./preprocess/data/DISTRITO_news.csv"
import intervals_distric from "./preprocess/data/DISTRITO_intervals.csv"
import total_cases_distric from "./preprocess/data/DISTRITO_total.csv"

const host_name = ""

function getTotalCases(){
  var history_temp = [];
  d3.csv(total_cases_department).then(function(cases){
    cases.map(function(item){
      var temp_dict = {}
      temp_dict["name"] = item.region;
      temp_dict["exits"] = parseInt(item.confirmados);
      
      history_temp.push(temp_dict)
	  })
  })
  return history_temp;
};

const data_history_department = getTotalCases()

var data_ = [
        {name: "LIMA", exits: 718113},
        {name: "CALLAO", exits: 86825},
        {name: "AREQUIPA", exits: 68420},
        {name: "PIURA", exits: 63114},
        {name: "LA LIBERTAD", exits: 59058},
        {name: "LIMA REGION", exits: 56055},
        {name: "ANCASH", exits: 55676},
        {name: "JUNIN", exits: 55130},
        {name: "CUSCO", exits: 48538},
        {name: "ICA", exits: 46302},
        {name: "CAJAMARCA", exits: 45306},
        {name: "LAMBAYEQUE", exits: 45218},
        {name: "LORETO", exits: 37437},
        {name: "SAN MARTIN", exits: 36704},
        {name: "UCAYALI", exits: 28458},
        {name: "HUANUCO", exits: 28177},
        {name: "PUNO", exits: 27058},
        {name: "AYACUCHO", exits: 24586},
        {name: "AMAZONAS", exits: 24358},
        {name: "TACNA", exits: 22502},
        {name: "MOQUEGUA", exits: 22395},
        {name: "APURIMAC", exits: 15995},
        {name: "TUMBES", exits: 14293},
        {name: "MADRE DE DIOS", exits: 12323},
        {name: "PASCO", exits: 11877},
        {name: "HUANCAVELICA", exits: 11796},
      ]

export default class App extends React.Component {
  	
	state = {
		proyection_num: 2,

		newCasesDepartmentData: d3.csv(new_cases_department),
		intervalDepartmentData: d3.csv(intervals_department),
		totalCasesDepartmentData: d3.csv(total_cases_department),
		
		newCasesDistricData: d3.csv(new_cases_distric),
		intervalsDistricData: d3.csv(intervals_distric),
		totalCasesDistricData: d3.csv(total_cases_distric),

		//dictrictData: d3.csv(`http://${host_name}:8000/surface/maps/`),
		//regionData: d3.csv(`http://${host_name}:8000/surface/maps/`),

		timeLineData: [],
		intervalLineData: [],
		finalData: [],
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
		var name = properties.NOMBDIST.toUpperCase()
		var self = this;
		var i=0;

		this.state.intervalsDistricData.then(function(intervalData){
			var interval_temp = []
			intervalData.map(function(item){
				if (item.state == name){
					item.date = new Date(item.date);
					item.order = i++;
					interval_temp.push(item)
				}
			})

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
				
				var history_temp=0;
        self.state.totalCasesDistricData.then(function(cases){
	        cases.map(function(item){
	          if (item.region == name){
	            history_temp = history_temp + parseInt(item.confirmados);
	          }
      		})

				  self.setState({
				    nameRegion: name,
				    timeLineData: array_temp_time_line,
				    intervalLineData: interval_temp,
				    finalData: intervalData,
				    totalData: history_temp,
				  })
			  })
			})
		})
	}
	
	getNewRegionData = (region_name) => {
		var name = region_name.name.toUpperCase()
		var self = this;
		var i=0
		this.state.intervalDepartmentData.then(function(intervalData){
			var interval_temp = []
			intervalData.map(function(item){
				if (item.state == name){
					item.date = new Date(item.date);
					item.order = i++;
					interval_temp.push(item)
				}
			})

			//console.log(self.state.newCasesDistricData)
			var array_temp_time_line = []
			self.state.newCasesDepartmentData.then(function(cases){
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
				
				var history_temp=0;
        self.state.totalCasesDepartmentData.then(function(cases){
	        cases.map(function(item){
	          if (item.region == name){
	            history_temp = history_temp + parseInt(item.confirmados);
	          }
      		})
      		
				  self.setState({
				    nameRegion: name,
				    timeLineData: array_temp_time_line,
				    intervalLineData: interval_temp,
				    finalData: intervalData,
				    totalData: history_temp,
				  })
			  })
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
    
    var formatTime = d3.timeFormat("%B %d, %Y %I:%M %p");

	  //var data = this.state.history_data.sort((a, b) => d3.descending(a.exits, b.exits))
	  //var data = this.state.totalData;
	  //var data = data_history_department.sort((a, b) => d3.descending(a.exits, b.exits));
	  var data = data_;
	  
	  console.log(data)
	  
	  var total_confirmados = d3.sum(data_history_department, function(it){ return it.exits})
	  
    return (
    	<div className="">
    		<div className="col-sm-12 header">
            	Coronavirus en Perú <spam className="By-class">By <a href="https://twitter.com/wzunigah">wzuniga</a> and <a href="https://twitter.com/fmorenovr">fmorenovr</a></spam>
        </div>

        <div className="col-sm-12 body">
	        	
				  <div className="box-total">
					  <div className="text-conf" >Total Confirmados</div>
					  <div className="num-conf" >{total_confirmados}</div>
					  <hr/>
				  </div>
				  
				  <div className="col-sm-12 body-map">
					  <div id="legendMap" ></div>
					  <HexagonMap 
				      nameRegion = {this.state.nameRegion}
						  intervalsDistricData = { this.state.intervalsDistricData }
						  finalData = { this.state.finalData }
						  data = { data }
						  getNewDistrictData = { this.getNewDistrictData }
					  />
				  </div>
	        	
				  <div className="box-bar">
        		<BarChart
						  intervalsDistricData = { this.state.intervalsTotalData }
						  finalData = { this.state.finalData }
        			data = { data }
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
		          nameRegion = {this.state.nameRegion}
		          totalData = {this.state.totalData}
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
