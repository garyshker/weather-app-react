import React from "react";

const windDir = (deg) => {
  const dirs = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
  return dirs[Math.round(deg / 45) % 8];
};

const toF = (c) => Math.round(c * 9 / 5 + 32);
const conv = (c, unit) => unit === "F" ? toF(c) : c;

const Weather = ({ data, error, unit, onToggleUnit }) => {
  if (error) return <div className="error-msg">{error}</div>;

  if (!data) {
    return (
      <div className="placeholder-state">
        <div className="placeholder-icon">🌍</div>
        <p className="placeholder-text">Введите название города для поиска погоды</p>
      </div>
    );
  }

  const deg = unit === "F" ? "°F" : "°C";

  const iconAnimClass = {
    Clear: "icon-clear",
    Clouds: "icon-clouds",
    Rain: "icon-rain",
    Drizzle: "icon-rain",
    Snow: "icon-snow",
    Thunderstorm: "icon-thunder",
    Mist: "icon-mist",
    Fog: "icon-mist",
  }[data.condition] || "";

  const stats = [
    { icon: "🌡️", value: `${conv(data.feelsLike, unit)}${deg}`, label: "Ощущается" },
    { icon: "💧", value: `${data.humidity}%`, label: "Влажность" },
    { icon: "💨", value: `${data.windSpeed} м/с ${windDir(data.windDeg)}`, label: "Ветер" },
    { icon: "🔵", value: `${data.pressure} гПа`, label: "Давление" },
    { icon: "🌅", value: data.sunrise, label: "Рассвет" },
    { icon: "🌇", value: data.sunset, label: "Закат" },
    { icon: "👁️", value: `${data.visibility} км`, label: "Видимость" },
    { icon: "☁️", value: `${data.clouds}%`, label: "Облачность" },
  ];

  return (
    <div className="weather-content">
      <div className="weather-header">
        <img
          className={`weather-icon ${iconAnimClass}`}
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
        />
        <div className="weather-temp-block">
          <div className="weather-temp">
            {conv(data.temp, unit)}<span>{deg}</span>
          </div>
          <div className="weather-minmax">
            <span className="minmax-high" title="Максимум за день">
              ↑ {conv(data.tempMax, unit)}{deg}
            </span>
            <span className="minmax-sep">·</span>
            <span className="minmax-low" title="Минимум за день">
              ↓ {conv(data.tempMin, unit)}{deg}
            </span>
          </div>
        </div>
        <button className="unit-toggle" onClick={onToggleUnit} title="Переключить единицы">
          {unit === "C" ? "°F" : "°C"}
        </button>
      </div>
      <div className="weather-location">{data.city}, {data.country}</div>
      <div className="weather-description">{data.description}</div>
      <div className="weather-grid">
        {stats.map((s) => (
          <div className="weather-stat" key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
