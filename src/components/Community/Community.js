import React from 'react';
import './Community.css';
import publicIcon from '../../assets/images/public-icon.png';
import meIcon from '../../assets/images/only-me-icon.png';

const Community = () => {
  const posts = [
    {
      id: 1,
      isNotice: true,
      title: '커뮤니티 포럼 공지사항입니다. 커뮤니티 사용전에 읽어주세요.',
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
    {
      id: 3,
      isNotice: false,
      title: '여러분, 그리고 멋진은 열리 록사등에 하셨다.',
      date: '2024-10-24',
      likes: 31,
    },
    // Add more sample posts as needed
  ];

  const hotTopics = ['샘플 핫토픽 1', '샘플 핫토픽 2', '샘플 핫토픽 3'];

  const topUsers = ['User1', 'User2', 'User3'];

  return (
    <div className="community-container">
      {/* Main content area */}
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
                <img src={meIcon} alt="onlyme" className="icon" />
                Only me
              </button>
            </div>
          </div>

          {/* Posts list */}
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
                  <div className="post-content">
                    <h3>{post.title}</h3>
                  </div>
                  <span className="date">{post.date}</span>{' '}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Today's Hot Features */}
          <div className="sidebar-section">
            <h2>Today's Hot Features</h2>
            <div className="hot-topics">
              {hotTopics.map((topic, index) => (
                <div key={index} className="topic-item">
                  <span className="topic-icon">📄</span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's People */}
          <div className="sidebar-section">
            <h2>Today's People</h2>
            <div className="top-users">
              {topUsers.map((user, index) => (
                <div key={index} className="user-item">
                  <span className="user-icon">👤</span>
                  <span>{user}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
