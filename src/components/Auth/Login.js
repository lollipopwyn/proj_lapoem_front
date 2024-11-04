import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [login_data, set_login_data] = useState({ member_id: '', member_password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoggedIn } = useSelector((state) => state.auth);

  const handle_change = (e) => {
    set_login_data({ ...login_data, [e.target.name]: e.target.value });
  };

  const handle_login = async () => {
    await dispatch(loginUser(login_data));
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); // 로그인 성공 시 홈 경로로 이동
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (error) {
      alert('로그인 정보를 확인해 주세요.');
    }
  }, [error]);

  return (
    <div className="login_container">
      <h2 className="login_title">로그인</h2>
      <input type="text" name="member_id" placeholder="아이디" onChange={handle_change} className="login_input" />
      <input
        type="password"
        name="member_password"
        placeholder="비밀번호"
        onChange={handle_change}
        className="login_input"
      />
      <button onClick={handle_login} className="login_button">
        로그인
      </button>
      {error && <p className="error_message">{error}</p>}
    </div>
  );
}

export default Login;
