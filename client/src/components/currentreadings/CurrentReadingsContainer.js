import React from 'react';
import './CurrentReadingsContainer.scss';
import ChangeSetpoint from '../sensors/ChangeSetpoint';
import CurrentReading from './CurrentReading';

const CurrentReadings = () => {
  return(
    <div className="current-readings-container">
      <div className="current-reading">
        <h4 className="current-reading-title">Humidity</h4>
        <CurrentReading modifier="humidity" />
        <ChangeSetpoint modifier="Humidity" />
      </div>

      <div className="current-reading">
        <h4 className="current-reading-title">Temperature</h4>
        <CurrentReading modifier="temperature" />
        <ChangeSetpoint modifier="Temperature" />
      </div>
    </div>
  );
}

export default CurrentReadings;
