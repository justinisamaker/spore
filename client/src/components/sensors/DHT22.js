import React, { Component } from 'react';
import axios from 'axios';

class Dht22 extends Component {

  constructor(props){
    super(props);

    this.changeSetpoint = this.changeSetpoint.bind(this);

    this.state = {
      temperaturevalue: 0,
      humidityvalue: 0,
      humiditysetpoint: 0,
    }
  }

  componentDidMount(){
    axios.get('/api/dht22')
      .then(res => {
        this.setState({
          humidityvalue: res.data[0].humidityvalue,
          temperaturevalue: res.data[0].temperaturevalue
        });
      });

    axios.get('/api/humidity/setpoint')
      .then(res => {
        this.setState({
          humiditysetpoint: res.data[0].targetvalue
        });
      });
  }

  changeSetpoint(direction){
    if(direction == 'decrement'){
      this.setState({
        humiditysetpoint: this.state.humiditysetpoint - 1
      });
      axios.post(`/api/humidity/setpoint/${this.state.humiditysetpoint}`);
    } else {
      this.setState({
        humiditysetpoint: this.state.humiditysetpoint + 1
      });
      axios.post(`/api/humidity/setpoint/${this.state.humiditysetpoint}`);
      console.log('increment');
    }
  }

  render(){
    return(
      <div>
        <h4>DHT22</h4>
        <h5>Humidity: { this.state.humidityvalue }</h5>
        <h5>Temperature: { this.state.temperaturevalue }</h5>

        <div className="setpoint-control">
          <h5>Setpoint: { this.state.humiditysetpoint }</h5>
          <button className="setpoint-add" onClick={() => this.changeSetpoint('increment')}>+</button>
          <button className="setpoint-subtract" onClick={() => this.changeSetpoint('decrement')}>-</button>
        </div>
      </div>
    )
  }
}

export default Dht22;
