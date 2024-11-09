import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { JOIN_USER_API_URL, SAVE_TERMS_AGREEMENT_API_URL } from '../../util/apiUrl';
import './Join.css';
import PageHeader from './PageHeader';

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
  const [phoneError, setPhoneError] = useState(null);
  const [idError, setIdError] = useState(null);
  const [genderError, setGenderError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const agreedTerms = location.state?.agreedTerms || [];

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
      setGenderError(null);
    }

    set_form_data({ ...form_data, [name]: value });
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    if (phoneError || idError) {
      alert('입력 정보를 확인해 주세요.');
      return;
    }

    if (!form_data.member_gender) {
      setGenderError('성별을 선택해 주세요.');
      return;
    }

    try {
      const response = await axios.post(JOIN_USER_API_URL, form_data, { withCredentials: true });
      const member_num = response.data.userId;

      // 약관 동의 정보를 저장하는 추가 API 호출
      if (member_num && agreedTerms.length > 0) {
        await axios.post(SAVE_TERMS_AGREEMENT_API_URL, {
          agreements: agreedTerms.map((term) => ({
            member_num,
            terms_id: term.terms_id,
            agreement_status: term.agreement_status,
          })),
        });
      }

      alert(response.data.message);
      set_error(null);
      navigate('/login');
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
      <PageHeader
        title="Join"
        description="회원 가입 정보를 입력해주세요."
        step_title="회원정보 입력"
        steps={['약관 동의', '회원정보 입력', '가입 완료']}
        is_required={true}
        active_step={1}
      />
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
        {genderError && <p className="error_message">{genderError}</p>}
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
