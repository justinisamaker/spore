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
    const targetModifier = this.props.modifier.toLowerCase();
    axios.get(`https://builders-kit-0031.herokuapp.com/api/${targetModifier}/setpoint`)
      .then(res => {
        console.log(res.data);
        this.setState({
          setpoint: res.data
        });
      });
  }

  componentDidUpdate(){
    const targetModifier = this.props.modifier.toLowerCase();
    console.log(`Setting ${this.props.modifier} to ${this.state.setpoint}`);
    axios.post(`https://builders-kit-0031.herokuapp.com/api/${targetModifier}/setpoint/${this.state.setpoint}`);
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
