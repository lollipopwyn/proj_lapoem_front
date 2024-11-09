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
  const [birthDateError, setBirthDateError] = useState(null);
  const [genderError, setGenderError] = useState(null);
  const [requiredErrors, setRequiredErrors] = useState({});

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

    if (name === 'member_birth_date') {
      const isValidDate = /^[0-9]{0,8}$/.test(value); // 최대 8자리 숫자만 허용
      set_form_data({ ...form_data, [name]: value });
      if (!isValidDate || value.length !== 8) {
        setBirthDateError('8자리로 입력해 주세요.');
      } else {
        setBirthDateError(null);
      }
      return;
    }

    set_form_data({ ...form_data, [name]: value });
    setRequiredErrors({ ...requiredErrors, [name]: false });
  };

  const handleGenderSelect = (gender) => {
    set_form_data({ ...form_data, member_gender: gender });
    setGenderError(null);
    setRequiredErrors({ ...requiredErrors, member_gender: false });
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    // 필수 필드가 비어있는지 확인
    const errors = {};
    if (!form_data.member_id) errors.member_id = '아이디를 입력해주세요.';
    if (!form_data.member_password) errors.member_password = '비밀번호를 입력해주세요.';
    if (!form_data.member_nickname) errors.member_nickname = '닉네임을 입력해주세요.';
    if (!form_data.member_email) errors.member_email = '이메일을 입력해주세요.';
    if (!form_data.member_gender) errors.member_gender = '성별을 선택해 주세요.';
    if (!form_data.member_birth_date || form_data.member_birth_date.length !== 8) {
      errors.member_birth_date = '생년월일을 올바르게 입력해 주세요.';
    }

    setRequiredErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // 필수 필드가 비어 있으면 제출 중지
    }

    try {
      const response = await axios.post(JOIN_USER_API_URL, form_data, { withCredentials: true });
      const member_num = response.data.userId;

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
      <form onSubmit={handle_submit} className="join_form">
        <p>아이디 *</p>
        <input
          type="text"
          name="member_id"
          placeholder="아이디를 입력해주세요."
          onChange={handle_change}
          required
          className="join_input"
        />
        {idError && <p className="error_message">{idError}</p>}
        {requiredErrors.member_id && <p className="error_message">{requiredErrors.member_id}</p>}

        <p>비밀번호 *</p>
        <input
          type="password"
          name="member_password"
          placeholder="비밀번호를 입력해주세요."
          onChange={handle_change}
          required
          className="join_input"
        />
        {requiredErrors.member_password && <p className="error_message">{requiredErrors.member_password}</p>}

        <p>닉네임 *</p>
        <input
          type="text"
          name="member_nickname"
          placeholder="닉네임을 입력해주세요."
          onChange={handle_change}
          required
          className="join_input"
        />
        {requiredErrors.member_nickname && <p className="error_message">{requiredErrors.member_nickname}</p>}

        <p>이메일 *</p>
        <input
          type="email"
          name="member_email"
          placeholder="이메일을 입력해주세요."
          onChange={handle_change}
          required
          className="join_input"
        />
        {requiredErrors.member_email && <p className="error_message">{requiredErrors.member_email}</p>}

        <p>전화번호</p>
        <input
          type="text"
          name="member_phone"
          placeholder="숫자만 입력해주세요."
          onChange={handle_change}
          className="join_input"
        />
        {phoneError && <p className="error_message">{phoneError}</p>}

        <p>성별 *</p>
        <div className="gender_select_group">
          <button
            type="button"
            className={`gender_button ${form_data.member_gender === '남' ? 'active' : ''}`}
            onClick={() => handleGenderSelect('남')}
          >
            남
          </button>
          <button
            type="button"
            className={`gender_button ${form_data.member_gender === '여' ? 'active' : ''}`}
            onClick={() => handleGenderSelect('여')}
          >
            여
          </button>
        </div>
        {genderError && <p className="error_message">{genderError}</p>}
        {requiredErrors.member_gender && <p className="error_message">{requiredErrors.member_gender}</p>}

        <p>생년월일 *</p>
        <input
          type="text"
          name="member_birth_date"
          placeholder="Ex) 19990102"
          onChange={handle_change}
          value={form_data.member_birth_date}
          className="join_input"
          required
          maxLength={8}
        />
        {birthDateError && <p className="error_message">{birthDateError}</p>}
        {requiredErrors.member_birth_date && <p className="error_message">{requiredErrors.member_birth_date}</p>}

        <button type="submit" className="join_button">
          회원가입
        </button>
      </form>
      {error && <p className="error_message">{error}</p>}
    </div>
  );
}

export default Join;
