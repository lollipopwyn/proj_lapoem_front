import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Reply from "./Reply";
import ReplyModal from "./ReplyModal";
import { GET_COMMENT_REPLIES_API_URL } from "../../util/apiUrl";

const Comment = ({ comment, thread_num }) => {
  const [replies, setReplies] = useState([]);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const authData = useSelector((state) => state.auth.authData); // authData 가져오기

  const fetchReplies = async () => {
    try {
      const response = await fetch(
        GET_COMMENT_REPLIES_API_URL(comment.thread_content_num)
      );
      const data = await response.json();
      setReplies((prevReplies) => {
        const filteredReplies = data.replies.filter(
          (newReply) =>
            !prevReplies.some(
              (existingReply) =>
                existingReply.thread_content_num === newReply.thread_content_num
            )
        );
        return [...prevReplies, ...filteredReplies];
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

  const onSubmitReply = (replyContent) => {
    console.log("대댓글 내용:", replyContent);
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
          {isLoggedIn && authData?.member_num === comment.member_num && (
            <button className="delete-button">삭제</button>
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
          onSubmit={onSubmitReply}
        />
      )}

      {replies.length > 0 && (
        <div className="replies-section">
          {replies
            .slice(0, showMoreReplies ? replies.length : 2)
            .map((reply) => (
              <Reply
                key={reply.thread_content_num}
                reply={reply}
                isAuthor={reply.member_num === authData?.member_num}
                onDelete={() =>
                  console.log("삭제 버튼 클릭됨", reply.thread_content_num)
                }
              />
            ))}
          {replies.length > 2 && !showMoreReplies && (
            <button
              onClick={handleShowMoreReplies}
              className="show-more-replies-button"
            >
              더보기
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
