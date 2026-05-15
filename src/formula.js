import React, { useState, useEffect, useRef } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;

const SearchForm = ({ onSearch, onGeoSearch, history }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced autocomplete
  useEffect(() => {
    if (city.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
        );
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(city);
  };

  const handleSuggestion = (s) => {
    setCity(s.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onGeoSearch(s.lat, s.lon);
  };

  const handleGeo = () => {
    if (!navigator.geolocation) { alert("Геолокация не поддерживается браузером"); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setGeoLoading(false); onGeoSearch(pos.coords.latitude, pos.coords.longitude); },
      () => { setGeoLoading(false); alert("Не удалось определить местоположение"); }
    );
  };

  return (
    <div className="search-wrapper">
      <div className="search-row">
        <div className="search-input-wrap" ref={wrapperRef}>
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="search-input"
              type="text"
              value={city}
              onChange={(e) => { setCity(e.target.value); setShowSuggestions(true); }}
              placeholder="Введите название города..."
              autoComplete="off"
            />
            <button className="search-btn" type="submit">Найти</button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((s, i) => (
                <li key={i} className="suggestion-item" onMouseDown={() => handleSuggestion(s)}>
                  <span className="suggestion-name">{s.name}</span>
                  <span className="suggestion-meta">
                    {[s.state, s.country].filter(Boolean).join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className={`geo-btn${geoLoading ? " geo-loading" : ""}`}
          type="button"
          onClick={handleGeo}
          title="Моё местоположение"
        >
          {geoLoading ? "⏳" : "📍"}
        </button>
      </div>

      {history.length > 0 && (
        <div className="history-row">
          {history.map((h) => (
            <button
              key={h.city}
              className="history-chip"
              onClick={() => { setCity(h.city); onSearch(h.city); }}
            >
              {h.city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchForm;
