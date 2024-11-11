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
    confirm_password: '',
    member_nickname: '',
    member_email: '',
    member_phone: '',
    member_gender: '',
    member_birth_date: '',
  });

  const [errors, set_errors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const agreedTerms = location.state?.agreedTerms || [];

  const handle_change = (e) => {
    const { name, value } = e.target;
    const updatedErrors = { ...errors };

    // 아이디 검사
    if (name === 'member_id') {
      const isValidId = /^[a-z0-9]+$/.test(value); // 영어 소문자와 숫자만 허용
      updatedErrors.member_id = isValidId ? null : '아이디는 영어 소문자와 숫자만 입력 가능합니다.';
    }

    // 이메일 형식 검사
    if (name === 'member_email') {
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      updatedErrors.member_email = isValidEmail ? null : '이메일 형식이 맞지 않습니다.';
    }

    // 전화번호 검사
    if (name === 'member_phone') {
      const isValidPhone = /^[0-9]*$/.test(value) && value.length <= 11;
      updatedErrors.member_phone = isValidPhone ? null : '전화번호 형식에 맞지 않습니다. 숫자만 입력해 주세요.';
    }

    // 비밀번호 검사
    if (name === 'member_password') {
      const isValidPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(value);
      updatedErrors.member_password = isValidPassword
        ? null
        : '비밀번호는 대문자 1개, 특수문자 1개를 포함하고 8자리 이상이어야 합니다.';
    }

    // 비밀번호 확인 검사
    if (name === 'confirm_password') {
      updatedErrors.confirm_password = value === form_data.member_password ? null : '비밀번호가 일치하지 않습니다.';
    }

    // 닉네임 검사
    if (name === 'member_nickname') {
      updatedErrors.member_nickname = value ? null : '닉네임을 입력해주세요.';
    }

    // 생년월일 검사 (8자리 숫자)
    if (name === 'member_birth_date') {
      const isValidDate = /^[0-9]{8}$/.test(value);
      updatedErrors.member_birth_date = isValidDate ? null : '생년월일을 올바르게 입력해 주세요.';
    }

    // 성별 검사
    if (name === 'member_gender') {
      updatedErrors.member_gender = value ? null : '성별을 선택해 주세요.';
    }

    set_form_data({ ...form_data, [name]: value });
    set_errors(updatedErrors);
  };

  const handleGenderSelect = (gender) => {
    set_form_data({ ...form_data, member_gender: gender });
    set_errors({ ...errors, member_gender: null });
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    // 필수 필드가 비어있는지 확인
    const validationErrors = {};
    if (!form_data.member_id) validationErrors.member_id = '아이디를 입력해주세요.';
    if (!form_data.member_password) validationErrors.member_password = '비밀번호를 입력해주세요.';
    if (!form_data.confirm_password) validationErrors.confirm_password = '비밀번호 확인을 입력해주세요.';
    if (!form_data.member_nickname) validationErrors.member_nickname = '닉네임을 입력해주세요.';
    if (!form_data.member_email) validationErrors.member_email = '이메일을 입력해주세요.';
    if (!form_data.member_gender) validationErrors.member_gender = '성별을 선택해 주세요.';
    if (!form_data.member_birth_date || form_data.member_birth_date.length !== 8) {
      validationErrors.member_birth_date = '생년월일을 올바르게 입력해 주세요.';
    }
    if (form_data.member_password !== form_data.confirm_password) {
      validationErrors.confirm_password = '비밀번호가 일치하지 않습니다.';
    }

    set_errors(validationErrors);

    // 에러가 있으면 제출 중지
    if (Object.keys(validationErrors).length > 0) {
      return;
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
      set_errors({});
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        set_errors({ submit: error.response.data.message });
      } else {
        set_errors({ submit: '회원가입 중 네트워크 오류가 발생했습니다.' });
      }
    }
  };

  return (
    <div className="join_container">
      <PageHeader
        title="회원가입"
        description="회원 가입 정보를 입력해주세요."
        error_message={errors.submit}
        step_title="회원 정보 입력"
        steps={['약관 동의', '회원정보 입력', '가입 완료']}
        is_required={true}
        active_step={1} // 현재 페이지에 해당하는 단계 인덱스
      />
      <form onSubmit={handle_submit} className="join_form">
        <div className="input_group">
          <p>아이디 *</p>
          <input
            type="text"
            name="member_id"
            placeholder="아이디를 입력해주세요."
            onChange={handle_change}
            className="join_input"
          />
          {errors.member_id && <p className="error_message">{errors.member_id}</p>}
        </div>

        <div className="input_row">
          <div className="input_group">
            <p>비밀번호 *</p>
            <input
              type="password"
              name="member_password"
              placeholder="비밀번호를 입력해주세요."
              onChange={handle_change}
              className="join_input"
            />
            {errors.member_password && <p className="error_message">{errors.member_password}</p>}
          </div>

          <div className="input_group">
            <p>비밀번호 확인 *</p>
            <input
              type="password"
              name="confirm_password"
              placeholder="비밀번호를 한 번 더 입력해주세요."
              onChange={handle_change}
              className="join_input"
            />
            {errors.confirm_password && <p className="error_message">{errors.confirm_password}</p>}
          </div>
          <div className="input_group gender_group"></div>
        </div>

        <div className="input_row">
          <div className="input_group">
            <p>닉네임 *</p>
            <input
              type="text"
              name="member_nickname"
              placeholder="닉네임을 입력해주세요."
              onChange={handle_change}
              className="join_input"
            />
            {errors.member_nickname && <p className="error_message">{errors.member_nickname}</p>}
          </div>

          <div className="input_group">
            <p>생년월일(양력) *</p>
            <input
              type="text"
              name="member_birth_date"
              placeholder="Ex) 19990102"
              onChange={handle_change}
              className="join_input"
              maxLength={8}
            />
            {errors.member_birth_date && <p className="error_message">{errors.member_birth_date}</p>}
          </div>

          <div className="input_group gender_group">
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
            {errors.member_gender && <p className="error_message">{errors.member_gender}</p>}
          </div>
        </div>

        <div className="input_group">
          <p>연락처 *</p>
          <input
            type="text"
            name="member_phone"
            placeholder="숫자만 입력해주세요."
            onChange={handle_change}
            className="join_input"
            maxLength={11} // 전화번호는 11자리까지 입력 가능
          />
          {errors.member_phone && <p className="error_message">{errors.member_phone}</p>}
        </div>

        <div className="input_group">
          <p>이메일 *</p>
          <input
            type="email"
            name="member_email"
            placeholder="이메일을 입력해주세요."
            onChange={handle_change}
            className="join_input"
          />
          {errors.member_email && <p className="error_message">{errors.member_email}</p>}
        </div>

        <button type="submit" className="join_button">
          회원가입
        </button>
      </form>
      {errors.submit && <p className="error_message">{errors.submit}</p>}
    </div>
  );
}

export default Join;
