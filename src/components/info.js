import React, { useState, useEffect } from "react";

const getCityTime = (timezone) => {
  const utcMs = Date.now() + new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(utcMs + timezone * 1000);
};

const Info = ({ timezone, cityName, cityPhoto, lat, lon }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const displayTime = timezone != null ? getCityTime(timezone) : now;

  const timeStr = displayTime.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateStr = displayTime.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <React.Fragment>
      <div className="left-top">
        <div className="app-logo">⛅</div>
        <h1 className="app-title">Weather App</h1>
        <p className="app-subtitle">Актуальная погода в любой точке мира</p>

        {cityPhoto && (
          <div className="city-photo-wrap">
            <img
              className="city-photo"
              src={cityPhoto}
              alt={cityName}
            />
            {cityName && (
              <span className="city-photo-label">{cityName}</span>
            )}
          </div>
        )}

        {lat != null && lon != null && (
          <div className="windy-wrap">
            <iframe
              title="windy-map"
              className="windy-frame"
              src={`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&zoom=7&level=surface&overlay=wind&menu=&message=true&marker=true&metricWind=default&metricTemp=default`}
              frameBorder="0"
            />
            <p className="windy-label">📡 Windy — живая карта</p>
          </div>
        )}
      </div>

      <div className="left-bottom">
        <p className="app-time">{timeStr}</p>
        <p className="app-date">{dateStr}</p>
        {cityName && (
          <p className="app-tz-label">местное время · {cityName}</p>
        )}
      </div>
    </React.Fragment>
  );
};

export default Info;
