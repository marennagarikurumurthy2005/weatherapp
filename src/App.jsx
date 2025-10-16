import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  Sunrise,
  Sunset,
  CalendarRange,
  Clock2,
} from "lucide-react";

const App = () => {
  const [query, setQuery] = useState(""); 
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [daySelection, setDaySelection] = useState("today"); 

  const apiKey = "0175ab7062a2153121ff5a15c36b6df0";

  // Debounce for city input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 3) fetchCitySuggestions();
      else setSuggestions([]);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchCitySuggestions = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    }
  };

  // Fetch weather (current + forecast)
  const fetchWeather = async (lat, lon, name) => {
    try {
      setLoading(true);
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      setWeather({
        current: currentRes.data,
        forecast: forecastRes.data,
        displayName: name,
      });
      setQuery(name);
      setSuggestions([]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setLoading(false);
    }
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <Sun className="text-yellow-400" size={28} />;
      case "Clouds":
        return <Cloud className="text-gray-300" size={28} />;
      case "Rain":
        return <CloudRain className="text-blue-400" size={28} />;
      case "Thunderstorm":
        return <CloudLightning className="text-yellow-500" size={28} />;
      case "Snow":
        return <Snowflake className="text-blue-200" size={28} />;
      default:
        return <Wind className="text-gray-400" size={28} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 py-10 px-3">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-[900px]">
        <h1 className="text-4xl font-bold text-center mb-8 drop-shadow-lg text-black flex items-center justify-center gap-2">
       <Sun className="text-yellow-400" size={36} />
          Weather Dashboard
        </h1>

        {/* Search Box */}
        <div className="relative w-full mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 border border-white/40 bg-white/10 text-black placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto z-20 text-black">
              {suggestions.map((city, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-white/20 cursor-pointer rounded-md flex justify-between items-center"
                  onClick={() =>
                    fetchWeather(city.lat, city.lon, `${city.name}, ${city.country}`)
                  }
                >
                  <span>{city.name}{city.state ? `, ${city.state}` : ""}</span>
                  <span className="text-sm opacity-70">{city.country}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Day Selector */}
        <div className="flex justify-center gap-4 mb-6">
          {["yesterday", "today", "tomorrow"].map((d) => (
            <button
              key={d}
              className={`px-4 py-2 rounded-lg font-semibold ${
                daySelection === d
                  ? "bg-white/30 text-black shadow-lg"
                  : "bg-white/10 text-black/70 hover:bg-white/20"
              }`}
              onClick={() => setDaySelection(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && <p className="text-center font-semibold text-black">Fetching weather...</p>}

        {/* Current Weather */}
        {weather && !loading && (
          <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl mb-6 text-center">
            <h2 className="text-3xl font-bold mb-2 text-black">{weather.displayName}</h2>
            <div className="flex justify-center items-center gap-4 mb-4">
              {getWeatherIcon(weather.current.weather[0].main)}
              <p className="text-5xl font-extrabold text-black">
                {Math.round(weather.current.main.temp)}°C
              </p>
            </div>
            <p className="text-lg text-black mb-4 capitalize">{weather.current.weather[0].description}</p>
            <div className="flex flex-wrap justify-center gap-6 text-black/90">
              <p className="flex items-center gap-2"><Droplets size={18} /> Humidity: {weather.current.main.humidity}%</p>
              <p className="flex items-center gap-2"><Wind size={18} /> Wind: {weather.current.wind.speed} m/s</p>
              <p className="flex items-center gap-2"><Thermometer size={18} /> Feels: {Math.round(weather.current.main.feels_like)}°C</p>
              <p className="flex items-center gap-2"><Sunrise size={18} /> Sunrise: {new Date(weather.current.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p className="flex items-center gap-2"><Sunset size={18} /> Sunset: {new Date(weather.current.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
        )}

        {/* Hourly Forecast */}
        {weather && !loading && (
          <>
            <h3 className="text-2xl font-semibold mt-8 mb-3 text-center text-black flex items-center justify-center gap-2">
  <Clock2 className="text-green-500" size={24} />Next 24hrs Weather
</h3>
            <div className="flex overflow-x-auto gap-4 p-3 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              {weather.forecast.list.slice(0, 8).map((item, i) => (
                <div
                  key={i}
                  className="bg-white/20 backdrop-blur-lg p-4 rounded-xl min-w-[110px] text-center hover:scale-105 transition"
                >
                  <p className="text-sm text-black">{new Date(item.dt * 1000).getHours()}:00</p>
                  <div className="flex justify-center my-1">{getWeatherIcon(item.weather[0].main)}</div>
                  <p className="text-lg font-semibold text-black">{Math.round(item.main.temp)}°C</p>
                  <p className="text-xs text-black/80">{item.weather[0].main}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 5-Day Forecast */}
        {weather && !loading && (
          <>
            <h3 className="text-2xl font-semibold mt-8 mb-3 text-center text-black flex items-center justify-center gap-2">
         <CalendarRange className="text-red-500" size={24} />
          Forecast
           </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {weather.forecast.list
                .filter((_, i) => i % 8 === 0)
                .slice(0, 7)
                .map((item, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-lg p-4 rounded-xl text-center hover:scale-105 transition">
                    <p className="font-semibold text-black">{new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}</p>
                    <div className="flex justify-center my-1">{getWeatherIcon(item.weather[0].main)}</div>
                    <p className="text-black">{Math.round(item.main.temp_min)}° / {Math.round(item.main.temp_max)}°C</p>
                    <p className="text-xs text-black/80">{item.weather[0].main}</p>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
