import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { JOIN_USER_API_URL } from '../../util/apiUrl'; // URL 불러오기
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
  const [phoneError, setPhoneError] = useState(null); // 전화번호 입력 오류 상태 추가
  const [idError, setIdError] = useState(null); // 아이디 입력 오류 상태 추가
  const [genderError, setGenderError] = useState(null); // 성별 선택 오류 상태 추가
  const navigate = useNavigate();

  const handle_change = (e) => {
    const { name, value } = e.target;

    if (name === 'member_phone') {
      const isValidPhone = /^[0-9]*$/.test(value);
      if (!isValidPhone) {
        setPhoneError('숫자만 입력해 주세요.');
        return;
      } else {
        setPhoneError(null);
      }
    }

    if (name === 'member_id') {
      const isValidId = /^[a-z0-9]*$/.test(value);
      if (!isValidId) {
        setIdError('아이디는 영어 소문자와 숫자만 입력 가능합니다.');
        return;
      } else {
        setIdError(null);
      }
    }

    if (name === 'member_gender') {
      setGenderError(null); // 성별 선택 시 오류 메시지 제거
    }

    set_form_data({ ...form_data, [name]: value });
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    if (phoneError || idError) {
      alert('입력 정보를 확인해 주세요.');
      return;
    }

    // 성별이 선택되지 않은 경우 오류 메시지 설정
    if (!form_data.member_gender) {
      setGenderError('성별을 선택해 주세요.');
      return;
    }

    try {
      const response = await axios.post(JOIN_USER_API_URL, form_data, { withCredentials: true });
      alert(response.data.message);
      set_error(null);
      navigate('/'); // 홈으로 이동
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
        {idError && <p className="error_message">{idError}</p>}
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
        {phoneError && <p className="error_message">{phoneError}</p>}
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
        {genderError && <p className="error_message">{genderError}</p>} {/* 성별 선택 오류 메시지 */}
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
