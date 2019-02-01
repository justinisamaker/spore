import React, { Component } from 'react';

import './SystemStatus.scss';

class SystemStatus extends Component {
  render(){
    return(
      <div className="system-status system-overview-item">
        <p>The system is currently stable</p>
        <i className="system-status-indicator"></i>
      </div>
    );
  }
}

export default SystemStatus;
