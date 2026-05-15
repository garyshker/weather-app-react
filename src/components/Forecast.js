import React from "react";

const DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const parseDays = (list) => {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const dayMap = {};

  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (date === todayStr) return;
    if (!dayMap[date] || item.dt_txt.includes("12:00:00")) {
      dayMap[date] = item;
    }
  });

  return Object.values(dayMap).slice(0, 5);
};

const toF = (c) => Math.round(c * 9 / 5 + 32);
const conv = (c, unit) => unit === "F" ? toF(c) : Math.round(c);

const Forecast = ({ list, unit }) => {
  if (!list || list.length === 0) return null;

  const days = parseDays(list);
  const deg = unit === "F" ? "°F" : "°C";

  return (
    <div className="forecast-strip">
      {days.map((day) => {
        const date = new Date(day.dt * 1000);
        const dayName = DAYS[date.getDay()];
        const dateLabel = date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

        return (
          <div className="forecast-card" key={day.dt}>
            <div className="forecast-day">{dayName}</div>
            <div className="forecast-date">{dateLabel}</div>
            <img
              className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
            />
            <div className="forecast-desc">{day.weather[0].description}</div>
            <div className="forecast-temps">
              <span className="forecast-max">{conv(day.main.temp_max, unit)}{deg}</span>
              <span className="forecast-min">{conv(day.main.temp_min, unit)}{deg}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Forecast;
