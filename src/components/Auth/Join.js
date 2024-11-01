// components/Auth/Join.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Join.css';

function Join() {
  const [form_data, set_form_data] = useState({
    member_id: '',
    member_password: '',
    member_nickname: '',
    member_email: '',
    member_phone: '',
    member_gender: '',
    member_birth_date: '',
  });

  const [error, set_error] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handle_change = (e) => {
    set_form_data({ ...form_data, [e.target.name]: e.target.value });
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8002/join', form_data, { withCredentials: true });

      alert(response.data.message); // 성공 메시지 표시
      set_error(null);

      navigate('/'); // 성공 시 홈 경로로 이동
    } catch (error) {
      if (error.response && error.response.data) {
        set_error(error.response.data.message);
      } else {
        set_error('회원가입 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="join_container">
      <h2 className="join_title">회원가입</h2>
      <p className="join_description">라보엠의 서비스를 이용하시려면 회원가입을 완료해주세요.</p>
      <form onSubmit={handle_submit} className="join_form">
        <input
          type="text"
          name="member_id"
          placeholder="아이디"
          onChange={handle_change}
          required
          className="join_input"
        />
        <input
          type="password"
          name="member_password"
          placeholder="비밀번호"
          onChange={handle_change}
          required
          className="join_input"
        />
        <input
          type="text"
          name="member_nickname"
          placeholder="닉네임"
          onChange={handle_change}
          required
          className="join_input"
        />
        <input
          type="email"
          name="member_email"
          placeholder="이메일"
          onChange={handle_change}
          required
          className="join_input"
        />
        <input
          type="text"
          name="member_phone"
          placeholder="전화번호"
          onChange={handle_change}
          className="join_input"
          required
        />

        <div className="gender_radio_group">
          <label>
            <input
              type="radio"
              name="member_gender"
              value="남"
              onChange={handle_change}
              required
              checked={form_data.member_gender === '남'}
            />
            남
          </label>
          <label>
            <input
              type="radio"
              name="member_gender"
              value="여"
              onChange={handle_change}
              required
              checked={form_data.member_gender === '여'}
            />
            여
          </label>
        </div>

        <input type="date" name="member_birth_date" onChange={handle_change} className="join_input" required />
        <button type="submit" className="join_button">
          회원가입
        </button>
      </form>
      {error && <p className="error_message">{error}</p>}
    </div>
  );
}

export default Join;
