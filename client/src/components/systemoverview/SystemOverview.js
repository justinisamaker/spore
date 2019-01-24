import React, { Component } from 'react';
import SystemStatus from '../systemstatus/SystemStatus';
import CurrentGrow from '../currentgrow/CurrentGrow';
import ExpectedHarvest from '../expectedharvest/ExpectedHarvest';

import './SystemOverview.scss';

class SystemOverview extends Component {
  render(){
    return(
      <div className="system-overview">
        <SystemStatus />
        <CurrentGrow />
        <ExpectedHarvest />
      </div>
    );
  }
}

export default SystemOverview;
