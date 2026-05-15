import React, { useState } from "react";

const SearchForm = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(city);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Введите название города..."
      />
      <button className="search-btn" type="submit">
        Найти
      </button>
    </form>
  );
};

export default SearchForm;
