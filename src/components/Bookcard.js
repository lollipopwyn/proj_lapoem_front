import React from "react";

function BookCard({
  thumbnail,
  title,
  author,
  publisher,
  rating,
  reviewCount,
}) {
  return (
    <div className="book-card">
      <div className="book-thumbnail">
        <img src={thumbnail} alt="책 썸네일" />
      </div>
      <div className="book-info">
        <p>{title}</p>
        <div>
          <p>
            {author}
            <p> · </p>
            {publisher}
          </p>
        </div>
        <p>
          <img src="/path/to/icon.png" alt="아이콘" />
          {rating} ({reviewCount})
        </p>
      </div>
    </div>
  );
}

export default BookCard;
