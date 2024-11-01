import React from 'react';
import { Link } from 'react-router-dom'; // Link를 추가하여 라우팅 가능하게 설정
import './Community.css';
import publicIcon from '../../assets/images/public-icon.png';
import meIcon from '../../assets/images/only-me-icon.png';
import documentIcon from '../../assets/images/document.png';
import chartIcon from '../../assets/images/chart.png';
import rank1Icon from '../../assets/images/rank1-icon.png'; // 1등 이모티콘
import rank2Icon from '../../assets/images/rank2-icon.png'; // 2등 이모티콘
import rank3Icon from '../../assets/images/rank3-icon.png'; // 3등 이모티콘

const Community = () => {
  const posts = [
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

  return (
    <div className="community-container">
      <div className="content-wrapper">
        <div className="main-content">
          <div className="header">
            <h1 className="community-title">COMMUNITY</h1>
            <div className="view-options">
              <button className="active">
                <img src={publicIcon} alt="Public" className="icon" />
                Public
              </button>
              <button>
                <img src={meIcon} alt="Only me" className="icon" />
                Only me
              </button>
            </div>
          </div>

          <div className="posts-container">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`post-item ${
                  post.isNotice ? 'notice-post' : 'regular-post'
                }`}
              >
                <div className="post-header">
                  {post.isNotice && <span className="notice-tag">[공지]</span>}
                  <div className="post-contents">
                    <h3>{post.title}</h3>
                  </div>
                  <span className="date">{post.date}</span>
                </div>
              </div>
            ))}
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
            <Link to="/new-forum">
              <button className="new-forum-button">New Forum</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
