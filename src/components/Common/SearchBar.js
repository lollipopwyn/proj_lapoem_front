import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { GET_SEARCH_BOOKS_API_URL } from '../../util/apiUrl';
import './Common.css';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState(''); // 검색어 상태

  // 검색 버튼 클릭 시 호출되는 함수
  const handleSearch = async () => {
    if (keyword.trim() === '') return; // 빈 검색어로는 검색하지 않음

    try {
      // API 호출
      const response = await axios.get(GET_SEARCH_BOOKS_API_URL, {
        params: { keyword },
      });
      onSearch(response.data); // 부모 컴포넌트의 onSearch 함수 호출
    } catch (error) {
      console.error('Error fetching search results:', error);
      // 필요에 따라 에러 핸들링 로직 추가 가능
    }
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)} // 검색어 입력 시 상태 업데이트
        placeholder="책 제목 또는 저자 검색..."
      />
      <button onClick={handleSearch}>검색</button> {/* 검색 버튼 */}
    </div>
  );
};

// PropTypes를 사용하여 props의 타입 정의
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired, // onSearch는 필수 props
};

export default SearchBar;
