import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  GET_MEMBER_INFO_API_URL,
  UPDATE_MEMBER_INFO_API_URL,
} from '../../util/apiUrl';
import birthIcon from '../../assets/images/birth_icon.png';
import '../My/Mypage.css';

const Mypage = () => {
  const [memberInfo, setMemberInfo] = useState({
    member_id: '',
    member_nickname: '',
    member_phone: '',
    member_email: '',
    marketing_consent: false,
    member_gender: '',
    member_birth_date: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 추가된 오류 상태
  const memberNum = useSelector((state) => state.auth.user?.memberNum); // Redux에서 memberNum 가져오기
  const token = useSelector((state) => state.auth.token); // 인증 토큰 가져오기

  // 페이지가 로드될 때 회원 정보를 불러오는 함수
  useEffect(() => {
    console.log('memberNum:', memberNum);
    console.log('token:', token);

    if (!memberNum || !token) {
      console.log("memberNum or token is missing. Fetching won't be executed.");
      return;
    }

    const fetchMemberInfo = async () => {
      try {
        const response = await axios.get(GET_MEMBER_INFO_API_URL(memberNum), {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰을 Authorization 헤더에 추가
          },
        });
        setMemberInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member info:', error);
        setError('회원 정보를 불러오는 데 실패했습니다.'); // 오류 메시지 추가
        setLoading(false);
      }
    };
    fetchMemberInfo();
  }, [memberNum, token]);

  // 수정된 정보를 저장하는 함수
  const handleSave = async () => {
    try {
      await axios.patch(
        UPDATE_MEMBER_INFO_API_URL(memberNum),
        {
          member_email: memberInfo.member_email,
          member_phone: memberInfo.member_phone,
          member_nickname: memberInfo.member_nickname,
          marketing_consent: memberInfo.marketing_consent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // PATCH 요청에도 인증 토큰 추가
          },
        }
      );
      alert('회원 정보가 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('Error updating member info:', error);
      setError('회원 정보 업데이트에 실패했습니다.'); // 오류 메시지 추가
    }
  };

  // 각 입력값이 변경될 때 상태 업데이트 함수
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMemberInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) return <div>회원 정보를 불러오는 중입니다...</div>; // 로딩 중 메시지 출력

  return (
    <div className="mypage_container">
      <div className="my_page_top">
        <div className="my_page_title">MY PAGE</div>
        <div className="my_page_desc">
          가입 시 작성한 회원 정보를 수정할 수 있습니다.
        </div>
      </div>
      <div className="my_page_content">
        <div className="my_page_content_title">회원 정보 수정</div>
        <div className="my_page_content_info">
          {error && <div className="error-message">{error}</div>}{' '}
          {/* 오류 메시지 출력 */}
          <div>
            <label>아이디</label>
            <input type="text" value={memberInfo.member_id} disabled />
          </div>
          <div>
            <label>닉네임</label>
            <input
              type="text"
              name="member_nickname"
              value={memberInfo.member_nickname}
              onChange={handleInputChange}
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div>
            <label>연락처</label>
            <input
              type="text"
              name="member_phone"
              value={memberInfo.member_phone}
              onChange={handleInputChange}
              placeholder="연락처를 입력하세요"
            />
          </div>
          <div className="my_email">
            <label>이메일</label>
            <input
              type="email"
              name="member_email"
              value={memberInfo.member_email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div className="marketing-container">
            {/* 마케팅 동의 체크박스 컨테이너 */}
            <input
              type="checkbox"
              name="marketing_consent"
              checked={memberInfo.marketing_consent}
              onChange={handleInputChange}
            />
            <label htmlFor="marketingConsent">마케팅 수신 동의</label>
          </div>
          <div className="my_privacy">
            <div className="my_birth">
              <div className="birthdate-display">
                <img src={birthIcon} alt="birtday icon" />
                <span>{memberInfo.member_birth_date}</span>
              </div>
            </div>
            <div className="my_gender">
              <div className="gender_toggle">
                <button
                  onClick={() =>
                    setMemberInfo({ ...memberInfo, member_gender: 'male' })
                  }
                  className={
                    memberInfo.member_gender === 'male' ? 'selected' : ''
                  }
                >
                  남
                </button>
                <button
                  onClick={() =>
                    setMemberInfo({ ...memberInfo, member_gender: 'female' })
                  }
                  className={
                    memberInfo.member_gender === 'female' ? 'selected' : ''
                  }
                >
                  여
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my_page_button">
        <button id="deleteBtn">DELETE MY ACCOUNT</button>
        <div className="button-group-right">
          <button id="saveBtn" onClick={handleSave}>
            SAVE
          </button>
          <button id="cancelBtn">CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
