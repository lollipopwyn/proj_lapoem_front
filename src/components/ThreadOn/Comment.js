import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Reply from "./Reply";
import ReplyModal from "./ReplyModal";
import {
  GET_COMMENT_REPLIES_API_URL,
  DELETE_THREAD_COMMENTS_API_URL,
} from "../../util/apiUrl";

const Comment = ({ comment, thread_num, onDeleteSuccess }) => {
  const [replies, setReplies] = useState([]);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const authData = useSelector((state) => state.auth.user); // authData 가져오기

  // useEffect(() => {
  //   console.log("Loaded authData:", authData); // authData 확인
  //   console.log("comment.member_num:", comment.member_num); // comment의 member_num 확인
  // }, [authData, comment]);

  const fetchReplies = async () => {
    try {
      const response = await fetch(
        GET_COMMENT_REPLIES_API_URL(comment.thread_content_num)
      );
      const data = await response.json();
      console.log("Fetched replies data:", data); // 응답 데이터 확인

      // 최신순으로 정렬 후 중복 제거하여 상태에 저장
      setReplies((prevReplies) => {
        const filteredReplies = data.replies.filter(
          (newReply) =>
            !prevReplies.some(
              (existingReply) =>
                existingReply.thread_content_num === newReply.thread_content_num
            )
        );
        const sortedReplies = [...prevReplies, ...filteredReplies].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at) // 최신순 정렬
        );
        return sortedReplies;
      });
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  const handleShowMoreReplies = () => {
    setShowMoreReplies(true);
  };

  // 접기 버튼 클릭 시 실행될 함수
  const handleCollapseReplies = () => {
    setShowMoreReplies(false);
  };

  const toggleReplyModal = () => {
    if (isLoggedIn) {
      setIsReplyModalOpen(!isReplyModalOpen);
    } else {
      if (
        window.confirm(
          "회원 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/login");
      }
    }
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async () => {
    if (!window.confirm("정말로 댓글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        DELETE_THREAD_COMMENTS_API_URL(comment.thread_content_num),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            member_num: authData.memberNum, // 로그인된 사용자의 member_num을 포함
          }),
        }
      );

      if (response.ok) {
        console.log("댓글이 성공적으로 삭제되었습니다.");
        if (onDeleteSuccess) onDeleteSuccess(comment.thread_content_num); // 상위 컴포넌트에 삭제 성공 알림
      } else {
        console.error("댓글 삭제 실패");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // 대댓글 작성 후 새로운 대댓글을 추가하는 함수
  const onSubmitReply = (replyContent) => {
    console.log("대댓글 내용:", replyContent);
    const newReply = {
      thread_content_num: Date.now(), // 임시 키 값으로 Date.now() 사용
      member_num: authData?.memberNum,
      member_nickname: authData?.nickname,
      thread_content: replyContent,
      created_at: new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };
    setReplies((prevReplies) => [...prevReplies, newReply]); // 새 대댓글을 기존 대댓글 리스트 뒤에 추가
  };

  return (
    <div className="comment">
      <div className="comment-header flex">
        <div className="flex">
          <p>{comment.member_nickname}</p>
          <p>{comment.created_at}</p>
        </div>
        <div>
          {/* 로그인한 사용자와 댓글 작성자가 일치할 때만 삭제 버튼 표시 */}
          {isLoggedIn && authData?.memberNum === comment.member_num && (
            <button className="delete-button" onClick={handleDeleteComment}>
              삭제
            </button>
          )}
        </div>
      </div>
      <div>
        <p className="comment-content">{comment.thread_content}</p>
      </div>

      <div className="reply-action">
        <button onClick={toggleReplyModal} className="reply-button">
          <span className="reply-icon">💬</span>
          {comment.reply_count > 0 && (
            <span className="reply-count"> {comment.reply_count}</span>
          )}
        </button>
      </div>

      {isReplyModalOpen && (
        <ReplyModal
          comment={comment}
          thread_num={thread_num}
          onClose={toggleReplyModal}
          onSubmit={onSubmitReply} // 대댓글 작성 후 추가 함수 전달
          memberNum={authData?.memberNum}
        />
      )}

      {replies.length > 0 && (
        <div className="replies-section">
          {(showMoreReplies ? replies : replies.slice(-2)).map((reply) => {
            const isAuthor = reply.member_num === authData?.memberNum;
            console.log(
              "reply.member_num:",
              reply.member_num,
              "authData.memberNum:",
              authData?.memberNum,
              "isAuthor:",
              isAuthor
            ); // 디버깅 로그 추가
            return (
              <Reply
                key={reply.thread_content_num}
                reply={reply}
                isAuthor={isAuthor} // 본인 여부 확인
                memberNum={authData?.memberNum} // 로그인한 사용자의 memberNum 전달
                onDelete={(replyId) =>
                  setReplies((prevReplies) =>
                    prevReplies.filter((r) => r.thread_content_num !== replyId)
                  )
                }
              />
            );
          })}
          {replies.length > 2 &&
            (showMoreReplies ? (
              <button
                onClick={handleCollapseReplies}
                className="collapse-replies-button"
              >
                접기
              </button>
            ) : (
              <button
                onClick={handleShowMoreReplies}
                className="show-more-replies-button"
              >
                더보기
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
