import React, { useMemo } from "react";

const Particles = ({ condition }) => {
  const rainDrops = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: (i * 4.7 + 1.3) % 100,
      delay: (i * 0.09) % 1.4,
      duration: 0.55 + (i % 5) * 0.12,
      height: 14 + (i % 6) * 4,
      opacity: 0.35 + (i % 4) * 0.1,
    })), []);

  const snowFlakes = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: (i * 3.8 + 0.9) % 100,
      delay: (i * 0.21) % 5,
      duration: 4 + (i % 6),
      size: 9 + (i % 5) * 3,
      opacity: 0.3 + (i % 4) * 0.15,
      drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 5),
    })), []);

  const cloudPuffs = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      top: 15 + i * 18,
      delay: i * 1.8,
      duration: 18 + i * 6,
      size: 80 + i * 40,
      opacity: 0.04 + i * 0.015,
    })), []);

  if (condition === "Rain" || condition === "Drizzle") {
    return (
      <div className="particles">
        {rainDrops.map((d) => (
          <div
            key={d.id}
            className="rain-drop"
            style={{
              left: `${d.left}%`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              height: `${d.height}px`,
              opacity: d.opacity,
            }}
          />
        ))}
      </div>
    );
  }

  if (condition === "Snow") {
    return (
      <div className="particles">
        {snowFlakes.map((f) => (
          <span
            key={f.id}
            className="snowflake"
            style={{
              left: `${f.left}%`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
              fontSize: `${f.size}px`,
              opacity: f.opacity,
              "--drift": `${f.drift}px`,
            }}
          >
            ❄
          </span>
        ))}
      </div>
    );
  }

  if (condition === "Thunderstorm") {
    return (
      <div className="particles">
        <div className="lightning-flash" />
        <div className="lightning-flash" style={{ animationDelay: "2.3s", animationDuration: "5.7s" }} />
      </div>
    );
  }

  if (condition === "Clear") {
    return (
      <div className="particles">
        <div className="sun-glow" />
      </div>
    );
  }

  if (condition === "Clouds" || condition === "Mist" || condition === "Fog" || condition === "Haze") {
    return (
      <div className="particles">
        {cloudPuffs.map((c) => (
          <div
            key={c.id}
            className="cloud-puff"
            style={{
              top: `${c.top}%`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              width: `${c.size}px`,
              height: `${c.size / 2}px`,
              opacity: c.opacity,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default Particles;
