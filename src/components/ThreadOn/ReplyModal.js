import React, { useState } from "react";
import "./replymodal.css";

function ReplyModal({ comment, onClose, onSubmit }) {
  const [replyContent, setReplyContent] = useState("");

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleSend = () => {
    if (replyContent.trim()) {
      onSubmit(replyContent);
      setReplyContent("");
    }
  };

  return (
    <div className="reply-modal-overlay">
      <div className="reply-modal">
        <header className="reply-modal-header">
          <h2>Leave a Reply</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="reply-modal-content">
          <div className="parent-comment">
            <p className="comment-author">{comment.member_nickname}</p>
            <p className="comment-date">{comment.created_at}</p>
            <p className="comment-text">{comment.thread_content}</p>
          </div>
          <textarea
            className="reply-textarea"
            placeholder="답글 남기기..."
            maxLength="300"
            value={replyContent}
            onChange={handleReplyChange}
          />
          <div className="reply-footer">
            <span className="char-count">{replyContent.length}/300</span>
            <button className="send-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReplyModal;
