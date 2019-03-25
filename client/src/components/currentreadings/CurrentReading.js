import React, { Component } from 'react';
import axios from 'axios';
import './CurrentReading.scss';
import { Line } from 'rc-progress';
import { Button } from '../button/Button';

class CurrentReading extends Component{
  constructor(props){
    super(props);

    this.changeSetpoint = this.changeSetpoint.bind(this);

    this.state = {
      readingvalue: 0,
      setpoint: 0
    }
  }

  componentDidMount(){
    axios.get(`/api/${this.props.modifier}`)
      .then(res => {
        this.setState({
          readingvalue: res.data
        });
      });

    axios.get(`/api/${this.props.modifier}/setpoint`)
      .then(res => {
        this.setState({
          setpoint: res.data
        });
      });
  }

  componentDidUpdate(){
    console.log(`Setting ${this.props.modifier} to ${this.state.setpoint}`);
    axios.post(`/api/${this.props.modifier}/setpoint/${this.state.setpoint}`);
  }

  changeSetpoint(direction){
    if(direction === 'decrement'){
      this.setState({
        setpoint: this.state.setpoint - 1
      });
    } else {
      this.setState({
        setpoint: this.state.setpoint + 1
      });
    }
  }

  render(){
    const tempFormatting = (`${this.state.readingvalue}ºF`);
    const humidityFormatting = (`${this.state.readingvalue}%`);
    const tempSetpointFormatting = (`${this.state.setpoint}ºF`);
    const humiditySetpointFormatting = (`${this.state.setpoint}%`);
    const tempLineColor = '#fd8524';
    const humidityLineColor = '#3D99FE';

    return(
      <div className="current-reading">
        <h4 className="current-reading-title">{this.props.modifier}</h4>
        <Line percent={this.state.readingvalue} strokeWidth="2" strokeColor={this.props.modifier === 'Temperature' ? tempLineColor : humidityLineColor} />
        <div className="current-reading-value">
          <div className="increment-button setpoint-button">
            <Button text="+" onClick={() => this.changeSetpoint('increment')} size="large"/>
          </div>
          <div className="reading-value value">
            <h5>{this.props.modifier === 'Temperature' ? tempFormatting : humidityFormatting}</h5>
            <h6>Current Read</h6>
          </div>
          <div className="reading-setpoint value">
            <h5>{this.props.modifier === 'Temperature' ? tempSetpointFormatting : humiditySetpointFormatting}</h5>
            <h6>Setpoint</h6>
          </div>
          <div className="decrement-button setpoint-button">
            <Button text="-" onClick={() => this.changeSetpoint('decrement')} size="large"/>
          </div>
        </div>
      </div>
    );
  }
}

export default CurrentReading;
