import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GET_TOP_BOOKS_API_URL } from "../../util/apiUrl";


const TopOfBookList = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchTopBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(GET_TOP_BOOKS_API_URL);
        setTopBooks(response.data);
      } catch (error) {
        console.error("Error fetching top books:", error);
        setError("데이터를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, []);

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Variables to handle dragging
  let isDragging = false;
  let startX;

  const handleMouseDown = (e) => {
    isDragging = true;
    startX = e.pageX;
    e.target.closest('.book-list-container').style.cursor = 'grabbing';
  };

  const handleMouseUp = (e) => {
    isDragging = false;
    e.target.closest('.book-list-container').style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = e.target.closest('.book-list-container');
    container.scrollLeft -= e.movementX;
  };


  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div style={{ padding: "20px", width: "100%", textAlign: "center" }}>
      <h2 style={{
        fontFamily:"var(--font-en)",
        fontSize: "40px",
        marginBottom: "20px",
        fontWeight:"bold",
        color:"var(--text-point)"
      }}>
        THE MOST BELOVED BOOK IN LAPOEM
      </h2>
      <div
        className="book-list-container"
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          width: "100%",
          marginBottom: "80px",
          padding: "17px 0",
          cursor: "grab",
          scrollbarWidth: "none", // Firefox
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        {topBooks.map((book, index) => (
          <div
            key={book.book_id}
            onClick={() => handleBookClick(book.book_id)}
            style={{
              flex: "0 0 auto",
              textAlign: "center",
              cursor: "pointer"
            }}
          >
            <img
              src={book.book_cover}
              alt={book.book_title}
              style={{
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                objectFit: "cover",
                border: index === 0 ? "5px solid gold" : "2px solid var(--text-gray-light)"
              }}
            />
            <p style={{ fontSize: "1em", marginTop: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {book.book_title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default TopOfBookList;
