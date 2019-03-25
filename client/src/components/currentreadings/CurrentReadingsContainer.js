import React from 'react';
import './CurrentReadingsContainer.scss';
import CurrentReading from './CurrentReading';

const CurrentReadings = () => {
  return(
    <div className="current-readings-container">
      <CurrentReading modifier="Temperature" />
      <CurrentReading modifier="Humidity" />
    </div>
  );
}

export default CurrentReadings;
