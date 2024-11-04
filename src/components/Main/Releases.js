import React, { useEffect, useState } from "react";
import BookCard from "../Bookcard";
import "./Releases.css";
import { GET_NEW_BOOK_API_URL } from "../../util/apiUrl";

function Releases() {
  const [newBooks, setNewBooks] = useState([]);

  useEffect(() => {
    const fetchNewBooks = async () => {
      try {
        const response = await fetch(GET_NEW_BOOK_API_URL);
        const data = await response.json();
        setNewBooks(data); // 받아온 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching new books:", error);
      }
    };

    fetchNewBooks();
  }, []);

  return (
    <section className="new-container">
      <div className="new-title">
        <h2>SPOTLIGHT ON NEW RELEASES</h2>
        <p>새로 나온 주목할만한 작품들을 만나보세요 ✨</p>
      </div>
      <div className="book_list flex gap-10">
        {newBooks.map((book) => (
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
    </section>
  );
}

export default Releases;
