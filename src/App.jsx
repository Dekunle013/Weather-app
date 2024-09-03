import React from 'react';
import Weather from './components/Weather';

const App = () => {
  return (
    <>
      <div style={{fontFamily: 'Arial, sans-serif', padding: '20px'}}>
        <h1>Weather App</h1>
        <Weather />
      </div>
    </>
  );
};

export default App
