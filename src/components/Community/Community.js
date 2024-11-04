import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCommunityPostsData } from '../../redux/features/auth/apiSlice';
import './Community.css';
import publicIcon from '../../assets/images/public-icon.png';
import meIcon from '../../assets/images/only-me-icon.png';
import documentIcon from '../../assets/images/document.png';
import chartIcon from '../../assets/images/chart.png';
import rank1Icon from '../../assets/images/rank1-icon.png';
import rank2Icon from '../../assets/images/rank2-icon.png';
import rank3Icon from '../../assets/images/rank3-icon.png';

const Community = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState('Public'); // Public or Only me
  const {
    fetchCommunityPosts: communityPosts,
    isError,
    errorMessage,
  } = useSelector((state) => state.api);
  const currentUser = useSelector((state) => state.auth.user?.memberNum);

  useEffect(() => {
    console.log('Current viewType:', viewType); // viewType 값 확인
    dispatch(fetchCommunityPostsData(viewType));
  }, [dispatch, viewType]);

  // 공지사항 (하드코딩된 데이터)
  const notices = [
    {
      id: 1,
      isNotice: true,
      title: '커뮤니티 포럼 공지사항입니다. 커뮤니티 사용 전에 읽어주세요.',
      date: '2024-10-24',
      likes: 33,
    },
    {
      id: 2,
      isNotice: true,
      title:
        '그 밖을 하다보기만 하듯, 나는 가끔 뒤처의 자락이 하늘이 하다리는 글 받았다.',
      date: '2024-10-24',
      likes: 31,
    },
  ];

  const hotTopics = ['샘플 핫토픽 1', '샘플 핫토픽 2', '샘플 핫토픽 3'];
  const topUsers = ['User1', 'User2', 'User3'];

  // 필터링된 게시글
  const filteredPosts = communityPosts.filter((post) => {
    if (viewType === 'Public') {
      // Public일 때 visibility가 true인 게시물만 표시
      return post.visibility === true;
    } else {
      // Only me일 때는 visibility가 false이고 현재 사용자의 게시물만 표시
      return (
        post.visibility === false && post.member_num === Number(currentUser)
      );
    }
  });
  console.log('Community Posts:', communityPosts);

  const handlePostClick = (postId) => {
    navigate(`/community/${postId}`);
  };

  return (
    <div className="community-container">
      <div className="content-wrapper">
        <div className="main-content">
          <div className="header">
            <h1 className="community-title">COMMUNITY</h1>
            <div className="view-options">
              <button
                className={viewType === 'Public' ? 'active' : ''}
                onClick={() => setViewType('Public')}
              >
                <img src={publicIcon} alt="Public" className="icon" />
                Public
              </button>
              <button
                className={viewType === 'Only me' ? 'active' : ''}
                onClick={() => setViewType('Only me')}
              >
                <img src={meIcon} alt="Only me" className="icon" />
                Only me
              </button>
            </div>
          </div>

          <div className="posts-container">
            {/* 공지사항 표시 */}
            {notices.map((notice) => (
              <div key={notice.id} className="post-item notice-post">
                <div className="post-header">
                  <span className="notice-tag">[공지]</span>
                  <div className="post-contents">
                    <h3>{notice.title}</h3>
                  </div>
                  <span className="date">{notice.date}</span>
                </div>
              </div>
            ))}

            {/* 작성된 게시글 표시 */}
            {isError ? (
              <p>{errorMessage}</p>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.posts_id}
                  className="post-item regular-post"
                  onClick={() => handlePostClick(post.posts_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="post-middle">
                    <div className="post-contents">
                      <h3>{post.post_title}</h3>
                      <p>{post.post_content}</p>
                    </div>
                    <div className="post-footer">
                      <span className="post-author">
                        작성자: {post.member_nickname}
                      </span>
                      <span className="post-date">
                        작성날짜:{' '}
                        {new Date(post.post_created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
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
            <Link to="/new_forum">
              <button className="new-forum-button">New Forum</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
