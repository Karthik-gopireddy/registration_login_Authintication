import React, { useState } from 'react';
import './index.css';

const HomePage = () => {
  const [searchType, setSearchType] = useState('Name');
  const [query, setQuery] = useState('');

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    // Implement your search logic here
    alert(`Searching for ${query} by ${searchType}`);
  };

  return (
    <div className="homepage">
      <div className="image-container">
        <img src="https://via.placeholder.com/150" alt="Placeholder" />
      </div>
      <div className="search-container">
        <select value={searchType} onChange={handleSearchTypeChange}>
          <option value="Name">Name</option>
          <option value="City">City</option>
          <option value="Type">Type</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default HomePage;
