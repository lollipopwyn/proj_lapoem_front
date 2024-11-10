import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
import {
  GET_THREADS_DETAIL_API_URL,
  GET_THREADS_COMMENTS_API_URL,
  POST_THREAD_COMMENT_API_URL,
} from "../../util/apiUrl";

function ThreadDetailPage() {
  const { thread_num } = useParams();
  const navigate = useNavigate();

  // 스레드 정보 및 댓글 상태
  const [threadDetail, setThreadDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [offset, setOffset] = useState(0);
  const COMMENTS_LIMIT = 5;

  // 스레드 상세 정보 불러오기
  useEffect(() => {
    const fetchThreadDetail = async () => {
      try {
        const response = await axios.get(
          GET_THREADS_DETAIL_API_URL(thread_num)
        );
        setThreadDetail(response.data);
      } catch (error) {
        console.error("Error fetching thread details:", error);
      }
    };

    fetchThreadDetail();
  }, [thread_num]);

  // 댓글 목록 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          GET_THREADS_COMMENTS_API_URL(thread_num),
          {
            params: { offset, limit: COMMENTS_LIMIT },
          }
        );
        setComments((prevComments) => [
          ...prevComments,
          ...response.data.comments,
        ]);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [thread_num, offset]);

  // 새로운 댓글 작성
  const handleAddComment = async () => {
    try {
      await axios.post(POST_THREAD_COMMENT_API_URL(thread_num), {
        member_num: 1, // 예제: 회원 번호를 직접 입력 (실제 환경에서는 인증된 사용자 정보 사용)
        thread_content: newComment,
      });
      setNewComment("");
      setOffset(0);
      setComments([]); // 댓글 목록 초기화 후 다시 불러오기
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // 더보기 버튼 클릭 시 추가 댓글 불러오기
  const handleLoadMoreComments = () => {
    setOffset((prevOffset) => prevOffset + COMMENTS_LIMIT);
  };

  return (
    <div className="thread-detail-container">
      {/* 상단 정보 */}
      <header className="thread-detail-header">
        <button onClick={() => navigate("/thread_on")}>&lt; Back</button>
        {threadDetail && (
          <>
            <img
              src={threadDetail.book_cover}
              alt="Book Cover"
              className="book-cover"
            />
            <h2>
              {threadDetail.book_title} ({threadDetail.book_author})
            </h2>
            <p>{threadDetail.thread_created_at}</p>
            <div className="thread-stats">
              <span>👤 {threadDetail.total_participants}</span>
              <span>💬 {threadDetail.total_comments}</span>
            </div>
          </>
        )}
      </header>

      {/* 댓글 섹션 */}
      <section className="comments-section">
        {comments.map((comment) => (
          <Comment key={comment.thread_content_num} comment={comment} />
        ))}
        {comments.length % COMMENTS_LIMIT === 0 && comments.length > 0 && (
          <button onClick={handleLoadMoreComments}>더보기</button>
        )}
      </section>

      {/* 새 댓글 입력 섹션 */}
      <section className="new-comment-section">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성하세요..."
          maxLength={300}
        />
        <button onClick={handleAddComment}>댓글 등록</button>
      </section>
      <button onClick={() => navigate("/thread_on")}>To List</button>
    </div>
  );
}

export default ThreadDetailPage;
