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
import small_star from "../../assets/images/small_star.png";

const Threadon_post = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [limit] = useState(5); // 페이지당 표시할 책의 수, 검색 시에도 5개로 제한
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedBook, setSelectedBook] = useState(null); // 선택된 도서 상태 추가

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

  // 선택된 도서를 상태에 저장하는 함수
  const handleBookSelect = (book) => {
    console.log("Selected book:", book); // 클릭된 도서의 객체 데이터 확인
    setSelectedBook(book);
  };

  return (
    <div className="thread-container">
      {/* <h1 className="thread-header">THREAD ON</h1> */}
      <div className="new_thread_book_search">
        <div className="flex">
          <CategoryFilter onCategoryChange={handleCategoryChange} />
          <SearchBar
            apiUrl={GET_SEARCH_BOOKS_API_URL}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* 선택한 도서 정보 영역 */}
      <div className="selected-book-container">
        <div>
          {selectedBook ? (
            <div className="selected-box">
              <img
                className="selected-book"
                src={selectedBook.book_cover}
                alt="책 표지"
                onClick={() => setSelectedBook(null)}
              />
              <button className="post-thread-button">Post Thread</button>
            </div>
          ) : (
            <div className="placeholder-image" />
          )}
        </div>

        <div className="selected-book-details ml-7 pt-8">
          {selectedBook ? (
            <>
              <h2>{selectedBook.book_title}</h2>
              <div className="book-star thread-star">
                <img
                  src={small_star}
                  alt="아이콘"
                  className="small_star w-5 h-5"
                />
                <p className="average_star">{selectedBook.average_rating}</p>
                <p className="comment_total_people">
                  ({selectedBook.review_count})
                </p>
              </div>
              <div className="book-info-row">
                <div className="book-info-left">
                  <p>저자</p>
                  <p>출판사</p>
                  <p>출판일</p>
                </div>
                <div className="book-info-right">
                  <p>{selectedBook.book_author}</p>
                  <p>{selectedBook.book_publisher}</p>
                  <p>
                    {new Date(selectedBook.publish_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p>도서를 선택해주세요.</p>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="booklist_wrapper thread-book-list">
          <div className="booklist_content">
            {books.map((book) => (
              <div
                key={book.book_id}
                onClick={() => handleBookSelect(book)} // 감싸는 div에 클릭 이벤트 추가
                style={{ cursor: "pointer" }} // 포인터 커서 추가
              >
                <BookCard
                  thumbnail={book.book_cover}
                  title={book.book_title}
                  author={book.book_author}
                  publisher={book.book_publisher}
                  rating={book.average_rating}
                  reviewCount={book.review_count}
                  bookId={book.book_id}
                  disableLink={true} // Link 비활성화
                />
              </div>
            ))}
          </div>
          <div className="pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalBooks / limit)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Threadon_post;
