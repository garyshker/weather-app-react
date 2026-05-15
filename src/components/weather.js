import React from "react";

const Weather = ({ data, error }) => {
  if (error) {
    return <div className="error-msg">{error}</div>;
  }

  if (!data) {
    return (
      <div className="placeholder-state">
        <div className="placeholder-icon">🌍</div>
        <p className="placeholder-text">Введите название города для поиска погоды</p>
      </div>
    );
  }

  const stats = [
    { icon: "🌡️", value: `${data.feelsLike}°C`, label: "Ощущается" },
    { icon: "💧", value: `${data.humidity}%`, label: "Влажность" },
    { icon: "💨", value: `${data.windSpeed} м/с`, label: "Ветер" },
    { icon: "🔵", value: `${data.pressure} гПа`, label: "Давление" },
    { icon: "🌅", value: data.sunrise, label: "Рассвет" },
    { icon: "🌇", value: data.sunset, label: "Закат" },
  ];

  return (
    <div className="weather-content">
      <div className="weather-header">
        <img
          className="weather-icon"
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
        />
        <div className="weather-temp">
          {data.temp}<span>°C</span>
        </div>
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
