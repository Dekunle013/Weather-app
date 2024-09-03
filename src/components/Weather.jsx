import React, { useState } from 'react';
import { Search, Cloud, Droplet, Wind } from 'lucide-react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setWeatherData(null);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex items-center mb-4">
        <input 
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Enter City"
          className="flex-grow px-4 py-2 text-gray-700 bg-gray-200 rounded-l-lg focus:outline-none focus:bg-white"
        />
        <button 
          onClick={fetchWeather} 
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
          disabled={loading}
        >
          {loading ? 'Loading...' : <Search size={20} />}
        </button>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {weatherData && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{weatherData.name}</h2>
          <div className="flex justify-center items-center mb-4">
            <img 
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
              alt={weatherData.weather[0].description}
              className="w-20 h-20"
            />
            <p className="text-5xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
          </div>
          <p className="text-xl mb-4 capitalize">{weatherData.weather[0].description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center bg-gray-100 p-2 rounded">
              <Droplet className="mr-2 text-blue-500" />
              <span>Humidity: {weatherData.main.humidity}%</span>
            </div>
            <div className="flex items-center justify-center bg-gray-100 p-2 rounded">
              <Wind className="mr-2 text-blue-500" />
              <span>Wind: {weatherData.wind.speed} m/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;