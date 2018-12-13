import React, { Component } from 'react';
import Moment from 'moment';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';

class LineChart extends Component{
  constructor(props){
    super(props);

    this.state = {
      chartreadings: []
    }

    this.changeTimeRange = this.changeTimeRange.bind(this);
  }

  componentDidMount(){
    axios.get('/api/dht22/150')
      .then(res => {
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

    const graphStyle = {
      width: '100%',
      height: '300px',
      margin: '1em auto'
    }

    return(
      <div style={graphStyle}>
        <ResponsiveContainer>
          <AreaChart data={this.state.chartreadings}>
            <XAxis dataKey="date" reversed={true} tickFormatter={dateFormat}/>
            <YAxis type="number" dataKey="humidityvalue"/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Tooltip />
            <Area type="monotone" dataKey="humidityvalue" stroke="#3D99FE" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="range-control">
          <button className="adjust-range" onClick={() => this.changeTimeRange('day')}>Last day</button>
          <button className="adjust-range" onClick={() => this.changeTimeRange('week')}>Last week</button>
          <button className="adjust-range" onClick={() => this.changeTimeRange('month')}>Last month</button>
        </div>
      </div>
    );
  }
}

export default LineChart;
