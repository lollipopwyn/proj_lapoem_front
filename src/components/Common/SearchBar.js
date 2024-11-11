import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./Common.css";

const SearchBar = ({ apiUrl, onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = async () => {
    if (keyword.trim() === "") return;

    try {
      const response = await axios.get(apiUrl, {
        params: { keyword },
      });
      onSearch(response.data, keyword); // 검색어와 함께 검색 결과 전달
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="책 제목 또는 저자 검색..."
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

SearchBar.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
