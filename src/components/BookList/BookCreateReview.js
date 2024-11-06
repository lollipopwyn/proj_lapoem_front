import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CREATE_BOOK_REVIEW_API_URL } from '../../util/apiUrl';
import heartRating from '../../assets/images/heart-rating.png';
import heartRatingHalf from '../../assets/images/heart-half-rating.png';
import heartRatingEmpty from '../../assets/images/heart-rating-empty.png';

import './Booklist.css';

const BookCreateReview = () => {
  const { bookId } = useParams();
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // Hovered rating

  const member_num = useSelector((state) => state.auth.user?.memberNum);

  useEffect(() => {
    console.log('Redux member_num:', member_num); // Redux에서 member_num 확인
  }, [member_num]); // member_num이 변경될 때마다 실행

  const handleReviewSubmit = async () => {
    if (!member_num) {
      alert('회원 로그인이 필요합니다.'); // 로그인 확인
      console.log('User not logged in'); // 로그인 확인 콘솔 출력
      return;
    }
    console.log('Logged in user:', member_num);

    try {
      const response = await axios.post(
        CREATE_BOOK_REVIEW_API_URL(bookId),
        {
          review_content: reviewContent,
          rating,
          member_num,
        },
        { withCredentials: true }
      );

      console.log('Review successfully posted:', response.data); // 리뷰 작성 성공 시 콘솔 출력
      setReviewContent(''); // 리뷰 내용 초기화
      setRating(0); // 평점 초기화
    } catch (error) {
      console.error('Error posting review:', error); // 에러 발생 시 콘솔 출력
    }
  };

  // 별점 처리
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const score = i * 2; // 2, 4, 6, 8, 10 점

      // 반 개 하트 여부를 판단하는 함수
      const handleMouseEnter = (e) => {
        const halfWidth = e.target.offsetWidth / 2; // 하트의 절반 너비
        const mouseX = e.clientX - e.target.getBoundingClientRect().left; // 마우스 위치 (좌측 기준)
        if (mouseX < halfWidth) {
          setHoverRating(i * 2 - 1); // 마우스가 왼쪽 절반에 있을 때 반 개 하트
        } else {
          setHoverRating(i * 2); // 마우스가 오른쪽 절반에 있을 때 전체 하트
        }
      };

      const handleMouseLeave = () => {
        setHoverRating(0); // 마우스가 벗어나면 기본 상태로
      };

      // 채워진 하트 이미지 결정
      let starImage;
      if (score <= (hoverRating || rating)) {
        // 색이 채워진 경우
        if (hoverRating === i * 2 - 1 || rating === i * 2 - 1) {
          // 반개 하트일 때
          starImage = heartRatingHalf;
        } else {
          // 전체 하트일 때
          starImage = heartRating;
        }
      } else {
        starImage = heartRatingEmpty; // 빈 하트
      }

      stars.push(
        <img
          key={i}
          src={starImage} // 반개 하트 또는 전체 하트 전환
          alt={`star-${i}`}
          className="star"
          onClick={() => setRating(i * 2)} // 클릭 시 해당 점수 설정
          onMouseEnter={handleMouseEnter} // 마우스 올리면 반개 하트로 색 변화 (0.5 단위)
          onMouseMove={handleMouseEnter} // 마우스 이동할 때도 색 변화
          onMouseLeave={handleMouseLeave} // 마우스가 벗어나면 기본 상태로
        />
      );
    }
    return stars;
  };

  return (
    <div className="book-review-create">
      <div
        className="book-review-box"
        contentEditable
        onInput={(e) => setReviewContent(e.currentTarget.textContent)}
        placeholder="책에 대한 리뷰를 작성해주세요."
        suppressContentEditableWarning={true}
      ></div>
      <div className="book-rating">
        {renderStars()}
        <span className="score">{hoverRating || rating}/10</span>
      </div>
      <button onClick={handleReviewSubmit}>Submit Review</button>
    </div>
  );
};

export default BookCreateReview;
