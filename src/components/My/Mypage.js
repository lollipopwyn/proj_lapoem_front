import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import birthIcon from '../../assets/images/birth_icon.png';
import {GET_MEMBER_INFO_API_URL,UPDATE_MEMBER_INFO_API_URL} from '../../util/apiUrl'
import '../My/Mypage.css';

const Mypage = () => {
  const member_num = useSelector((state) => state.auth.user?.memberNum);
  const [memberData, setMemberData] = useState(null);
  const [memberId, setMemberId] = useState(''); // State to store the member_id
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState(null);
  const [isEdited, setIsEdited] = useState(false); // 수정 여부 상태 추가
  const [isSaved, setIsSaved] = useState(false); // 저장 여부 상태 추가

  // 회원 정보 조회
  useEffect(() => {
    console.log('Redux member_num:', member_num); // Log member number for debugging
    if (member_num) {
      const fetchMemberInfo = async () => {
        try {
          const response = await axios.get(GET_MEMBER_INFO_API_URL(member_num), {
            withCredentials: true,});


          const data = response.data;
          //회원 아이디 출력 추가
          setMemberId(data.member_id);

          // Map response data to state variables
          setMemberData(data);
          setNickname(data.member_nickname || '');
          setContact(data.member_phone || '');
          setEmail(data.member_email || '');
          setMarketingConsent(data.marketing_consent || false);
          setGender(data.member_gender || '');
          setBirthdate(data.member_birth_date || '');
          console.log("회원정보:",response.data);
        } catch (error) {
          console.error('Error fetching member info:', error);
          setError(error.response?.data?.message || 'Failed to fetch member info');
        }
      };

      fetchMemberInfo();
    }
  }, [member_num]);

  // input 값이 변경될 때마다 isEdited 상태를 true로 설정
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
    setIsEdited(true);
  };

// 마케팅 동의 체크박스 값이 변경될 때마다 isEdited 상태를 true로 설정
const handleMarketingConsentChange = (e) => {
  setMarketingConsent(e.target.checked);
  setIsEdited(true); // 마케팅 동의 변경 시 isEdited 상태 변경
};

// 변경된 정보 유효성 검사 함수들
const validateNickname = (nickname) => {
  if (nickname.length < 1 || nickname.length > 20) {
    return '닉네임은 1자리 이상 20자리 이하만 설정 가능합니다!';
  }
  return null;
};

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return '중복된 이메일이 있거나 이메일 형식이 맞지 않습니다!';
  }
  return null;
};

const validateContact = (contact) => {
  const contactRegex = /^010\d{8}$/;
  if (!contactRegex.test(contact)) {
    return '전화번호는 반드시 010으로 시작하는 11자리 이어야 합니다!';
  }
  return null;
};


  // 수정된 정보를 서버에 업데이트하는 함수
  const handleSave = async () => {
    // 맞지 않는 형식의 정보 수정 시 알럭 추가
    const nicknameError = validateNickname(nickname);
    const emailError = validateEmail(email);
    const contactError = validateContact(contact);

    if (nicknameError || emailError || contactError) {
      setError(nicknameError || emailError || contactError);
      return;
    }

    // 수정된 정보를 서버에 저장하기 전에 확인 메시지를 띄움
  const isConfirmed = window.confirm('회원 정보를 수정하시겠습니까?');
  if (isConfirmed) {
    try {
      const updatedData = {
        member_email: email,
        member_phone: contact,
        member_nickname: nickname,
        marketing_consent: marketingConsent,
      };

      // URL을 member_num을 포함하여 생성합니다.
      const url = UPDATE_MEMBER_INFO_API_URL(member_num);

      // 서버에 PATCH 요청을 보냅니다.
      const response = await axios.patch(url, updatedData, {
        withCredentials: true, // 쿠키와 함께 요청을 보냅니다.
      });

      if (response.status === 200) {
        setIsSaved(true); // 저장 후 성공 메시지 표시
        setIsEdited(false); // 수정 완료 후 isEdited 상태 초기화
        setMemberData(response.data); // 수정된 데이터를 클라이언트 상태에 반영
        setTimeout(() => setIsSaved(false), 3000); // 3초 후 저장 알림 숨김

      }
    } catch (error) {
      console.error('Error updating member info:', error);
      setError(error.response?.data?.message || 'Failed to update member info');
    }
  } else {
    // 사용자가 취소한 경우, 아무 작업도 하지 않습니다.
    console.log('회원 정보 수정이 취소되었습니다.');
  }
};

  // 취소 버튼을 눌렀을 때 수정된 내용을 초기화하는 함수
  const handleCancel = () => {
    setNickname(memberData?.member_nickname || '');
    setContact(memberData?.member_phone || '');
    setEmail(memberData?.member_email || '');
    setMarketingConsent(memberData?.marketing_consent || false);
    setIsEdited(false);

    window.location.reload();
  };


  return (
    <div className="mypage_container">
      <div className="my_page_top">
        <div className="my_page_title">MY PAGE</div>
        <div className="my_page_desc">
          가입 시 작성한 회원 정보를 수정할 수 있습니다.
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {isSaved && <div className="success-message">회원 정보가 성공적으로 수정되었습니다.</div>} 
      <div className="my_page_content">
        <div className="my_page_content_title">회원 정보 수정</div>
        <div className="my_page_content_info">
          <div>
            <label>아이디</label>
            <input type="text" value={memberId || ''} disabled />
          </div>
          <div>
            <label>닉네임</label>
            <input type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => handleInputChange(e, setNickname)} />
          </div>
          <div>
            <label>연락처</label>
            <input type="text"
              placeholder="연락처를 입력하세요"
              value={contact}
              onChange={(e) => handleInputChange(e, setContact)} />
          </div>
          <div className="my_email">
            <label>이메일</label>
            <input type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}  />
          </div>
          <div className="marketing-container">
            {/* 마케팅 동의 체크박스 컨테이너 */}
            <input type="checkbox"
              id="marketingConsent"
              checked={marketingConsent}
              onChange={handleMarketingConsentChange} />
            <label htmlFor="marketingConsent">마케팅 수신 동의</label>
          </div>
          <div className="my_privacy">
            <div className="my_birth">
              <div className="birthdate-display">
                <img src={birthIcon} alt="birtday icon" />
                <span>{birthdate}</span>
              </div>
            </div>
            <div className="my_gender">
              <div className="gender_toggle">
              <button
                  className={gender === '남' ? 'selected' : ''}
                  disabled 
                >
                  남
                </button>
                <button
                  className={gender === '여' ? 'selected' : ''}
                  disabled 
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
        <button
            id="saveBtn"
            className={isEdited ? 'active' : ''} // 수정 사항이 있을 때만 활성화
            disabled={!isEdited}
            onClick={handleSave}
          >
            SAVE
          </button>
          <button 
          id="cancelBtn" 
          className={isEdited? 'active' :''}
          disabled={!isEdited}
          onClick={handleCancel}> {/* 취소 버튼 클릭 시 초기화 */}CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default Mypage;