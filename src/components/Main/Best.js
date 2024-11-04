import React, { useEffect, useState } from "react";
import BookCard from "../Bookcard";
import "./best.css";

return (
  <section className="new-container">
    <div className="new-title">
      <h2>MONTHLY BEST SELLERS</h2>
      <p>월간 베스트 셀러! 화제가 된 작품들을 만나보세요 📚</p>
    </div>
    <div className="book_list flex gap-10">
      {latestBooks.map((book) => (
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

export default Releases;
