import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // useSelector 추가
import { createCommunityPostData } from '../../redux/features/auth/apiSlice';
import publicIcon from '../../assets/images/public-icon.png';
import privateIcon from '../../assets/images/only-me-icon.png';
import './NewForum.css';

const NewForum = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member_num = useSelector((state) => state.auth.user.memberNum); // useSelector로 Redux 상태에서 member_num 가져오기
  console.log('member_num:', member_num);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 서버에 게시글 생성 요청
    await dispatch(
      createCommunityPostData({
        member_num,
        post_title: title,
        post_content: content,
        post_status: 'active',
        visibility,
      })
    );

    navigate('/community');
  };

  const handleDelete = () => {
    navigate('/community');
  };

  return (
    <>
      <div className="new-forum-container">
        <h2>COMMUNITY</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group title-group">
            <span className="input-label">제목</span>
            <div className="title-input-wrapper">
              <input
                type="text"
                id="title"
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div
              className={`toggle-button ${visibility ? 'public' : 'private'}`}
              onClick={() => setVisibility(!visibility)}
            >
              <img src={privateIcon} alt="Private Icon" />
              <div className="toggle-circle"></div>
              <img src={publicIcon} alt="Public Icon" />
            </div>
          </div>
          <div className="form-group content-group">
            <div className="content-label">내용</div>
            <textarea
              id="content"
              placeholder="내용을 입력해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button type="submit" className="submit-button">
              Post Forum
            </button>
          </div>
        </form>
      </div>
      <div className="footer-placeholder"></div>
    </>
  );
};

export default NewForum;
