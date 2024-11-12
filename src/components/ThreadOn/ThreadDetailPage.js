import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import {
  GET_THREADS_DETAIL_API_URL,
  GET_THREADS_COMMENTS_API_URL,
  POST_THREAD_COMMENT_API_URL,
} from "../../util/apiUrl";

const ThreadDetailPage = () => {
  const { thread_num } = useParams();
  const [threadDetail, setThreadDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const user = useSelector((state) => state.auth.user); // 로그인된 사용자 정보 가져오기
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // 로그인 상태 가져오기
  const navigate = useNavigate();
  const COMMENTS_LIMIT = 5;

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

  const fetchComments = async (currentOffset) => {
    try {
      const response = await fetch(
        `${GET_THREADS_COMMENTS_API_URL(
          thread_num
        )}?offset=${currentOffset}&limit=${COMMENTS_LIMIT}`
      );
      const data = await response.json();

      if (data.comments.length < COMMENTS_LIMIT) {
        setHasMoreComments(false);
      }

      setComments((prevComments) => {
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

  useEffect(() => {
    if (thread_num) {
      setComments([]);
      setOffset(0);
      setHasMoreComments(true);
      fetchComments(0);
    }
  }, [thread_num]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    console.log("member_num:", user?.member_num); // member_num 값 확인용

    try {
      const response = await fetch(POST_THREAD_COMMENT_API_URL(thread_num), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_num: user.member_num,
          thread_content: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        setComments([]);
        setOffset(0);
        setHasMoreComments(true);
        fetchComments(0);
      } else {
        const errorData = await response.json();
        console.error("Failed to post comment:", errorData.message);
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleLoadMoreComments = () => {
    const newOffset = offset + COMMENTS_LIMIT;
    setOffset(newOffset);
    fetchComments(newOffset);
  };

  const handleCommentClick = () => {
    if (!isLoggedIn) {
      if (
        window.confirm(
          "회원 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/login");
      }
    }
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
      </div>

      {hasMoreComments && (
        <button className="load-more-button" onClick={handleLoadMoreComments}>
          더보기
        </button>
      )}

      <div className="new-comment" onClick={handleCommentClick}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성하세요..."
        />
        <button
          onClick={isLoggedIn ? handleCommentSubmit : handleCommentClick}
          disabled={!isLoggedIn || !newComment.trim()}
        >
          댓글 작성
        </button>
      </div>
    </div>
  );
};

export default ThreadDetailPage;
