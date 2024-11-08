import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_BOOK_DETAIL_API_URL } from '../../util/apiUrl';
// 컴포넌트
import BookReviewChart from './BookReviewChart';
import BookReviews from './BookReviews';
import { useSelector } from 'react-redux';
import './BookDetail.css';

const BookDetail = () => {
  const navigate = useNavigate();
  const { bookId } = useParams(); // useParams 훅으로 bookId 가져오기
  const [bookDetail, setBookDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redux에서 사용자 번호 가져오기
  const user = useSelector((state) => state.auth.user);
  const memberNum = user ? user.memberNum : null;

  useEffect(() => {
    fetchBookDetail();
  }, [bookId]);

  const fetchBookDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(GET_BOOK_DETAIL_API_URL(bookId)); // 책의 상세 정보 요청
      console.log('Data fetched successfully:', response.data);

      setBookDetail(response.data); // 상세 정보 상태로 설정
    } catch (error) {
      console.error('Error fetching book details:', error);
      setError('Failed to load book details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    if (memberNum) {
      // 전달되는 bookId와 memberNum을 확인하는 로그 추가
      console.log('Navigating to Stella with bookId and memberNum:', {
        bookId,
        memberNum,
      });

      // 사용자 번호와 책 번호를 URL에 포함하여 navigate
      navigate(`/chatstella/${bookId}?memberNum=${memberNum}`);
    } else {
      const shouldNavigateToLogin = window.confirm(
        '회원 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?'
      );
      // 사용자 번호가 없으면 확인/취소 선택 메시지
      if (shouldNavigateToLogin) {
        navigate('/login'); // 확인을 누른 경우 로그인 페이지로 이동
      }
      // 취소를 누른 경우 아무 작업도 하지 않음 (현재 페이지에 그대로 머무름)
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-detail-container">
      <div className="booklist-pagetitle">BOOK LIST</div>
      <div className="book-detail-wrapper">
        {bookDetail ? (
          <>
            <div className="book-detail-top">
              <div className="book-detail-left">
                <img
                  src={bookDetail.book_cover || 'default-placeholder-image-url'}
                  alt={bookDetail.book_title}
                  className="book-detail-thumbnail"
                />
              </div>
              <div className="book-detail-right">
                <div className="book-detail-labels">
                  {bookDetail.is_book_best && (
                    <span className="label-best-seller">베스트 셀러</span>
                  )}
                  <span className="label-genre">
                    {bookDetail.genre_tag_name}
                  </span>
                </div>
                <h2 className="book-detail-title">{bookDetail.book_title}</h2>
                <p className="book-detail-rating">
                  <span className="rating-score">
                    ★ {bookDetail.average_rating}
                  </span>
                  <span className="review-count">
                    {' '}
                    ({bookDetail.review_count})
                  </span>
                </p>
                <div className="book-detail-info">
                  <p>
                    <strong>저자:</strong> {bookDetail.book_author}
                  </p>
                  <p>
                    <strong>출판사:</strong> {bookDetail.book_publisher}
                  </p>
                  <p>
                    <strong>출판일:</strong>{' '}
                    {new Date(bookDetail.publish_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>정가:</strong> {bookDetail.book_price} KRW
                  </p>
                  <p>
                    <strong>ISBN:</strong> {bookDetail.isbn}
                  </p>
                </div>
              </div>
            </div>
            <div className="book-detail-desc">
              <div className="book-detal-desc-line"></div>
              <h3>DESCRIPTION</h3>
              <p>{bookDetail.book_description}</p>
            </div>
            <div className="book-review-area">
              <BookReviewChart />
              <BookReviews />
            </div>
            <button className="chatbot" onClick={handleStartChat}>
              채팅 시작
            </button>
            {/* 채팅 시작 버튼 */}
          </>
        ) : (
          <p>No details available for this book.</p>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
