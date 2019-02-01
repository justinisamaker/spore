import React, { Component } from 'react';
import axios from 'axios';
import { Button } from '../button/Button';

import './ChangeSetpoint.scss';

class ChangeSetpoint extends Component {
  constructor(props){
    super(props);

    this.changeSetpoint = this.changeSetpoint.bind(this);

    this.state = {
      setpoint: 0,
    }
  }

  componentDidMount(){
    axios.get(`/api/${this.props.modifier}/setpoint`)
      .then(res => {
        this.setState({
          setpoint: res.data[0].targetvalue
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
    return(
      <div className="change-setpoint">
        <p>{this.props.modifier} Setpoint: { this.state.setpoint }</p>
        <div className="setpoint-controls">
          <Button text="+" onClick={() => this.changeSetpoint('increment')} size="small" />
          <Button text="-" onClick={() => this.changeSetpoint('decrement')} size="small" />
        </div>
      </div>
    );
  }
}

export default ChangeSetpoint;
