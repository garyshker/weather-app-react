import React, { useState } from "react";
import Info from "./components/info";
import SearchForm from "./formula";
import Weather from "./components/weather";

const API_KEY = process.env.REACT_APP_API_KEY;

const getBgClass = (condition) => {
  const map = {
    Clear: "bg-clear",
    Clouds: "bg-clouds",
    Rain: "bg-rain",
    Drizzle: "bg-rain",
    Snow: "bg-snow",
    Thunderstorm: "bg-thunder",
    Mist: "bg-mist",
    Fog: "bg-mist",
    Haze: "bg-mist",
  };
  return map[condition] || "";
};

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWeather = async (city) => {
    if (!city.trim()) {
      setError("Введите название города");
      setWeatherData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404 ? "Город не найден" : "Ошибка загрузки данных"
        );
      }

      const data = await response.json();

      setWeatherData({
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        city: data.name,
        country: data.sys.country,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        condition: data.weather[0].main,
      });
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`wrapper ${weatherData ? getBgClass(weatherData.condition) : ""}`}>
      <div className="card">
        <div className="left-panel">
          <Info />
        </div>
        <div className="right-panel">
          <SearchForm onSearch={getWeather} />
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <Weather data={weatherData} error={error} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
