import React, { useState } from 'react'

const Weather = () => {
  const [weatherData, setWeatherData] =  useState(null)
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    console.log('API Key:', import.meta.env.VITE_WEATHER_API_KEY);
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    setError('');
    try {
      const response = await  fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json()
      setWeatherData(data);
    } catch (err) {
      console.error('Full error:', err);
      setWeatherData(null);
      setError(err.message);
    }
  };

  return (
    <div style={{marginTop: '20px'}}>
      <input type="text"
      value={city}
      onChange={(e) => setCity(e.target.value)} 
      placeholder="Enter City"
      style={{ padding: '10px', marginRight: '10px'}}
      />

      <button onClick={fetchWeather} style={{padding: '10px'}}>
        Get Weather
      </button>

      {error && <p style={{color: 'red'}}>{error}</p>}

      {weatherData && (
        <div style={{marginTop:'20px'}}>
          <h2>{weatherData.name}</h2>

          <p>{weatherData.weather[0].description}</p>
          <p>{Math.round(weatherData.main.temp - 273.15)}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather
