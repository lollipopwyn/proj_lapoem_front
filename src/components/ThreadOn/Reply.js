import React from "react";

const Reply = ({ reply, isAuthor, onDelete }) => {
  console.log("Reply component data:", reply); // 전달된 데이터 확인

  return (
    <div className="reply-container">
      {/* 대댓글을 부모 댓글과 시각적으로 연결하는 좌측 회색 라인 */}
      <div className="reply-line"></div>

      <div className="reply-content">
        <div className="reply-header">
          <span className="reply-nickname">{reply.member_nickname}</span>
          <span className="reply-date">{reply.created_at}</span>
          {/* 본인이 작성한 대댓글일 때만 삭제 버튼 표시 */}
          {isAuthor && (
            <button
              onClick={() => onDelete(reply.thread_content_num)}
              className="delete-button"
            >
              ✖
            </button>
          )}
        </div>
        <div className="reply-text">{reply.thread_content}</div>
      </div>
    </div>
  );
};

export default Reply;
