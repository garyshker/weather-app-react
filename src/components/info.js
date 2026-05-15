import React from "react";

const Info = () => {
  const dateStr = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <React.Fragment>
      <div>
        <div className="app-logo">⛅</div>
        <h1 className="app-title">Weather App</h1>
        <p className="app-subtitle">Актуальная погода в любой точке мира</p>
      </div>
      <p className="app-date">{dateStr}</p>
    </React.Fragment>
  );
};

export default Info;
