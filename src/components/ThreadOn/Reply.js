import React, { useState } from "react";

function Reply({ reply, isUserAuthor, onDelete }) {
  return (
    <div className="reply-container">
      {/* 좌측 회색 막대기 */}
      <div className="reply-bar" />

      <div className="reply-content">
        <p className="reply-author">
          {reply.member_nickname}
          <span className="reply-date">{reply.created_at}</span>
        </p>
        <p className="reply-text">
          {reply.is_active ? reply.thread_content : "[삭제된 댓글입니다.]"}
        </p>

        {/* 삭제 버튼: 본인이 작성한 대댓글일 경우만 노출 */}
        {isUserAuthor && (
          <button
            className="reply-delete-button"
            onClick={() => {
              if (
                window.confirm(
                  "정말로 삭제 하시겠습니까? 삭제 후에는 복구가 불가능합니다."
                )
              ) {
                onDelete(reply.thread_content_num);
              }
            }}
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}

export default Reply;
