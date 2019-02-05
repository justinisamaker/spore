import React, { Component } from 'react';
import axios from 'axios';

import './SystemStatus.scss';

class SystemStatus extends Component {
  constructor(props){
    super(props);

    this.state = {
      systemstatus: "calibrating",
      intervalId: null
    }

    this.getSystemStatus = this.getSystemStatus.bind(this);
  }

  componentDidMount(){
    const statusInterval = setInterval(this.getSystemStatus, 10000);
    this.setState({ intervalId: statusInterval });
  }

  componentWillUnmount(){
    clearInterval(this.state.intervalId);
  }

  getSystemStatus(){
    axios.get('/api/systemstatus')
      .then(res => {
        console.log(`###${res.data}`);
        this.setState({
          systemstatus: res.data
        });
      });
  }

  render(){
    return(
      <div className="system-status system-overview-item">
        <p>The system is {this.state.systemstatus}</p>
        <i className={'system-status-indicator ' + this.state.systemstatus}></i>
      </div>
    );
  }
}

export default SystemStatus;
