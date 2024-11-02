import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    onSearch(searchTerm); // 부모 컴포넌트에 검색어 전달
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by title, author, or publisher"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearchClick}>Search</button>
    </div>
  );
};

export default SearchBar;
