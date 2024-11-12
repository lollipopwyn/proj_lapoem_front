import React, { useState } from "react";
import "./replymodal.css";
import { POST_THREAD_REPLY_API_URL } from "../../util/apiUrl";

const ReplyModal = ({ comment, thread_num, onClose, onSubmit, authToken }) => {
  const [replyContent, setReplyContent] = useState("");

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleReplySubmit = async () => {
    if (replyContent.length >= 10 && replyContent.length <= 300) {
      try {
        const response = await fetch(
          POST_THREAD_REPLY_API_URL(thread_num, comment.thread_content_num),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, // 토큰 추가
            },
            body: JSON.stringify({ content: replyContent }),
          }
        );

        if (response.ok) {
          console.log("Reply submitted successfully");
          onSubmit(replyContent); // 대댓글 내용 부모 컴포넌트로 전달
          setReplyContent("");
          onClose(); // 모달 닫기
        } else {
          console.error("Failed to submit reply");
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Leave a Reply</h3>
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
        </div>
        <div className="parent-comment-info">
          <p className="parent-nickname">{comment.member_nickname}</p>
          <p className="parent-date">{comment.created_at}</p>
          <p className="parent-content">{comment.thread_content}</p>
        </div>
        <textarea
          className="reply-input"
          placeholder="대댓글을 입력하세요 (최소 10자, 최대 300자)"
          value={replyContent}
          onChange={handleReplyChange}
          maxLength={300}
        />
        <button
          className="submit-reply-button"
          onClick={handleReplySubmit}
          disabled={replyContent.length < 10 || replyContent.length > 300}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default ReplyModal;
