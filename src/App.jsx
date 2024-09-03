import React from 'react';
import Weather from './components/Weather';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-white mb-8">Weather App</h1>
      <Weather />
    </div>
  );
};

export default App;