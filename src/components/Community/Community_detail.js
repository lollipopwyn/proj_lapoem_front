import React, { useEffect, useState } from 'react';
import './Community_detail.css';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCommunityPostDetail } from '../../redux/features/auth/apiSlice';
import publicIcon from '../../assets/images/public-icon.png';
import vectorIcon from '../../assets/images/Vector.png';
import meIcon from '../../assets/images/only-me-icon.png';
import documentIcon from '../../assets/images/document.png';
import chartIcon from '../../assets/images/chart.png';
import rank1Icon from '../../assets/images/rank1-icon.png'; // 1등 이모티콘
import rank2Icon from '../../assets/images/rank2-icon.png'; // 2등 이모티콘
import rank3Icon from '../../assets/images/rank3-icon.png'; // 3등 이모티콘

const CommunityDetail = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [commentLength, setCommentLength] = useState(0);

  // Redux state에서 postDetail을 가져올 때 구조를 확인하고 적절히 수정
  const postDetail = useSelector((state) => state.api.postDetail);
  const isLoading = useSelector((state) => state.api.isLoading);
  const isError = useSelector((state) => state.api.isError);
  const errorMessage = useSelector((state) => state.api.errorMessage);

  useEffect(() => {
    console.log('Current Post ID:', postId); // postId가 제대로 들어오는지 확인
    if (postId) {
      dispatch(fetchCommunityPostDetail(postId));
    }
  }, [dispatch, postId]);

  useEffect(() => {
    console.log('Post Detail:', postDetail);
  }, [postDetail]);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
    setCommentLength(e.target.value.length);
  };

  const hotTopics = ['샘플 핫토픽 1', '샘플 핫토픽 2', '샘플 핫토픽 3'];
  const topUsers = ['User1', 'User2', 'User3'];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {errorMessage}</div>;
  }

  if (!postDetail || !postDetail.post_title) {
    return <div>Loading post details...</div>;
  }

  return (
    <div className="community-detail-container">
      <div className="content-wrapper">
        <div className="main-content">
          <h1 className="community-title">COMMUNITY</h1>
          <div className="post-title">{postDetail.post_title}</div>
          <div className="post-meta">
            <span className="post-author">{postDetail.member_nickname}</span>
            <span className="post-date">
              {new Date(postDetail.post_created_at).toLocaleString()}
            </span>
            <img
              src={postDetail.visibility ? publicIcon : meIcon}
              alt={postDetail.visibility ? 'Public' : 'Only me'}
              className="icon"
            />
          </div>
          <div className="post-content">{postDetail.post_content}</div>
          <div className="comment-section">
            <h2>전체 댓글</h2>
          </div>
          <div className="comments-list">
            {postDetail.comments?.map((comment) => (
              <div key={comment.comment_id} className="comment">
                <span className="comment-author">
                  {comment.member_nickname}
                </span>
                <span className="comment-text">{comment.comment_text}</span>
                <span className="comment-date">
                  {new Date(comment.comment_created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="sidebar">
          <div className="my-forums-section">
            <div className="my-forums-header">소라소라게 님</div>
            <div className="my-forums-stats">
              <div className="my-forums-stat">
                <img src={documentIcon} alt="My Forums Icon" />
                <div className="my-forums-stat-title">My Forums</div>
                <div className="my-forums-stat-value">24</div>
              </div>
              <div className="my-forums-stat">
                <img src={chartIcon} alt="Total Views Icon" />
                <div className="my-forums-stat-title">Total Views</div>
                <div className="my-forums-stat-value">1,107</div>
              </div>
            </div>
          </div>
          <div className="sidebar-section">
            <h2>Today's Hot Forums</h2>
            <div className="hot-topics">
              {hotTopics.map((topic, index) => (
                <div key={index} className="topic-item">
                  <img
                    src={
                      index === 0
                        ? rank1Icon
                        : index === 1
                        ? rank2Icon
                        : rank3Icon
                    }
                    alt={`Rank ${index + 1} Icon`}
                    className="topic-icon"
                  />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h2>Today's People</h2>
            <div className="top-users">
              {topUsers.map((user, index) => (
                <div key={index} className="user-item">
                  <img
                    src={
                      index === 0
                        ? rank1Icon
                        : index === 1
                        ? rank2Icon
                        : rank3Icon
                    }
                    alt={`Rank ${index + 1} Icon`}
                    className="user-icon"
                  />
                  <span>{user}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Forums Button */}
          <div className="sidebar-section">
            <Link to="/new-forum">
              <button className="new-forum-button">New Forum</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="big-add-comment">
        <div className="add-comment">
          <div className="comment-input-wrapper">
            <textarea
              placeholder="댓글을 입력해주세요."
              maxLength={300}
              value={commentText}
              onChange={handleCommentChange}
            ></textarea>
          </div>
          <div className="comment-length-button-wrapper">
            <span className="comment-length">({commentLength}/300)</span>
            <button className="comment-button">Leave a Comment</button>
          </div>
        </div>
        <Link to="/community" className="to-list-button">
          To list <img src={vectorIcon} alt="vector" className="v_icon" />
        </Link>
      </div>
    </div>
  );
};

export default CommunityDetail;
