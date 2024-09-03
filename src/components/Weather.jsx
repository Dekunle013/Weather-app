import React, { useState, useEffect } from 'react';
import { Search, Cloud, Droplet, Wind } from 'lucide-react';

const Weather = () => {
  const [cities, setCities] = useState(['Lagos', 'New York', 'London']); // Initial cities
  const [weatherDataList, setWeatherDataList] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeatherForCities();
  }, [cities]);

  const fetchWeatherForCities = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    setError('');
    setLoading(true);

    const weatherPromises = cities.map(async (city) => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { city, data, error: null };
      } catch (err) {
        console.error('Fetch error:', err);
        return { city, data: null, error: err.message || 'Failed to fetch weather data' };
      }
    });

    const results = await Promise.all(weatherPromises);
    setWeatherDataList(results);
    setLoading(false);
  };

  const addCity = () => {
    if (newCity && !cities.includes(newCity)) {
      setCities([...cities, newCity]);
      setNewCity('');
    } else {
      setError('City is already added or empty');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex items-center mb-4">
        <input 
          type="text"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)} 
          placeholder="Enter City"
          className="flex-grow px-4 py-2 text-gray-700 bg-gray-200 rounded-l-lg focus:outline-none focus:bg-white"
        />
        <button 
          onClick={addCity} 
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
          disabled={loading}
        >
          {loading ? 'Adding...' : <Search size={20} />}
        </button>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {weatherDataList.map(({ city, data, error }) => (
        <div key={city} className="text-center mb-6">
          {error ? (
            <p className="text-red-500">{city}: {error}</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">{city}</h2>
              {data && (
                <>
                  <div className="flex justify-center items-center mb-2">
                    <img 
                      src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} 
                      alt={data.weather[0].description}
                      className="w-16 h-16"
                    />
                    <p className="text-3xl font-bold">{Math.round(data.main.temp)}°C</p>
                  </div>
                  <p className="text-xl mb-2 capitalize">{data.weather[0].description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-center bg-gray-100 p-2 rounded">
                      <Droplet className="mr-2 text-blue-500" />
                      <span>Humidity: {data.main.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-center bg-gray-100 p-2 rounded">
                      <Wind className="mr-2 text-blue-500" />
                      <span>Wind: {data.wind.speed} m/s</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Weather;
