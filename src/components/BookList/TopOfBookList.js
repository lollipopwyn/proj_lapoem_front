import React, { useEffect, useState } from "react";
import axios from "axios";
import { GET_TOP_BOOKS_API_URL } from "../../util/apiUrl";


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

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div style={{ padding: "20px", width: "100%", textAlign: "center" }}>
      <h2 style={{ 
        fontFamily:"var(--font-en)",
        fontSize: "40px", 
        marginBottom: "20px" , 
        fontWeight:"bold",
        color:"var(--text-point)"}}>
      THE MOST BELOVED BOOK IN LAPOEM
      </h2>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          width: "100%",
        //   maxWidth: "1200px", 
          marginBottom: "80px",
          padding: "17px 0",
        }}
      >
        {topBooks.map((book, index) => (
          <div
            key={book.book_id}
            style={{
              flex: "0 0 auto",
              textAlign: "center",
            }}
          >
            <img
              src={book.book_cover}
              alt={book.book_title}
              style={{
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                objectFit: "cover",
                border: index === 0 ? "5px solid gold" : "2px solid var(--text-gray-light)", // 1등 책에 금색 테두리 적용
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
