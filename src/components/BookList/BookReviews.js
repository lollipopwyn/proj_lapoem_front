import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { GET_BOOK_REVIEWS_API_URL,DELETE_REVIEW_API_URL, GET_REVIEW_BY_ID_API_URL } from '../../util/apiUrl';
import './BookDetail.css';

const BookReviews = () => {
  const { bookId, reviewId} = useParams(); 
  console.log('Fetched bookId:', bookId); // 콘솔에 bookId 출력
  console.log('Fetched bookId:', reviewId); // 콘솔에 bookId 출력

  const dispatch = useDispatch();
  const member_num = useSelector((state) => state.auth.user?.memberNum);
  const [reviews, setReviews] = useState([]); // 리뷰 상태 초기화
  const [loading, setLoading] = useState(true); // 로딩 상태 초기화
  const [error, setError] = useState(null); // 에러 상태 초기화

  

  useEffect(() => {
    fetchReviews(); // bookId가 변경될 때마다 리뷰를 가져오는 함수 호출
  }, [bookId,reviewId]);

  const fetchReviews = async () => {
    if (!bookId) {
      // bookId가 유효한지 확인
      setError('유효하지 않은 책 ID입니다.'); // 에러 메시지 설정
      setLoading(false); // 로딩 해제
      return; // 함수 종료
    }

    setLoading(true); // 데이터 요청 시작 시 로딩 상태 설정
    setError(null); // 이전 에러 상태 초기화

    try {
      const response = await axios.get(GET_BOOK_REVIEWS_API_URL(bookId), { withCredentials: true }); // API 호출
      console.log('Fetched reviews:', response.data); // 가져온 데이터 콘솔에 출력
      setReviews(response.data); // 가져온 리뷰 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching book reviews:', error); // 에러 콘솔에 출력
      setError('리뷰를 가져오는 중 오류가 발생했습니다.'); // 에러 메시지 상태 설정
    } finally {
      setLoading(false); // 데이터 요청 완료 후 로딩 상태 해제
    }
  };

  const handleDeleteReview = async (reviewId) => {

    try {
      const response = await axios.get(GET_REVIEW_BY_ID_API_URL(bookId, reviewId), { withCredentials: true });
      const reviewToDelete = response.data;

      // 2. 리뷰가 유효한지 확인합니다.
      if (!reviewToDelete) {
        alert('해당 리뷰를 찾을 수 없습니다.');
        return;
      }

      // 3. 리뷰 작성자가 맞는지 확인
      if (reviewToDelete.member_num !== member_num) {
        alert('삭제 권한이 없습니다.');
        return;
      }


      const deleteResponse = await axios.delete(DELETE_REVIEW_API_URL(bookId, reviewId),{withCredentials: true}); // DELETE 요청 전송
      if (deleteResponse.status === 200) {
        setReviews((prevReviews) => prevReviews.filter((review) => review.review_num !== reviewId)); // UI에서 리뷰 제거
        alert('리뷰가 삭제되었습니다.');

      }
    } catch (error) {
      console.error('리뷰 삭제 중 오류 발생:', error);
      setError('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <p>로딩 중...</p>; // 로딩 중일 때 메시지 출력
  if (error) return <p>{error}</p>; // 에러가 있을 경우 에러 메시지 출력

  return (
    <div>
      <div className="book-review-list">
        <h2>Book Reviews</h2>
        {reviews.length > 0 ? ( // 리뷰가 있는지 체크
          <ul>
            {reviews.map((review) => (
              <li key={review.review_num}>
                <h3>{review.member_nickname}</h3> {/* 리뷰 작성자의 별명 */}
                <p>{review.review_content}</p> {/* 리뷰 내용 */}
                <p>Rating: {review.rating}</p> {/* 평점 */}
                <p>Date: {review.review_created_at}</p> {/* 작성 날짜 */}
                {member_num === review.member_num && (
                  <button onClick={() => handleDeleteReview(review.review_id)}>Delete</button>)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available.</p> // 리뷰가 없을 경우 메시지 출력
        )}
      </div>
    </div>
  );
};
export default BookReviews;
