import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import {
  GET_THREADS_DETAIL_API_URL,
  GET_THREADS_COMMENTS_API_URL,
  POST_THREAD_COMMENT_API_URL,
} from "../../util/apiUrl";

const ThreadDetailPage = () => {
  const { thread_num } = useParams(); // useParams를 통해 thread_num을 가져옵니다.
  const [threadDetail, setThreadDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const authData = useSelector((state) => state.auth.authData);
  const COMMENTS_LIMIT = 5;

  // 스레드 상세 정보 가져오기
  useEffect(() => {
    const fetchThreadDetail = async () => {
      try {
        const response = await fetch(GET_THREADS_DETAIL_API_URL(thread_num));
        const data = await response.json();
        setThreadDetail(data);
      } catch (error) {
        console.error("Error fetching thread detail:", error);
      }
    };

    if (thread_num) {
      fetchThreadDetail();
    }
  }, [thread_num]);

  // 부모 댓글 목록 가져오기 함수
  const fetchComments = async (currentOffset) => {
    try {
      const response = await fetch(
        `${GET_THREADS_COMMENTS_API_URL(
          thread_num
        )}?offset=${currentOffset}&limit=${COMMENTS_LIMIT}`
      );
      const data = await response.json();

      if (data.comments.length < COMMENTS_LIMIT) {
        setHasMoreComments(false); // 더 이상 가져올 댓글이 없을 경우
      }

      setComments((prevComments) => {
        // 새로운 댓글 중에서 기존 댓글과 중복되지 않은 댓글만 필터링
        const filteredComments = data.comments.filter(
          (newComment) =>
            !prevComments.some(
              (existingComment) =>
                existingComment.thread_content_num ===
                newComment.thread_content_num
            )
        );
        return [...prevComments, ...filteredComments];
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // 부모 댓글 목록 가져오기 (useEffect)
  useEffect(() => {
    if (thread_num) {
      setComments([]); // thread_num 변경 시 댓글 초기화
      setOffset(0);
      setHasMoreComments(true);
      fetchComments(0);
    }
  }, [thread_num]);

  // 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(POST_THREAD_COMMENT_API_URL(thread_num), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_num: authData.member_num,
          thread_content: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        setComments([]); // 새 댓글 작성 후 기존 댓글 초기화
        setOffset(0);
        setHasMoreComments(true);
        fetchComments(0); // 새 댓글 작성 후 부모 댓글 목록 다시 불러오기
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // 더보기 버튼 클릭 핸들러
  const handleLoadMoreComments = () => {
    const newOffset = offset + COMMENTS_LIMIT;
    setOffset(newOffset);
    fetchComments(newOffset);
  };

  return (
    <div className="thread-detail-page">
      {threadDetail && (
        <div className="thread-header">
          <img src={threadDetail.book_cover} alt="Book Cover" />
          <h1>{threadDetail.book_title}</h1>
          <p>등록일: {threadDetail.thread_created_at}</p>
          <p>총 참여자 수: {threadDetail.participant_count}</p>
          <p>댓글 및 대댓글 수: {threadDetail.total_comments}</p>
        </div>
      )}

      <div className="comments-section">
        {comments.map((comment) => (
          <Comment
            key={comment.thread_content_num}
            comment={comment}
            thread_num={thread_num}
          />
        ))}
        {/* {comments.map((comment, index) => {
          console.log("comment num", comment.thread_content_num);
        })}
        {comments.map((comment, index) => (
          <Comment
            key={index} // index를 추가하여 키의 고유성 보장
            comment={comment}
            thread_num={thread_num}
          />
        ))} */}
      </div>

      {hasMoreComments && (
        <button className="load-more-button" onClick={handleLoadMoreComments}>
          더보기
        </button>
      )}

      {authData ? (
        <div className="new-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
          />
          <button onClick={handleCommentSubmit}>댓글 작성</button>
        </div>
      ) : (
        <p>로그인 후 댓글을 작성할 수 있습니다.</p>
      )}
    </div>
  );
};

export default ThreadDetailPage;
