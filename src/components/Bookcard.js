import React from 'react';
import { Link } from 'react-router-dom';
import small_star from '../assets/images/small_star.png';
// import ex from "../assets/images/ex_image.jpg"; css 확인용 더미 이미지
import './Bookcard.css';

function BookCard({
  thumbnail,
  title,
  author,
  publisher,
  rating,
  reviewCount,
  bookId, // Pass bookId as a prop for navigation
}) {
  return (
    <Link to={`/book_list/${bookId}`} className="book-card-link">
      <div className="book-card">
        <div className="book-thumbnail mb-[10px]">
          <img src={thumbnail} alt="책 썸네일" />
          {/* <img src={ex} alt="책 썸네일" /> */}
        </div>

        <div className="book-info">
          <p className="book-title">{title}</p>
          {/* <p className="book-title">채식주의자</p> */}

          <div className="book-writer">
            <p>{`${author} · ${publisher}`}</p>
          </div>
          {/* <div className="book-writer">
          <p>한강</p>
          <p>·</p>
          <p>창비</p>
        </div> */}

          <div className="book-star">
            <img
              src={small_star}
              alt="아이콘"
              className="small_star w-[20px] h-[20px]"
            />
            <p className="average_star">{rating}</p>
            <p className="comment_total_people">({reviewCount})</p>
          </div>
          {/* <div className="book-star">
          <img src={small_star} alt="아이콘" className="small_star" />
          <p className="average_star">9.6</p>
          <p className="comment_total_people">(143)</p>
        </div> */}
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
