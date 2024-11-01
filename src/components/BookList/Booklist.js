import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Booklist = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // 컴포넌트가 마운트될 때 북 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8002/book-list');
        setBooks(response.data); // API에서 받은 데이터로 상태 업데이트
      } catch (error) {
        console.error('Error fething books', error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <div className="booklist_wrapper">BOOK LIST</div>
      <div className="booklist_search">
        <input
          type="text"
          placeholder="책 제목으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} // 검색어 상태 업데이트
        />
      </div>
      <div className="booklist_hot">핫북 리스트</div>
      <div className="booklist_content">전체책</div>
      <div className="booklist_page">페이지 네이션</div>
    </div>
  );
};

export default Booklist;
