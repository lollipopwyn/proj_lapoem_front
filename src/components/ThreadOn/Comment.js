import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Reply from "./Reply";
import { fetchThreadCommentsData } from "../../redux/features/auth/apiSlice";

function Comment({ comment, authData, onDeleteComment }) {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const dispatch = useDispatch();

  // 대댓글 필터링: 부모 댓글 번호로 연결된 대댓글 가져오기
  const replies = useSelector((state) =>
    (state.api.threadComments || []).filter(
      (reply) => reply.thread_content_num2 === comment.thread_content_num
    )
  );

  useEffect(() => {
    // 대댓글 데이터를 가져오기 위해 fetchThreadCommentsData 호출
    dispatch(fetchThreadCommentsData({ thread_num: comment.thread_num }));
  }, [dispatch, comment.thread_num]);

  // 대댓글 더보기/접기 토글
  const toggleShowAllReplies = () => {
    setShowAllReplies((prev) => !prev);
  };

  return (
    <div className="comment">
      {comment.is_active ? (
        <>
          {/* 부모 댓글 */}
          <div className="comment-header">
            <p className="comment-author">{comment.member_nickname}</p>
            <p className="comment-date">{comment.created_at}</p>
            {authData?.member_num === comment.member_num && (
              <button
                onClick={() => onDeleteComment(comment.thread_content_num)}
                className="delete-button"
              >
                삭제
              </button>
            )}
          </div>
          <p className="comment-content">{comment.thread_content}</p>

          {/* 대댓글 아이콘과 개수 */}
          <div className="comment-footer">
            <button
              className="reply-button"
              onClick={() => {
                /* 여기에 대댓글 모달 여는 로직 추가 */
              }}
            >
              💬 {comment.reply_count}
            </button>
          </div>

          {/* 대댓글 표시 */}
          {replies.length > 0 && (
            <div className="replies-section">
              {/* 대댓글 리스트: showAllReplies가 true일 때 전체, false일 때 최신 2개 */}
              {(showAllReplies ? replies : replies.slice(0, 2)).map((reply) => (
                <Reply
                  key={reply.thread_content_num}
                  reply={reply}
                  isUserAuthor={reply.member_num === authData?.member_num}
                  onDelete={() => onDeleteComment(reply.thread_content_num)}
                />
              ))}

              {/* 더보기/접기 버튼 */}
              {replies.length > 2 && (
                <div className="more-replies">
                  <div className="comment-divider-light"></div>
                  <button
                    onClick={toggleShowAllReplies}
                    className="more-replies-button"
                  >
                    {showAllReplies ? "접기" : "더보기"}
                  </button>
                  <div className="comment-divider-dark"></div>
                </div>
              )}
            </div>
          )}

          {/* 대댓글이 없는 경우 부모 댓글 아래 진한 선 */}
          {replies.length === 0 && <div className="comment-divider-dark"></div>}
        </>
      ) : (
        <p className="deleted-comment">[삭제된 댓글입니다.]</p>
      )}
    </div>
  );
}

export default Comment;
