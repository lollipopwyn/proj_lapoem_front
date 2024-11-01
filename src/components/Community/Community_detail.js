import React, { useState } from 'react';
import './Community_detail.css';
import { Link } from 'react-router-dom';
import publicIcon from '../../assets/images/public-icon.png';
import vectorIcon from '../../assets/images/Vector.png';
import meIcon from '../../assets/images/only-me-icon.png';
import documentIcon from '../../assets/images/document.png';
import chartIcon from '../../assets/images/chart.png';
import rank1Icon from '../../assets/images/rank1-icon.png'; // 1등 이모티콘
import rank2Icon from '../../assets/images/rank2-icon.png'; // 2등 이모티콘
import rank3Icon from '../../assets/images/rank3-icon.png'; // 3등 이모티콘

const CommunityDetail = () => {
  const [commentText, setCommentText] = useState('');
  const [commentLength, setCommentLength] = useState(0);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
    setCommentLength(e.target.value.length);
  };

  const hotTopics = ['샘플 핫토픽 1', '샘플 핫토픽 2', '샘플 핫토픽 3'];
  const topUsers = ['User1', 'User2', 'User3'];

  return (
    <div className="community-detail-container">
      <div className="content-wrapper">
        <div className="main-content">
          <h1 className="community-title">COMMUNITY</h1>
          <div className="post-title">
            그 별을 쳐다보기만 해도, 나는 지금 시각이 자정이 지났다는 걸
            안답니다.
          </div>
          <div className="post-meta">
            <span className="post-author">닉네임익명</span>
            <span className="post-date">2024.10.24 23:35:02</span>
            <img src={publicIcon} alt="Public" className="icon" />
          </div>
          <div className="post-content">
            계절이 지나가는 하늘에 가득히 쏟아질 것입니다. 많은 밤을 이 별들은
            책상을 다 그리워하는 계십니다. 패, 내 버리었습니다. 가을로 별을
            듯합니다...계절이 지나가는 하늘에 가득히 쏟아질 것입니다. 많은 밤을
            이 별들은 책상을 다 그리워하는 계십니다. 패, 내 버리었습니다. 가을로
            별을 듯합니다...계절이 지나가는 하늘에 가득히 쏟아질 것입니다. 많은
            밤을 이 별들은 책상을 다 그리워하는 계십니다. 패, 내 버리었습니다.
            가을로 별을 듯합니다...계절이 지나가는 하늘에 가득히 쏟아질
            것입니다. 많은 밤을 이 별들은 책상을 다 그리워하는 계십니다. 패, 내
            버리었습니다. 가을로 별을 듯합니다...
          </div>
          <div className="comment-section">
            <h2>전체 댓글</h2>
          </div>
          <div className="comments-list">
            <div className="comment">
              <span className="comment-author">닉네임익명</span>
              <span className="comment-text">
                가슴속에 하나의 별을, 내일 밤 이네들은 별과 나의 어머니, 벌레는
                별들을 이름과 별까지 가을로 멀리...
              </span>
              <span className="comment-date">2024.10.24 23:35:02</span>
            </div>
            <div className="comment">
              <span className="comment-author">sslrspdla</span>
              <span className="comment-text">
                가을로 듯합니다. 계집애들의 흙으로 하나에 이네들은 이름과...
              </span>
              <span className="comment-date">2024.10.24 23:35:02</span>
            </div>
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
