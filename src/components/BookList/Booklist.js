import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookListData } from '../../redux/features/auth/apiSlice';

const Booklist = () => {
  const dispatch = useDispatch();

  const { fetchGetBookList, isError, errorMessage } = useSelector(
    (state) => state.api
  );
  // 페이지, 페이지 크기, 카테고리 상태 관리
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const loadBooks = () => {
      dispatch(fetchBookListData({ page, limit, category })) // API 호출
        .unwrap() // thunk로부터 반환된 값을 가져옴
        .then((data) => {
          console.log('Fetched Book List:', data);
        })
        .catch((error) => {
          console.error('Error fetching books:', error);
        });
    };
    loadBooks();
  }, [dispatch, page, limit, category]); // 의존성 배열에 추가된 값이 변경될 때마다 호출

  if (isError) {
    return <div>Error: {errorMessage}</div>;
  }
  return (
    <div>
      {fetchGetBookList === null ? (
        <p>Loading...</p>
      ) : isError ? (
        <div>Error: {errorMessage}</div>
      ) : (
        <div>
          <div className="booklist_wrapper">BOOK LIST</div>
          <div className="booklist_search">
            <input
              type="text"
              placeholder="책 제목으로 검색..."
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="booklist_hot">핫북 리스트</div>
          <div className="booklist_content">
            <ul>
              {fetchGetBookList.length > 0 ? (
                fetchGetBookList.map((book) => (
                  <li key={book.book_id}>
                    <p>
                      <img src={book.book_cover} alt={book.book_title} />
                    </p>
                    <h2>{book.book_title}</h2>
                    <p>{book.book_author}</p>
                    <p>{book.book_publisher}</p>
                    <p>평점: 8.2(10)</p>
                  </li>
                ))
              ) : (
                <li>책이 없습니다.</li>
              )}
            </ul>
            <div className="booklist_page">
              페이지 네이션
              <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
                이전
              </button>
              <span>PAGE {page}</span>
              <button onClick={() => setPage((prev) => prev + 1)}>다음</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booklist;
