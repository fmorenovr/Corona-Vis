import React from 'react';

import D3IntervalPlot from "./D3IntervalPlot"
import "./IntervalPlot.css"

export default class IntervalPlot extends React.Component {

    componentDidMount(){
		D3IntervalPlot("#IntervalPlot", this.props.intervalLineData);
    }

    componentDidUpdate(){
        D3IntervalPlot("#IntervalPlot", this.props.intervalLineData);
    }

    render(){
        return (
            <div id="IntervalPlot"></div>
        )
    }

}