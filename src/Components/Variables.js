import * as d3 from 'd3'
import department_total_csv from "../preprocess/data/DEPARTAMENTO_total.csv"
import country_total_csv from "../preprocess/data/PAIS_total.csv"

function getTotalCasesByDepartment(){
  var history_temp = [];
  d3.csv(department_total_csv).then(function(cases){
    cases.map(function(item){
      var temp_dict = {}
      temp_dict["name"] = item.region;
      temp_dict["exits"] = parseInt(item.confirmados);
      
      history_temp.push(temp_dict)
	  })
  })
  return history_temp;
};

function getTotalCasesCountry(){
  var history_temp = [];
  d3.csv(department_total_csv).then(function(cases){
    cases.map(function(item){
      var temp_dict = {}
      temp_dict["name"] = item.region;
      temp_dict["exits"] = parseInt(item.confirmados);
      
      history_temp.push(temp_dict)
	  })
  })
  return history_temp;
};

let data_history_department = getTotalCasesByDepartment()

let data_total_country = getTotalCasesCountry

export default  {data_history_department, data_total_country};
