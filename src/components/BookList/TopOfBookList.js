import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GET_TOP_BOOKS_API_URL } from "../../util/apiUrl";
import heartRating from '../../assets/images/heart-rating.png';

const TopOfBookList = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div style={{ padding: "10px", width: "100%", textAlign: "center" }}>
      <h2 style={{
        fontFamily: "var(--font-en)",
        fontSize: "35px",
        marginBottom: "20px",
        fontWeight: "var(--font-semibold-weight)",
        color: "var(--text-point)"
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
          scrollbarWidth: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        {topBooks.map((book) => (
          <Link
            to={`/book_list/${book.book_id}`}
            key={book.book_id}
            style={{
              flex: "0 0 auto",
              textAlign: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src={book.book_cover}
              alt={book.book_title}
              style={{
                marginLeft: "10px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--text-gray-light)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.25)",
              }}
            />
            <p style={{ fontSize: "1em", marginTop: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {book.book_title}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5px" }}>
              <img src={heartRating} alt="Heart Rating" style={{ width: "16px", height: "16px", marginRight: "5px" }} />
              <span style={{ fontSize: "0.9em", color: "var(--text-secondary)" }}>
                {book.average_rating} ({book.review_count})
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopOfBookList;