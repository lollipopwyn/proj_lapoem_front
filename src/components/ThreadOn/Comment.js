import React, { useState, useEffect } from "react";
import Reply from "./Reply";
import { GET_COMMENT_REPLIES_API_URL } from "../../util/apiUrl";

const Comment = ({ comment, thread_num, authData }) => {
  const [replies, setReplies] = useState([]);
  const [showMoreReplies, setShowMoreReplies] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  // 대댓글 가져오기 (중복 필터링 포함)
  const fetchReplies = async () => {
    try {
      const response = await fetch(
        GET_COMMENT_REPLIES_API_URL(comment.thread_content_num)
      );
      const data = await response.json();
      console.log("API Response data:", data);

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

  // 컴포넌트가 처음 렌더링될 때 대댓글 가져오기
  useEffect(() => {
    fetchReplies();
  }, []);

  // 더보기 버튼 클릭 시 모든 대댓글 보기 설정
  const handleShowMoreReplies = () => {
    setShowMoreReplies(true);
  };

  // 대댓글 작성 모달 토글 함수
  const toggleReplyModal = () => {
    setIsReplyModalOpen(!isReplyModalOpen);
  };

  return (
    <div className="comment">
      <div className="comment-header flex">
        <div className="flex">
          <p>{comment.member_nickname}</p>
          <p>{comment.created_at}</p>
        </div>
        <div>
          {authData?.member_num === comment.member_num && (
            <button className="delete-button">삭제</button>
          )}
        </div>
      </div>
      <div>
        <p className="comment-content">{comment.thread_content}</p>
      </div>

      <div className="reply-action">
        {/* 대댓글 작성 모달을 여는 버튼 */}
        <button onClick={toggleReplyModal} className="reply-button">
          <span className="reply-icon">💬</span>
          {comment.reply_count > 0 && (
            <span className="reply-count"> {comment.reply_count}</span>
          )}
        </button>
      </div>

      {isReplyModalOpen && (
        <div className="reply-modal">
          {/* 대댓글 작성 모달 구현 */}
          <p>대댓글 작성 모달이 여기에 표시됩니다.</p>
          <button onClick={toggleReplyModal}>닫기</button>
        </div>
      )}

      {/* 대댓글 표시 영역 */}
      {replies.length > 0 && (
        <div className="replies-section">
          {replies
            .slice(0, showMoreReplies ? replies.length : 2) // 기본으로 최근 2개 대댓글만 표시
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
