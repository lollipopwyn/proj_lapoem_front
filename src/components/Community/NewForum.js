import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewForum.css';

const NewForum = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Title:', title);
    console.log('Content:', content);
  };

  const handleDelete = () => {
    navigate('/community'); // Community.js로 이동
  };

  return (
    <>
      <div className="navbar-placeholder"></div>
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
