import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GET_BOOK_LIST_API_URL,
  GET_SEARCH_BOOKS_API_URL,
} from '../../util/apiUrl';
import Pagination from '../PageNation';
import './Booklist.css';
import SearchBar from '../Common/SearchBar';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [limit] = useState(10); // 페이지당 표시할 책의 수
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const fetchBooks = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(GET_BOOK_LIST_API_URL, {
        params: { page, limit },
      });
      setBooks(response.data.data);
      setTotalBooks(response.data.totalBooks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };
  // 검색 결과를 처리하는 함수
  const handleSearch = (data) => {
    setBooks(data.data); // 검색 결과로 도서 목록 업데이트
    setTotalBooks(data.totalBooks); // 총 도서 수 업데이트
    setCurrentPage(data.currentPage); // 현재 페이지 업데이트
  };

  const totalPages = Math.ceil(totalBooks / limit); // 총 페이지 수 계산

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="booklist_wrapper">
      <h1 className="booklist_pagetitle">Book List</h1>
      <SearchBar onSearch={handleSearch} /> {/* SearchBar 컴포넌트 사용 */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul className="booklist_content">
            {books.map((book, index) => (
              <li key={book.book_id}>
                <div className="booklist_item">
                  <p key={book.genre_tag_id}></p>
                  <p className="booklist_cover ">
                    <img src={book.book_cover} alt={book.book_title} />
                  </p>

                  <h2>{book.book_title}</h2>
                  <p>{book.book_author}</p>
                  <p>{book.book_publisher}</p>
                  <p>평점: 8.2(10)</p>
                </div>
                {(index + 1) % 5 === 0 && <div className="booklist_clear" />}{' '}
                {/* 5개마다 줄 바꿈 */}
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange} // 페이지 변경 핸들러 전달
          />
        </>
      )}
    </div>
  );
};

export default BookList;
