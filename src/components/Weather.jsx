import React, { useState } from 'react';
import { Search, Cloud, Droplet, Wind } from 'lucide-react';

const initialCities = ['New York', 'London', 'Tokyo', 'Sydney']; // 4 initial cities

const Weather = () => {
  const [weatherData, setWeatherData] = useState({});
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInitialCities, setShowInitialCities] = useState(true);

  const fetchWeather = async (cityName) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData((prevData) => ({ ...prevData, [cityName]: data })); // Store each city's data separately
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      setShowInitialCities(false); // Hide initial cities
      fetchWeather(city); // Fetch weather for the searched city
    } else {
      setShowInitialCities(true); // Show initial cities when search is cleared
      setWeatherData({}); // Clear weather data
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key
    }
  };

  // Fetch weather data for initial cities
  React.useEffect(() => {
    initialCities.forEach((city) => fetchWeather(city));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex items-center mb-4">
        <input 
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Enter City"
          className="flex-grow px-4 py-2 text-gray-700 bg-gray-200 rounded-l-lg focus:outline-none focus:bg-white"
          onKeyDown={handleKeyDown} // Attach Enter key handler
        />
        <button 
          onClick={handleSearch} 
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
          disabled={loading}
        >
          {loading ? 'Loading...' : <Search size={20} />}
        </button>
      </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-2 gap-4">
        {showInitialCities && initialCities.map((cityName) => (
          <CityWeather 
            key={cityName} 
            city={cityName} 
            weatherData={weatherData[cityName]} 
            onClick={() => fetchWeather(cityName)} 
          />
        ))}

        {!showInitialCities && city && (
          <CityWeather city={city} weatherData={weatherData[city]} />
        )}
      </div>

      <SignUpForm />
    </div>
  );
};

// Component to display individual city weather
const CityWeather = ({ city, weatherData, onClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) { // Only show details on hover for desktop
      setShowDetails(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setShowDetails(false);
    }
  };

  const handleClick = () => {
    setShowDetails((prev) => !prev); // Toggle details on click for both mobile and desktop
  };

  return (
    <div 
      className="relative bg-gray-100 p-4 rounded cursor-pointer hover:bg-blue-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {weatherData ? (
        <div className="text-center">
          <h2 className="text-xl font-bold">{weatherData.name}</h2>
          <img 
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
            alt={weatherData.weather[0].description}
            className="w-10 h-10 mx-auto"
          />
          <p className="text-sm mt-2">{weatherData.weather[0].description}</p> {/* Accessible weather description */}
          
          {showDetails && (
            <div className="text-center mt-4">
              <p className="text-lg">{Math.round(weatherData.main.temp)}°C</p>
              <div className="flex justify-center mt-2">
                <Droplet className="mr-1 text-blue-500" /> {weatherData.main.humidity}%
                <Wind className="ml-4 mr-1 text-blue-500" /> {weatherData.wind.speed} m/s
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

// Signup form for weather updates
const SignUpForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <div className="mt-10 p-4 bg-gray-200 rounded-lg">
      <h3 className="text-xl font-bold mb-2">Sign up for Weather Updates</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-2 mb-2 rounded border"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Weather;
