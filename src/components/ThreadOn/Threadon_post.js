import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../Common/SearchBar";
import {
  GET_BOOK_BY_CATEGORY_API_URL,
  GET_BOOK_LIST_API_URL,
  GET_SEARCH_BOOKS_API_URL,
} from "../../util/apiUrl";
import CategoryFilter from "../Common/CategoryFilter";
import Pagination from "../PageNation";
import BookCard from "../Bookcard";
import "./Threadon_post.css";

const Threadon_post = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [limit] = useState(5); // 페이지당 표시할 책의 수, 검색 시에도 5개로 제한
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchBooks(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const fetchBooks = async (page, genre_tag_id) => {
    setLoading(true);
    try {
      const apiUrl = genre_tag_id
        ? GET_BOOK_BY_CATEGORY_API_URL
        : GET_BOOK_LIST_API_URL;
      const params = { page, limit, genre_tag_id }; // limit을 항상 추가

      const response = await axios.get(apiUrl, { params });
      setBooks(response.data.data.slice(0, limit)); // 항상 limit만큼 데이터 표시
      setTotalBooks(response.data.totalBooks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  // 검색 결과를 처리하는 함수
  const handleSearch = (data) => {
    setBooks(data.data.slice(0, limit)); // 검색 결과 중 상위 5개만 도서 목록 업데이트
    setTotalBooks(data.totalBooks); // 총 도서 수 업데이트
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
    setSelectedCategory(""); // 검색 시 선택된 카테고리 초기화
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // 선택한 카테고리 ID로 상태 업데이트
    setCurrentPage(1); // 필터 변경 시 페이지를 1로 초기화
  };

  const totalPages = Math.ceil(totalBooks / limit); // 총 페이지 수 계산

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="thread-container">
      <h1 className="thread-header">THREAD ON</h1>
      <div className="new_thread_book_search">
        <CategoryFilter onCategoryChange={handleCategoryChange} />
        <SearchBar apiUrl={GET_SEARCH_BOOKS_API_URL} onSearch={handleSearch} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="booklist_wrapper">
          <div className="booklist_content">
            {books.map((book) => (
              <BookCard
                key={book.book_id}
                thumbnail={book.book_cover}
                title={book.book_title}
                author={book.book_author}
                publisher={book.book_publisher}
                rating={book.average_rating}
                reviewCount={book.review_count}
              />
            ))}
          </div>
          <div className="pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange} // 페이지 변경 핸들러 전달
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Threadon_post;
