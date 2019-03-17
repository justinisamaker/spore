import React, { Component } from 'react';
import Moment from 'moment';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';
import { Button } from '../button/Button';
import './LineChart.scss';

class LineChart extends Component{
  constructor(props){
    super(props);

    this.state = {
      chartreadings: []
    }

    this.changeTimeRange = this.changeTimeRange.bind(this);
  }

  componentDidMount(){
    axios.get('/api/dht22/50')
      .then(res => {
        console.log(`Chart: ${res.data}`)
        this.setState({
          chartreadings: res.data
        });
      });
  }

  changeTimeRange(range){
    axios.get(`/api/dht22/last/${range}`)
      .then(res => {
        this.setState({
          chartreadings: res.data
        });
      });
  }

  render(){
    const dateFormat = (readTime) => {
      var thisTime = Moment(readTime).format('M/D h:mm A');
      return thisTime;
    };

    return(
      <div className="line-chart-container">
        <ResponsiveContainer className="line-chart-responsive">
          <AreaChart data={this.state.chartreadings} className="line-chart" margin={{top: 30, right: 30, left: -15, bottom: 5}} >>
            <XAxis dataKey="date" reversed={true} tickFormatter={dateFormat} />
            <YAxis type="number" domain={[0, 100]}/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Tooltip />
            <Area type="monotone" dataKey="temperaturevalue" fill="#fd8524" stroke="#fd8524" />
            <Area type="monotone" dataKey="humidityvalue" fill="#3D99FE" stroke="#3D99FE"/>
          </AreaChart>
        </ResponsiveContainer>
        <div className="range-control">
          <Button className="last-day" text="Last day" onClick={() => this.changeTimeRange('day')} />
          <Button className="last-week" text="Last week" onClick={() => this.changeTimeRange('week')} />
          <Button className="last-month" text="Last month" onClick={() => this.changeTimeRange('month')} />
        </div>
      </div>
    );
  }
}

export default LineChart;
