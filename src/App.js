import React, { useState } from "react";
import Info from "./components/info";
import SearchForm from "./formula";
import Weather from "./components/weather";
import Forecast from "./components/Forecast";
import Particles from "./components/Particles";

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

const getTodayMinMax = (forecastList) => {
  if (!forecastList || forecastList.length === 0) return null;
  const todayStr = new Date().toLocaleDateString("en-CA");
  const entries = forecastList.filter((item) => item.dt_txt.startsWith(todayStr));
  if (entries.length === 0) return null;
  return {
    tempMin: Math.round(Math.min(...entries.map((e) => e.main.temp_min))),
    tempMax: Math.round(Math.max(...entries.map((e) => e.main.temp_max))),
  };
};

const parseData = (data) => ({
  temp: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  tempMin: Math.round(data.main.temp_min),
  tempMax: Math.round(data.main.temp_max),
  city: data.name,
  country: data.sys.country,
  pressure: data.main.pressure,
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  windDeg: data.wind.deg,
  visibility: ((data.visibility || 0) / 1000).toFixed(1),
  clouds: data.clouds.all,
  sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  description: data.weather[0].description,
  icon: data.weather[0].icon,
  condition: data.weather[0].main,
  timezone: data.timezone,
  lat: data.coord.lat,
  lon: data.coord.lon,
});

const fetchCityPhoto = async (cityName) => {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail?.source ?? null;
  } catch {
    return null;
  }
};

const HISTORY_KEY = "weatherHistory";
const MAX_HISTORY = 5;
const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
};

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [cityPhoto, setCityPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("C");
  const [history, setHistory] = useState(loadHistory);

  const pushHistory = (city, country) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.city !== city);
      const next = [{ city, country }, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleData = async (raw, forecastList) => {
    const parsed = parseData(raw);
    const todayMinMax = getTodayMinMax(forecastList);
    if (todayMinMax) {
      parsed.tempMin = todayMinMax.tempMin;
      parsed.tempMax = todayMinMax.tempMax;
    }
    setWeatherData(parsed);
    setForecast(forecastList);
    pushHistory(parsed.city, parsed.country);

    // fetch photo in background — doesn't block UI
    const photo = await fetchCityPhoto(parsed.city);
    setCityPhoto(photo);
  };

  const fetchBoth = async (params) => {
    const qs = new URLSearchParams({ ...params, appid: API_KEY, units: "metric" });
    const [wRes, fRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${qs}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${qs}`),
    ]);
    if (!wRes.ok) throw new Error(wRes.status === 404 ? "Город не найден" : "Ошибка загрузки данных");
    const [wData, fData] = await Promise.all([wRes.json(), fRes.ok ? fRes.json() : null]);
    return { weather: wData, forecastList: fData ? fData.list : null };
  };

  const searchByCity = async (city) => {
    if (!city.trim()) { setError("Введите название города"); setWeatherData(null); setForecast(null); setCityPhoto(null); return; }
    setLoading(true); setError(null); setCityPhoto(null);
    try {
      const { weather, forecastList } = await fetchBoth({ q: city });
      await handleData(weather, forecastList);
    } catch (err) { setError(err.message); setWeatherData(null); setForecast(null); }
    finally { setLoading(false); }
  };

  const searchByCoords = async (lat, lon) => {
    setLoading(true); setError(null); setCityPhoto(null);
    try {
      const { weather, forecastList } = await fetchBoth({ lat, lon });
      await handleData(weather, forecastList);
    } catch (err) { setError(err.message); setWeatherData(null); setForecast(null); }
    finally { setLoading(false); }
  };

  const condition = weatherData?.condition || null;

  return (
    <div className={`wrapper ${condition ? getBgClass(condition) : ""}`}>
      <Particles condition={condition} />

      <div className="card">
        <div className="left-panel">
          <Info
            timezone={weatherData?.timezone ?? null}
            cityName={weatherData?.city ?? null}
            cityPhoto={cityPhoto}
            lat={weatherData?.lat ?? null}
            lon={weatherData?.lon ?? null}
          />
        </div>
        <div className="right-panel">
          <SearchForm onSearch={searchByCity} onGeoSearch={searchByCoords} history={history} />
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <Weather
              data={weatherData}
              error={error}
              unit={unit}
              onToggleUnit={() => setUnit((u) => (u === "C" ? "F" : "C"))}
            />
          )}
        </div>
      </div>

      {!loading && forecast && (
        <Forecast list={forecast} unit={unit} />
      )}
    </div>
  );
};

export default App;
