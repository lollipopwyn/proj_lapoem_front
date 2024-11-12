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
  const [memberNum, setMemberNum] = useState(null);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const COMMENTS_LIMIT = 5;

  // 초기 로드 시 memberNum 설정
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setMemberNum(user?.memberNum);
  }, []);

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

  // 댓글을 가져오는 함수
  const fetchComments = async (
    currentOffset = 0,
    additionalLimit = COMMENTS_LIMIT
  ) => {
    try {
      const response = await fetch(
        `${GET_THREADS_COMMENTS_API_URL(
          thread_num
        )}?offset=${currentOffset}&limit=${additionalLimit}`
      );
      const data = await response.json();

      if (data.comments.length < additionalLimit) {
        setHasMoreComments(false);
      }

      return data.comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };

  // 초기 로드 시 5개의 부모 댓글을 불러옴
  useEffect(() => {
    if (thread_num) {
      setComments([]);
      setOffset(0);
      setHasMoreComments(true);
      fetchComments(0).then((initialComments) => {
        setComments(initialComments);
      });
    }
  }, [thread_num]);

  // 댓글 삭제 성공 시 호출되는 함수
  const handleDeleteSuccess = async (deletedCommentId) => {
    setComments((prevComments) => {
      const updatedComments = prevComments.filter(
        (comment) => comment.thread_content_num !== deletedCommentId
      );

      // 현재 표시 중인 댓글 개수와 업데이트된 댓글 개수 계산
      const currentDisplayCount = prevComments.length; // 삭제 전 화면에 보이던 댓글 수
      const requiredComments = currentDisplayCount - updatedComments.length; // 필요한 추가 댓글 수

      console.log("현재 표시 중인 댓글 수:", currentDisplayCount);
      console.log("삭제 후 남은 댓글 수:", updatedComments.length);
      console.log("부족한 댓글 수:", requiredComments);

      // 부족한 댓글 수만큼 로드하여 기존 표시 개수 유지
      if (requiredComments > 0 && hasMoreComments) {
        console.log(
          "fetchComments 호출 - offset:",
          offset + updatedComments.length,
          "limit:",
          requiredComments
        );

        // 필요한 개수만큼 댓글을 추가 로드
        fetchComments(offset + updatedComments.length, requiredComments).then(
          (additionalComments) => {
            console.log("추가로 불러온 댓글 수:", additionalComments.length);
            setComments((prevComments) => [
              ...updatedComments,
              ...additionalComments,
            ]);
            console.log(
              "최종 표시 댓글 수:",
              [...updatedComments, ...additionalComments].length
            );
          }
        );
      } else {
        setComments(updatedComments);
      }

      return updatedComments;
    });
  };

  // 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    if (!memberNum) {
      if (
        window.confirm(
          "회원 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/login");
      }
      return;
    }

    try {
      const response = await fetch(POST_THREAD_COMMENT_API_URL(thread_num), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_num: memberNum,
          thread_content: newComment,
        }),
      });

      if (response.ok) {
        setNewComment("");
        setOffset(0);
        setHasMoreComments(true);
        fetchComments(0).then((initialComments) => {
          setComments(initialComments);
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to post comment:", errorData.message);
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // 더보기 버튼 클릭 핸들러
  const handleLoadMoreComments = () => {
    const newOffset = offset + COMMENTS_LIMIT;
    setOffset(newOffset);
    fetchComments(newOffset).then((moreComments) => {
      setComments((prevComments) => [...prevComments, ...moreComments]);
    });
  };

  // 댓글 입력 클릭 시 로그인 확인
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
            onDeleteSuccess={handleDeleteSuccess}
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
